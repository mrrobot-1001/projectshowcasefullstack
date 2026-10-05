import { SignJWT, jwtVerify } from 'jose'

// Token helpers shared by route handlers and proxy.ts (no Node-only imports).

export type Role = 'user' | 'judge' | 'admin'

export type Session = {
  sub: string
  role: Role
  email: string
  name?: string
}

export const SESSION_COOKIE: Record<Role, string> = {
  user: 'sc_user',
  judge: 'sc_judge',
  admin: 'sc_admin',
}

export const SESSION_MAX_AGE: Record<Role, number> = {
  user: 60 * 60 * 24 * 7,
  judge: 60 * 60 * 24,
  admin: 60 * 60 * 8,
}

function secret() {
  const value = process.env.SESSION_SECRET
  if (!value || value.length < 32) {
    throw new Error('SESSION_SECRET must be set to at least 32 characters')
  }
  return new TextEncoder().encode(value)
}

export async function signSession(session: Session) {
  return new SignJWT({ role: session.role, email: session.email, name: session.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(session.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE[session.role]}s`)
    .sign(secret())
}

export async function verifySession(token: string | undefined, role: Role): Promise<Session | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ['HS256'] })
    if (payload.role !== role || typeof payload.sub !== 'string') return null
    return {
      sub: payload.sub,
      role,
      email: String(payload.email ?? ''),
      name: typeof payload.name === 'string' ? payload.name : undefined,
    }
  } catch {
    return null
  }
}
