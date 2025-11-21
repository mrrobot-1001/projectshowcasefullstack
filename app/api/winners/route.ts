import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limiter'
import { getCached, setCache, clearCache } from '@/lib/cache'

export async function GET(request: Request) {
  try {
    const clientIp = request.headers.get('x-forwarded-for') || 'anonymous'
    
    // Rate limiting: 30 requests per minute
    if (!rateLimit(`winners:${clientIp}`, { interval: 60000, maxRequests: 30 })) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Check cache first (5 minute TTL for winners)
    const cacheKey = 'winners:all'
    const cached = getCached<any[]>(cacheKey)
    if (cached) {
      return NextResponse.json({ winners: cached }, {
        headers: { 'X-Cache': 'HIT' }
      })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: winners, error } = await supabase
      .from('winners')
      .select('*')
      .order('category')
      .order('position')

    if (error) {
      // Table might not exist yet, return empty array
      return NextResponse.json({ winners: [] })
    }

    // Cache for 5 minutes
    setCache(cacheKey, winners || [], 300000)

    return NextResponse.json({ winners: winners || [] }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'X-Cache': 'MISS'
      }
    })
  } catch (error) {
    console.error('Error fetching winners:', error)
    return NextResponse.json({ winners: [] })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { category, teamId, teamName, score, position } = body

    if (!category || !teamName || !position) {
      return NextResponse.json(
        { error: 'Category, team name, and position are required' },
        { status: 400 }
      )
    }

    // Validate position is 1, 2, or 3
    if (![1, 2, 3].includes(position)) {
      return NextResponse.json(
        { error: 'Position must be 1 (first), 2 (second), or 3 (third)' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if winner already exists for this category and position
    const { data: existing } = await supabase
      .from('winners')
      .select('id')
      .eq('category', category)
      .eq('position', position)
      .maybeSingle()

    if (existing) {
      // Update existing winner
      const { error } = await supabase
        .from('winners')
        .update({ 
          team_id: teamId, 
          team_name: teamName, 
          score, 
          announced_at: new Date().toISOString() 
        })
        .eq('id', existing.id)

      if (error) throw error
    } else {
      // Insert new winner
      const { error } = await supabase
        .from('winners')
        .insert({ 
          category, 
          team_id: teamId, 
          team_name: teamName, 
          score,
          position 
        })

      if (error) throw error
    }

    // Clear cache after update
    clearCache('winners:all')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error announcing winner:', error)
    return NextResponse.json(
      { error: 'Failed to announce winner' },
      { status: 500 }
    )
  }
}
