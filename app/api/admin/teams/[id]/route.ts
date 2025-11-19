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
      .from('teams')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

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
  { params }: { params: { id: string } }
) {
  try {
    // First delete all projects associated with this team
    const { error: projectsError } = await supabase
      .from('projects')
      .delete()
      .eq('team_id', params.id)

    if (projectsError) throw projectsError

    // Then delete the team
    const { error: teamError } = await supabase
      .from('teams')
      .delete()
      .eq('id', params.id)

    if (teamError) throw teamError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting team:', error)
    return NextResponse.json(
      { error: 'Failed to delete team' },
      { status: 500 }
    )
  }
}
