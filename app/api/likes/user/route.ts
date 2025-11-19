import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all likes by this user with project details in one query
    const { data: likes, error } = await supabase
      .from('likes')
      .select(`
        id,
        category,
        created_at,
        project:projects(
          id,
          title,
          description,
          image_url,
          likes_count,
          category
        )
      `)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Flatten the data structure
    const formattedLikes = (likes || []).map((like: any) => ({
      id: like.id,
      category: like.category,
      created_at: like.created_at,
      project: like.project
    }))

    return NextResponse.json(formattedLikes)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
