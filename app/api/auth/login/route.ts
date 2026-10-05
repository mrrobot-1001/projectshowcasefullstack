import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { startSession, verifyPassword, errorResponse } from '@/lib/auth'
import { getProfile } from '@/lib/queries'
import { rateLimit, clientIp } from '@/lib/rate-limiter'

// Student / team-leader login. Admins sign in at /admin/login.
export async function POST(request: Request) {
  try {
    if (!rateLimit(`login:${clientIp(request)}`, { interval: 60000, maxRequests: 10 })) {
      return NextResponse.json({ error: 'Too many login attempts. Please wait a minute.' }, { status: 429 })
    }

    const { email, password } = await request.json()
    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const [user] = await sql`
      SELECT id, email, name, password_hash FROM users WHERE email = ${email.trim().toLowerCase()}
    `
    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    await startSession({ sub: user.id, role: 'user', email: user.email, name: user.name })

    return NextResponse.json({
      user: { id: user.id, email: user.email },
      profile: await getProfile(user.id),
      isAdmin: false,
    })
  } catch (error) {
    return errorResponse(error, 'Login error')
  }
}
