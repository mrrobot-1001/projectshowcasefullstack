import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const projectId = searchParams.get('projectId')
    const judgeId = searchParams.get('judgeId')

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

      return NextResponse.json({ score: data })
    }

    // Get all scores (for admin results)
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
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
