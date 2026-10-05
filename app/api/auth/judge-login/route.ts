import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { startSession, verifyPassword, errorResponse } from '@/lib/auth'
import { rateLimit, clientIp } from '@/lib/rate-limiter'

export async function POST(request: NextRequest) {
  try {
    if (!rateLimit(`judge-login:${clientIp(request)}`, { interval: 60000, maxRequests: 10 })) {
      return NextResponse.json({ error: 'Too many login attempts. Please wait a minute.' }, { status: 429 })
    }

    const { email, password } = await request.json()
    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const [judge] = await sql`
      SELECT id, name, email, password_hash FROM judges
      WHERE email = ${email.trim().toLowerCase()} AND is_active
    `
    if (!judge || !(await verifyPassword(password, judge.password_hash))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    await sql`UPDATE judges SET last_login = now() WHERE id = ${judge.id}`
    await startSession({ sub: judge.id, role: 'judge', email: judge.email, name: judge.name })

    return NextResponse.json({
      success: true,
      judge: { id: judge.id, name: judge.name, email: judge.email },
    })
  } catch (error) {
    return errorResponse(error, 'Judge login error')
  }
}
