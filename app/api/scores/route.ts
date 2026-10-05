import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession, AuthError, errorResponse } from '@/lib/auth'

const CRITERIA = ['innovation', 'pitching', 'presentation', 'creativity', 'functionality', 'scalability'] as const

// Admin: every score. Judge: only their own (optionally for one project).
export async function GET(request: NextRequest) {
  try {
    const projectId = request.nextUrl.searchParams.get('projectId')
    const admin = await getSession('admin')
    const judge = admin ? null : await getSession('judge')
    if (!admin && !judge) throw new AuthError(401)

    if (projectId && judge) {
      const [score] = await sql`
        SELECT * FROM scores WHERE project_id = ${projectId} AND judge_id = ${judge.sub}
      `
      return NextResponse.json({ score: score ?? null })
    }

    const judgeId = judge?.sub ?? null
    const scores = await sql`
      SELECT * FROM scores
      WHERE (${judgeId}::uuid IS NULL OR judge_id = ${judgeId})
        AND (${projectId}::uuid IS NULL OR project_id = ${projectId})
      ORDER BY created_at DESC
      LIMIT 1000
    `
    return NextResponse.json(scores, { headers: { 'Cache-Control': 'private, no-store' } })
  } catch (error) {
    return errorResponse(error, 'Scores fetch error')
  }
}

// A judge scores a project (creates or updates their score).
export async function POST(request: NextRequest) {
  try {
    const judge = await getSession('judge')
    if (!judge) throw new AuthError(401)

    const { projectId, scores } = await request.json()
    if (typeof projectId !== 'string' || !scores || typeof scores !== 'object') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const values: Record<string, number> = {}
    for (const key of CRITERIA) {
      const n = Number(scores[key] ?? 0)
      if (!Number.isInteger(n) || n < 0 || n > 10) {
        return NextResponse.json({ error: `${key} must be a whole number from 0 to 10` }, { status: 400 })
      }
      values[key] = n
    }
    const total = Object.values(values).reduce((a, b) => a + b, 0)

    const [project] = await sql`SELECT 1 FROM projects WHERE id = ${projectId}`
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    await sql`
      INSERT INTO scores (project_id, judge_id, judge_name, innovation, pitching, presentation,
                          creativity, functionality, scalability, total_score)
      VALUES (${projectId}, ${judge.sub}, ${judge.name ?? judge.email}, ${values.innovation}, ${values.pitching},
              ${values.presentation}, ${values.creativity}, ${values.functionality}, ${values.scalability}, ${total})
      ON CONFLICT (project_id, judge_id) DO UPDATE SET
        judge_name = EXCLUDED.judge_name,
        innovation = EXCLUDED.innovation,
        pitching = EXCLUDED.pitching,
        presentation = EXCLUDED.presentation,
        creativity = EXCLUDED.creativity,
        functionality = EXCLUDED.functionality,
        scalability = EXCLUDED.scalability,
        total_score = EXCLUDED.total_score,
        updated_at = now()
    `
    return NextResponse.json({ success: true })
  } catch (error) {
    return errorResponse(error, 'Score submit error')
  }
}
