import { NextResponse } from 'next/server'
import { getSession, errorResponse } from '@/lib/auth'
import { getProfile } from '@/lib/queries'

export async function GET() {
  try {
    const session = await getSession('user')
    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const profile = await getProfile(session.sub)
    if (!profile) {
      // Account was deleted while the session was still valid
      return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({
      ...profile,
      team_code: profile.teams?.unique_team_code ?? null,
    })
  } catch (error) {
    return errorResponse(error, 'Get user error')
  }
}
