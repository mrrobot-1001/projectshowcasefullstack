import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: winners, error } = await supabase
      .from('winners')
      .select('*')
      .order('category')

    if (error) {
      // Table might not exist yet, return empty array
      return NextResponse.json({ winners: [] })
    }

    return NextResponse.json({ winners: winners || [] })
  } catch (error) {
    console.error('Error fetching winners:', error)
    return NextResponse.json({ winners: [] })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { category, teamId, teamName, score } = body

    if (!category || !teamName) {
      return NextResponse.json(
        { error: 'Category and team name are required' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if winner already exists for this category
    const { data: existing } = await supabase
      .from('winners')
      .select('id')
      .eq('category', category)
      .single()

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
          score 
        })

      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error announcing winner:', error)
    return NextResponse.json(
      { error: 'Failed to announce winner' },
      { status: 500 }
    )
  }
}
