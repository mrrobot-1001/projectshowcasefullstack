import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { requireUser, AuthError, errorResponse, type Session } from '@/lib/auth'

type Params = { params: Promise<{ id: string }> }

// Fields a team may change on its own project (never likes or team).
const EDITABLE = ['title', 'description', 'category', 'tags', 'github_url', 'demo_url', 'image_url'] as const

// Team leader or any listed member of the project's team.
async function assertTeamMember(user: Session, projectId: string) {
  const [row] = await sql`
    SELECT p.id
    FROM projects p
    JOIN teams t ON t.id = p.team_id
    LEFT JOIN users u ON u.id = ${user.sub}
    WHERE p.id = ${projectId}
      AND (u.team_id = t.id
           OR t.leader_id = ${user.sub}
           OR EXISTS (SELECT 1 FROM jsonb_array_elements(t.members) m
                      WHERE lower(m->>'email') = ${user.email.toLowerCase()}))
  `
  if (!row) throw new AuthError(403, 'Only members of this team can change this project')
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params
    const [project] = await sql`
      SELECT p.*, (SELECT to_jsonb(t) FROM teams t WHERE t.id = p.team_id) AS teams
      FROM projects p WHERE p.id = ${id}
    `
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    return NextResponse.json({ project })
  } catch (error) {
    return errorResponse(error, 'Project fetch error')
  }
}

async function update(request: Request, { params }: Params) {
  try {
    const { id } = await params
    const user = await requireUser()
    await assertTeamMember(user, id)

    const body = await request.json()
    const updates = Object.fromEntries(Object.entries(body).filter(([key]) => (EDITABLE as readonly string[]).includes(key)))
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    }

    const [project] = await sql`
      UPDATE projects SET ${sql(updates as Record<string, any>)}, updated_at = now()
      WHERE id = ${id}
      RETURNING *
    `
    return NextResponse.json({ project })
  } catch (error) {
    return errorResponse(error, 'Project update error')
  }
}

export const PUT = update
export const PATCH = update

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params
    const user = await requireUser()
    await assertTeamMember(user, id)

    await sql`DELETE FROM projects WHERE id = ${id}`
    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    return errorResponse(error, 'Project delete error')
  }
}
