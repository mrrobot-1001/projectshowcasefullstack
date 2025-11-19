import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { project_id } = await request.json()

    // Get project details
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('category')
      .eq('id', project_id)
      .single()

    if (projectError) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if user has already liked 2 projects in this category
    const { data: existingLikes, error: likesError } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', user.id)
      .eq('category', project.category)

    if (likesError) {
      return NextResponse.json(
        { error: likesError.message },
        { status: 400 }
      )
    }

    if (existingLikes && existingLikes.length >= 2) {
      // Check if one of the likes is for this project
      const alreadyLiked = existingLikes.some(like => like.project_id === project_id)
      
      if (!alreadyLiked) {
        return NextResponse.json(
          { error: 'You can only like 2 projects per category' },
          { status: 400 }
        )
      }
    }

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', user.id)
      .eq('project_id', project_id)
      .single()

    if (existingLike) {
      // Unlike
      const { error: deleteError } = await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id)

      if (deleteError) {
        return NextResponse.json(
          { error: deleteError.message },
          { status: 400 }
        )
      }

      // Decrement likes count
      const { error: updateError } = await supabase.rpc('decrement_likes', {
        project_id,
      })

      if (updateError) {
        console.error('Failed to decrement likes:', updateError)
      }

      return NextResponse.json({ liked: false })
    } else {
      // Like
      const { error: insertError } = await supabase.from('likes').insert({
        user_id: user.id,
        project_id,
        category: project.category,
      })

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 400 }
        )
      }

      // Increment likes count
      const { error: updateError } = await supabase.rpc('increment_likes', {
        project_id,
      })

      if (updateError) {
        console.error('Failed to increment likes:', updateError)
      }

      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('Like error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('project_id')

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !projectId) {
      return NextResponse.json({ liked: false })
    }

    const { data: like } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', user.id)
      .eq('project_id', projectId)
      .single()

    return NextResponse.json({ liked: !!like })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
