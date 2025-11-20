import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isValidBennettEmail, getBennettEmailError } from '@/lib/email-validation'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile to find team_id and email
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('team_id, is_team_leader, email')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let team = null

    // If user has a team_id, get that team
    if (profile?.team_id) {
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('*, projects(*)')
        .eq('id', profile.team_id)
        .single()

      if (!teamError) {
        team = teamData
      }
    }

    // If no team found via team_id, search teams where user's email matches a member
    if (!team && profile?.email) {
      const { data: allTeams, error: teamsError } = await supabase
        .from('teams')
        .select('*, projects(*)')

      if (!teamsError && allTeams) {
        // Find team where user's email matches any member
        team = allTeams.find((t: any) => 
          t.members?.some((m: any) => 
            m.email?.toLowerCase() === profile.email?.toLowerCase()
          )
        )
      }
    }

    if (!team) {
      return NextResponse.json({ error: 'No team found' }, { status: 404 })
    }

    // Add user role info
    return NextResponse.json({
      ...team,
      isTeamLeader: profile.is_team_leader
    })
  } catch (error) {
    console.error('Error in my-team endpoint:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile to verify team leader status
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('team_id, is_team_leader')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.team_id) {
      return NextResponse.json({ error: 'No team found' }, { status: 404 })
    }

    if (!profile.is_team_leader) {
      return NextResponse.json({ error: 'Only team leaders can update team info' }, { status: 403 })
    }

    const body = await request.json()
    const { members } = body

    // Validate all member emails
    if (members && Array.isArray(members)) {
      for (const member of members) {
        if (!member.email || !isValidBennettEmail(member.email)) {
          return NextResponse.json({ 
            error: getBennettEmailError(member.email || 'invalid email') 
          }, { status: 400 })
        }
      }
    }

    // Update team members
    const { error: updateError } = await supabase
      .from('teams')
      .update({ members })
      .eq('id', profile.team_id)

    if (updateError) {
      console.error('Error updating team:', updateError)
      return NextResponse.json({ error: 'Failed to update team' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Team members updated successfully' })
  } catch (error) {
    console.error('Error in my-team PATCH:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
