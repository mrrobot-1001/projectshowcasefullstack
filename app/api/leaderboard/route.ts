import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limiter'
import { getCached, setCache } from '@/lib/cache'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const clientIp = request.headers.get('x-forwarded-for') || 'anonymous'
    
    // Rate limiting: 30 requests per minute per IP
    if (!rateLimit(clientIp, { interval: 60000, maxRequests: 30 })) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Check cache first (30 second TTL)
    const cacheKey = `leaderboard:${category || 'all'}`
    const cached = getCached<any>(cacheKey)
    if (cached) {
      return NextResponse.json({ leaderboard: cached }, {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
          'X-Cache': 'HIT'
        }
      })
    }

    const supabase = await createClient()

    let query = supabase
      .from('projects')
      .select('id, title, team_name, category, likes_count')
      .order('likes_count', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(100) // Limit results for performance

    if (category && category !== 'All') {
      query = query.eq('category', category)
    }

    const { data: projects, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Add rank to each project
    const leaderboard = projects?.map((project, index) => ({
      ...project,
      rank: index + 1,
    })) || []

    // Cache for 30 seconds
    setCache(cacheKey, leaderboard, 30000)

    return NextResponse.json({ leaderboard }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        'X-Cache': 'MISS'
      }
    })
  } catch (error) {
    console.error('Leaderboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { email, password, project_id, new_likes_count } = await request.json()

    // Verify admin credentials
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    // Update project likes count
    const { data: project, error } = await supabase
      .from('projects')
      .update({ likes_count: new_likes_count })
      .eq('id', project_id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ 
      project,
      message: 'Leaderboard updated successfully' 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
