import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password, name, phone_number, participating, teamData } = await request.json()

    // Validate Bennett email
    if (!email.endsWith('@bennett.edu.in')) {
      return NextResponse.json(
        { error: 'Only @bennett.edu.in email addresses are allowed' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Sign up the user (without email confirmation)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/`,
        data: {
          name,
          phone_number,
        },
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 400 })
    }

    // Use service role client to bypass RLS for user creation
    const supabaseAdmin = await createServiceClient()

    // Create user profile
    const { error: profileError } = await supabaseAdmin.from('users').insert({
      id: authData.user.id,
      email,
      name,
      phone_number,
      is_team_leader: participating || false,
    })

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    // If participating in showcase, create team
    let teamId = null
    if (participating && teamData) {
      const uniqueCode = generateUniqueTeamCode()
      
      const { data: team, error: teamError } = await supabaseAdmin
        .from('teams')
        .insert({
          team_name: teamData.teamName,
          leader_id: authData.user.id,
          leader_name: name,
          leader_email: email,
          members: teamData.members || [],
          unique_team_code: uniqueCode,
        })
        .select()
        .single()

      if (teamError) {
        return NextResponse.json({ error: teamError.message }, { status: 400 })
      }

      teamId = team.id

      // Update user with team_id
      await supabaseAdmin
        .from('users')
        .update({ team_id: teamId })
        .eq('id', authData.user.id)
    }

    return NextResponse.json({
      user: authData.user,
      teamId,
      message: 'Signup successful! You can now login.',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateUniqueTeamCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = 'TEAM-'
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return code
}
