import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { hashPassword, errorResponse } from '@/lib/auth'
import { generateTeamCode } from '@/lib/queries'
import { isValidBennettEmail, getBennettEmailError } from '@/lib/email-validation'
import { rateLimit, clientIp } from '@/lib/rate-limiter'

export async function POST(request: Request) {
  try {
    if (!rateLimit(`signup:${clientIp(request)}`, { interval: 60000, maxRequests: 10 })) {
      return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 })
    }

    const { email, password, name, phone_number, participating, teamData } = await request.json()

    if (!isValidBennettEmail(email)) {
      return NextResponse.json({ error: getBennettEmailError(email) }, { status: 400 })
    }
    if (typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }
    if (typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const [taken] = await sql`SELECT 1 FROM users WHERE email = ${normalizedEmail}`
    if (taken) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 })
    }

    const members = participating && Array.isArray(teamData?.members) ? teamData.members : []
    const invalidMembers = members.filter((m: any) => m?.email && !isValidBennettEmail(m.email))
    if (invalidMembers.length > 0) {
      return NextResponse.json(
        {
          error: `Invalid team member email(s): ${invalidMembers.map((m: any) => m.email).join(', ')}. Only Bennett University emails are allowed.`,
        },
        { status: 400 }
      )
    }
    if (participating && !teamData?.teamName?.trim()) {
      return NextResponse.json({ error: 'Team name is required' }, { status: 400 })
    }

    const passwordHash = await hashPassword(password)

    const result = await sql.begin(async tx => {
      const [user] = await tx`
        INSERT INTO users (email, password_hash, name, phone_number, is_team_leader)
        VALUES (${normalizedEmail}, ${passwordHash}, ${name.trim()}, ${phone_number || null}, ${!!participating})
        RETURNING id, email
      `
      if (!participating) return { user, teamId: null, teamCode: null }

      const teamCode = generateTeamCode()
      const [team] = await tx`
        INSERT INTO teams (team_name, leader_id, leader_name, leader_email, members, unique_team_code)
        VALUES (${teamData.teamName.trim()}, ${user.id}, ${name.trim()}, ${normalizedEmail}, ${tx.json(members)}, ${teamCode})
        RETURNING id
      `
      await tx`UPDATE users SET team_id = ${team.id} WHERE id = ${user.id}`
      return { user, teamId: team.id, teamCode }
    })

    return NextResponse.json({ ...result, message: 'Signup successful! You can now login.' })
  } catch (error) {
    return errorResponse(error, 'Signup error')
  }
}
