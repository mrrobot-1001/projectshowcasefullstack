import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json()
    
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ user: data })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // First, get user's projects and delete their likes
    const { data: userProjects } = await supabase
      .from('projects')
      .select('id')
      .eq('team_id', params.id)

    if (userProjects) {
      for (const project of userProjects) {
        await supabase
          .from('likes')
          .delete()
          .eq('project_id', project.id)
      }
    }

    // Delete user's likes
    await supabase
      .from('likes')
      .delete()
      .eq('user_id', params.id)

    // Delete the user
    const { error: userError } = await supabase
      .from('users')
      .delete()
      .eq('id', params.id)

    if (userError) throw userError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
