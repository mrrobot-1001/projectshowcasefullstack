import { NextResponse } from 'next/server'
import { startSession, isAdminLogin, errorResponse } from '@/lib/auth'
import { rateLimit, clientIp } from '@/lib/rate-limiter'

// Credentials come from ADMIN_EMAIL / ADMIN_PASSWORD in the server environment.
export async function POST(request: Request) {
  try {
    if (!rateLimit(`admin-login:${clientIp(request)}`, { interval: 15 * 60000, maxRequests: 5 })) {
      return NextResponse.json({ error: 'Too many attempts. Try again in 15 minutes.' }, { status: 429 })
    }

    const { email, password } = await request.json()
    if (typeof email !== 'string' || typeof password !== 'string' || !isAdminLogin(email, password)) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 })
    }

    const adminEmail = process.env.ADMIN_EMAIL!.toLowerCase()
    await startSession({ sub: 'admin', role: 'admin', email: adminEmail, name: 'Admin' })
    return NextResponse.json({ success: true })
  } catch (error) {
    return errorResponse(error, 'Admin login error')
  }
}
