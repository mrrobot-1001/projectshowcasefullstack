import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { requireUser, errorResponse } from '@/lib/auth'
import { isValidBennettEmail, getBennettEmailError } from '@/lib/email-validation'

// The current user's team (by team_id, or by appearing in a team's member list).
export async function GET() {
  try {
    const user = await requireUser()

    const [profile] = await sql`SELECT team_id, is_team_leader, email FROM users WHERE id = ${user.sub}`
    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const [team] = await sql`
      SELECT t.*,
             COALESCE((SELECT jsonb_agg(to_jsonb(p) ORDER BY p.created_at) FROM projects p WHERE p.team_id = t.id), '[]') AS projects
      FROM teams t
      WHERE t.id = ${profile.team_id}
         OR EXISTS (SELECT 1 FROM jsonb_array_elements(t.members) m
                    WHERE lower(m->>'email') = lower(${profile.email}))
      ORDER BY (t.id = ${profile.team_id}) DESC NULLS LAST
      LIMIT 1
    `
    if (!team) {
      return NextResponse.json({ error: 'No team found' }, { status: 404 })
    }

    return NextResponse.json(
      { ...team, isTeamLeader: profile.is_team_leader },
      { headers: { 'Cache-Control': 'private, max-age=5, stale-while-revalidate=10' } }
    )
  } catch (error) {
    return errorResponse(error, 'My team error')
  }
}

// Team leader updates the member list.
export async function PATCH(request: Request) {
  try {
    const user = await requireUser()

    const [profile] = await sql`SELECT team_id, is_team_leader FROM users WHERE id = ${user.sub}`
    if (!profile?.team_id) {
      return NextResponse.json({ error: 'No team found' }, { status: 404 })
    }
    if (!profile.is_team_leader) {
      return NextResponse.json({ error: 'Only team leaders can update team info' }, { status: 403 })
    }

    const { members } = await request.json()
    if (!Array.isArray(members) || members.length > 10) {
      return NextResponse.json({ error: 'members must be a list of up to 10 people' }, { status: 400 })
    }
    for (const member of members) {
      if (!member?.email || !isValidBennettEmail(member.email)) {
        return NextResponse.json({ error: getBennettEmailError(member?.email || 'invalid email') }, { status: 400 })
      }
    }
    const clean = members.map((m: any) => ({ name: String(m.name ?? '').trim(), email: String(m.email).trim() }))

    await sql`UPDATE teams SET members = ${sql.json(clean)} WHERE id = ${profile.team_id}`
    return NextResponse.json({ success: true, message: 'Team members updated successfully' })
  } catch (error) {
    return errorResponse(error, 'My team update error')
  }
}
