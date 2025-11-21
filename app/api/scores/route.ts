import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limiter'
import { getCached, setCache } from '@/lib/cache'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const projectId = searchParams.get('projectId')
    const judgeId = searchParams.get('judgeId')
    const clientIp = request.headers.get('x-forwarded-for') || 'anonymous'

    // Rate limiting: 60 requests per minute
    if (!rateLimit(`scores:${clientIp}`, { interval: 60000, maxRequests: 60 })) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    if (projectId && judgeId) {
      // Check cache for specific score
      const cacheKey = `score:${projectId}:${judgeId}`
      const cached = getCached<any>(cacheKey)
      if (cached) {
        return NextResponse.json({ score: cached })
      }

      // Get specific score
      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .eq('project_id', projectId)
        .eq('judge_id', judgeId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      // Cache for 5 minutes
      if (data) {
        setCache(cacheKey, data, 300000)
      }

      return NextResponse.json({ score: data })
    }

    // Check cache for all scores
    const allScoresCacheKey = 'scores:all'
    const cachedAll = getCached<any[]>(allScoresCacheKey)
    if (cachedAll) {
      return NextResponse.json(cachedAll, {
        headers: { 'X-Cache': 'HIT' }
      })
    }

    // Get all scores (for admin results) - optimized query
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000) // Add limit to prevent excessive data transfer

    if (error) throw error

    // Cache all scores for 1 minute
    setCache(allScoresCacheKey, data, 60000)

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'X-Cache': 'MISS'
      }
    })
  } catch (error) {
    console.error('Error fetching scores:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectId, judgeId, judgeName, scores } = body

    if (!projectId || !judgeId || !judgeName || !scores) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Calculate total
    const total = Object.values(scores).reduce((a: number, b: any) => a + b, 0)

    // Check if score already exists
    const { data: existing } = await supabase
      .from('scores')
      .select('id')
      .eq('project_id', projectId)
      .eq('judge_id', judgeId)
      .single()

    if (existing) {
      // Update existing score
      const { error } = await supabase
        .from('scores')
        .update({
          judge_name: judgeName,
          innovation: scores.innovation,
          pitching: scores.pitching,
          presentation: scores.presentation,
          creativity: scores.creativity,
          functionality: scores.functionality,
          scalability: scores.scalability,
          total_score: total,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)

      if (error) throw error
    } else {
      // Insert new score
      const { error } = await supabase
        .from('scores')
        .insert({
          project_id: projectId,
          judge_id: judgeId,
          judge_name: judgeName,
          innovation: scores.innovation,
          pitching: scores.pitching,
          presentation: scores.presentation,
          creativity: scores.creativity,
          functionality: scores.functionality,
          scalability: scores.scalability,
          total_score: total
        })

      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error submitting score:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
