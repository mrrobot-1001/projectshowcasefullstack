import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createHash, timingSafeEqual } from 'crypto'
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySession, type Role, type Session } from './session'

export type { Session } from './session'

export class AuthError extends Error {
  constructor(public status: 401 | 403, message = status === 401 ? 'Unauthorized' : 'Forbidden') {
    super(message)
  }
}

export async function startSession(session: Session) {
  const store = await cookies()
  store.set(SESSION_COOKIE[session.role], await signSession(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE[session.role],
  })
}

export async function endSession(role: Role) {
  const store = await cookies()
  store.delete(SESSION_COOKIE[role])
}

export async function getSession(role: Role) {
  const store = await cookies()
  return verifySession(store.get(SESSION_COOKIE[role])?.value, role)
}

async function requireRole(role: Role) {
  const session = await getSession(role)
  if (!session) throw new AuthError(401)
  return session
}

export const requireUser = () => requireRole('user')
export const requireJudge = () => requireRole('judge')
export const requireAdmin = () => requireRole('admin')

// Turns an AuthError into its HTTP response; anything else becomes a 500.
export function errorResponse(error: unknown, context: string) {
  if (error instanceof AuthError) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }
  // Malformed id in the URL/body (invalid_text_representation, e.g. not a uuid)
  if ((error as { code?: string })?.code === '22P02') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  console.error(`${context}:`, error)
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
}

export const hashPassword = (password: string) => bcrypt.hash(password, 12)
export const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash)

// Compares in constant time so the response time doesn't leak how much matched.
function safeEqual(a: string, b: string) {
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

export function isAdminLogin(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminEmail || !adminPassword) return false
  const emailOk = safeEqual(email.trim().toLowerCase(), adminEmail.toLowerCase())
  const passwordOk = safeEqual(password, adminPassword)
  return emailOk && passwordOk
}
