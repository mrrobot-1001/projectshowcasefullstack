import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updates = await request.json()
    
    console.log('Updating team:', id, updates)
    
    const { data, error } = await supabase
      .from('teams')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating team:', error)
      throw error
    }

    console.log('Team updated successfully:', data)
    return NextResponse.json({ team: data })
  } catch (error) {
    console.error('Error updating team:', error)
    return NextResponse.json(
      { error: 'Failed to update team' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    console.log('Attempting to delete team:', id)
    
    // First, delete all likes associated with projects of this team
    const { data: teamProjects } = await supabase
      .from('projects')
      .select('id')
      .eq('team_id', id)
    
    if (teamProjects && teamProjects.length > 0) {
      const projectIds = teamProjects.map(p => p.id)
      console.log('Deleting likes for projects:', projectIds)
      
      const { error: likesError } = await supabase
        .from('likes')
        .delete()
        .in('project_id', projectIds)
      
      if (likesError) {
        console.error('Error deleting likes:', likesError)
        // Continue anyway
      }
    }
    
    // Then delete all projects associated with this team
    console.log('Deleting projects for team:', id)
    const { error: projectsError } = await supabase
      .from('projects')
      .delete()
      .eq('team_id', id)

    if (projectsError) {
      console.error('Error deleting projects:', projectsError)
      throw projectsError
    }

    // Finally delete the team
    console.log('Deleting team:', id)
    const { error: teamError } = await supabase
      .from('teams')
      .delete()
      .eq('id', id)

    if (teamError) {
      console.error('Error deleting team:', teamError)
      throw teamError
    }

    console.log('Team deleted successfully:', id)
    return NextResponse.json({ success: true, message: 'Team deleted successfully' })
  } catch (error) {
    console.error('Error deleting team:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete team' },
      { status: 500 }
    )
  }
}
