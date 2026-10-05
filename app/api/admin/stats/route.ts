import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { requireAdmin, errorResponse } from '@/lib/auth'

export async function GET() {
  try {
    await requireAdmin()

    const [counts] = await sql`
      SELECT (SELECT count(*)::int FROM teams)    AS "totalTeams",
             (SELECT count(*)::int FROM projects) AS "totalProjects",
             (SELECT count(*)::int FROM users)    AS "totalUsers",
             (SELECT count(*)::int FROM likes)    AS "totalLikes"
    `
    const rows = await sql`SELECT category, count(*)::int AS count FROM projects GROUP BY category`
    const projectsByCategory = Object.fromEntries(rows.map(r => [r.category, r.count]))

    return NextResponse.json({ stats: { ...counts, projectsByCategory } }, { headers: { 'Cache-Control': 'private, no-store' } })
  } catch (error) {
    return errorResponse(error, 'Admin stats error')
  }
}
