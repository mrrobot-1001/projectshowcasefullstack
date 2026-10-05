import { CATEGORIES } from './constants'
import { sql } from './db'

// A user's profile without the password hash, with their team embedded as
// `teams` (the shape the pages were written against).
export async function getProfile(userId: string) {
  const [profile] = await sql`
    SELECT u.id, u.email, u.name, u.phone_number, u.enrollment_number,
           u.is_team_leader, u.team_id, u.created_at,
           (SELECT to_jsonb(t) FROM teams t WHERE t.id = u.team_id) AS teams
    FROM users u
    WHERE u.id = ${userId}
  `
  return profile ?? null
}

// The categories the upload form offers (lib/constants.ts)
export const PROJECT_CATEGORIES: readonly string[] = CATEGORIES

export function generateTeamCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = crypto.getRandomValues(new Uint8Array(8))
  return 'TEAM-' + Array.from(bytes, b => chars[b % chars.length]).join('')
}
