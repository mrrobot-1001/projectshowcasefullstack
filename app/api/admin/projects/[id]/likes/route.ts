import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { action } = body // 'increase', 'decrease', or 'reset'

    if (!['increase', 'decrease', 'reset'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Verify service role key exists
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Use service role key to bypass RLS for admin operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get current project
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('likes_count, original_likes_count')
      .eq('id', id)
      .single()

    if (fetchError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    let newLikesCount: number
    let originalLikesCount = project.original_likes_count

    if (action === 'increase') {
      newLikesCount = (project.likes_count || 0) + 1
      // Store original likes count on first manipulation if not already stored
      if (originalLikesCount === null || originalLikesCount === undefined) {
        originalLikesCount = project.likes_count || 0
      }
    } else if (action === 'decrease') {
      const currentLikes = project.likes_count || 0
      if (currentLikes <= 0) {
        return NextResponse.json({ 
          error: 'Cannot decrease likes below 0' 
        }, { status: 400 })
      }
      newLikesCount = currentLikes - 1
      // Store original likes count on first manipulation if not already stored
      if (originalLikesCount === null || originalLikesCount === undefined) {
        originalLikesCount = project.likes_count || 0
      }
    } else { // reset
      // Reset to original likes count
      originalLikesCount = project.original_likes_count ?? project.likes_count ?? 0
      newLikesCount = originalLikesCount
    }

    // Update the project
    const { error: updateError } = await supabase
      .from('projects')
      .update({ 
        likes_count: newLikesCount,
        original_likes_count: originalLikesCount
      })
      .eq('id', id)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update likes' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      likes_count: newLikesCount,
      original_likes_count: originalLikesCount
    })
  } catch (error) {
    console.error('Error manipulating likes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
