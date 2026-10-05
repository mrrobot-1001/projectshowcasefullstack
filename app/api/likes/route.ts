import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { requireUser, getSession, errorResponse } from '@/lib/auth'

const LIKES_PER_CATEGORY = 2

// Toggle the current user's like on a project (max 2 likes per category).
export async function POST(request: Request) {
  try {
    const user = await requireUser()
    const { project_id } = await request.json()
    if (typeof project_id !== 'string') {
      return NextResponse.json({ error: 'project_id is required' }, { status: 400 })
    }

    const result = await sql.begin(async tx => {
      // Serialise this user's like changes so two quick clicks can't exceed the limit
      await tx`SELECT pg_advisory_xact_lock(hashtext(${user.sub}))`

      const [project] = await tx`SELECT id, category FROM projects WHERE id = ${project_id}`
      if (!project) return { status: 404, body: { error: 'Project not found' } }

      const [existing] = await tx`
        SELECT id FROM likes WHERE user_id = ${user.sub} AND project_id = ${project_id}
      `
      if (existing) {
        await tx`DELETE FROM likes WHERE id = ${existing.id}`
        await tx`UPDATE projects SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = ${project_id}`
        return { status: 200, body: { liked: false } }
      }

      const [{ count }] = await tx`
        SELECT count(*)::int AS count FROM likes
        WHERE user_id = ${user.sub} AND category = ${project.category}
      `
      if (count >= LIKES_PER_CATEGORY) {
        return { status: 400, body: { error: `You can only like ${LIKES_PER_CATEGORY} projects per category` } }
      }

      await tx`
        INSERT INTO likes (user_id, project_id, category)
        VALUES (${user.sub}, ${project_id}, ${project.category})
      `
      await tx`UPDATE projects SET likes_count = likes_count + 1 WHERE id = ${project_id}`
      return { status: 200, body: { liked: true } }
    })

    return NextResponse.json(result.body, { status: result.status })
  } catch (error) {
    return errorResponse(error, 'Like error')
  }
}

export async function GET(request: Request) {
  try {
    const projectId = new URL(request.url).searchParams.get('project_id')
    const user = await getSession('user')
    if (!user || !projectId) {
      return NextResponse.json({ liked: false })
    }

    const [like] = await sql`
      SELECT 1 FROM likes WHERE user_id = ${user.sub} AND project_id = ${projectId}
    `
    return NextResponse.json({ liked: !!like })
  } catch (error) {
    return errorResponse(error, 'Like status error')
  }
}
