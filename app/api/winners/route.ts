import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { requireAdmin, errorResponse } from '@/lib/auth'
import { logAdminAction } from '@/lib/audit'
import { rateLimit, clientIp } from '@/lib/rate-limiter'
import { getCached, setCache, clearCache } from '@/lib/cache'

export async function GET(request: Request) {
  try {
    if (!rateLimit(`winners:${clientIp(request)}`, { interval: 60000, maxRequests: 30 })) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const cached = getCached<any[]>('winners:all')
    if (cached) {
      return NextResponse.json({ winners: cached }, { headers: { 'X-Cache': 'HIT' } })
    }

    const winners = await sql`SELECT * FROM winners ORDER BY category, position`
    setCache('winners:all', winners, 300000)

    return NextResponse.json({ winners }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120', 'X-Cache': 'MISS' },
    })
  } catch (error) {
    return errorResponse(error, 'Winners fetch error')
  }
}

// Admin announces (or replaces) the 1st/2nd/3rd place for a category.
export async function POST(request: Request) {
  try {
    const admin = await requireAdmin()
    const { category, teamId, teamName, score, position } = await request.json()

    if (!category || !teamName || !position) {
      return NextResponse.json({ error: 'Category, team name, and position are required' }, { status: 400 })
    }
    if (![1, 2, 3].includes(position)) {
      return NextResponse.json({ error: 'Position must be 1 (first), 2 (second), or 3 (third)' }, { status: 400 })
    }

    await sql`
      INSERT INTO winners (category, team_id, team_name, score, position)
      VALUES (${category}, ${teamId || null}, ${teamName}, ${score ?? null}, ${position})
      ON CONFLICT (category, position) DO UPDATE SET
        team_id = EXCLUDED.team_id,
        team_name = EXCLUDED.team_name,
        score = EXCLUDED.score,
        announced_at = now()
    `
    await logAdminAction(admin.email, 'announce_winner', 'team', teamId || null, { category, position, teamName })
    clearCache('winners:all')

    return NextResponse.json({ success: true })
  } catch (error) {
    return errorResponse(error, 'Announce winner error')
  }
}
