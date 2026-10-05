import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { requireAdmin, errorResponse } from '@/lib/auth'
import { logAdminAction } from '@/lib/audit'
import { rateLimit, clientIp } from '@/lib/rate-limiter'
import { getCached, setCache, clearCache } from '@/lib/cache'

export async function GET(request: Request) {
  try {
    const category = new URL(request.url).searchParams.get('category')

    if (!rateLimit(`leaderboard:${clientIp(request)}`, { interval: 60000, maxRequests: 30 })) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const cacheKey = `leaderboard:${category || 'all'}`
    const cached = getCached<any>(cacheKey)
    if (cached) {
      return NextResponse.json({ leaderboard: cached }, {
        headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60', 'X-Cache': 'HIT' },
      })
    }

    const filterCategory = category && category !== 'All' ? category : null
    const projects = await sql`
      SELECT id, title, team_name, category, likes_count
      FROM projects
      WHERE ${filterCategory}::text IS NULL OR category = ${filterCategory}
      ORDER BY likes_count DESC, created_at ASC
      LIMIT 100
    `
    const leaderboard = projects.map((project, index) => ({ ...project, rank: index + 1 }))

    setCache(cacheKey, leaderboard, 30000)
    return NextResponse.json({ leaderboard }, {
      headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60', 'X-Cache': 'MISS' },
    })
  } catch (error) {
    return errorResponse(error, 'Leaderboard error')
  }
}

// Admin "Likes control": set a project's like count directly. Audited.
export async function POST(request: Request) {
  try {
    const admin = await requireAdmin()
    const { project_id, new_likes_count } = await request.json()
    const count = Number(new_likes_count)
    if (typeof project_id !== 'string' || !Number.isInteger(count) || count < 0) {
      return NextResponse.json({ error: 'project_id and a non-negative whole new_likes_count are required' }, { status: 400 })
    }

    const [before] = await sql`SELECT likes_count, title FROM projects WHERE id = ${project_id}`
    if (!before) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const [project] = await sql`
      UPDATE projects
      SET likes_count = ${count},
          original_likes_count = COALESCE(original_likes_count, likes_count),
          updated_at = now()
      WHERE id = ${project_id}
      RETURNING *
    `
    await logAdminAction(admin.email, 'set_likes', 'project', project_id, {
      title: before.title,
      from: before.likes_count,
      to: count,
    })
    clearCache()

    return NextResponse.json({ project, message: 'Leaderboard updated successfully' })
  } catch (error) {
    return errorResponse(error, 'Leaderboard update error')
  }
}
