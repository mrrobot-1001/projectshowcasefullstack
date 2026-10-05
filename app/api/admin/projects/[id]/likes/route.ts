import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { requireAdmin, errorResponse } from '@/lib/auth'
import { logAdminAction } from '@/lib/audit'
import { clearCache } from '@/lib/cache'

type Params = { params: Promise<{ id: string }> }

// Admin nudges a project's like count up/down, or resets it to the real
// number of votes. Every change is written to admin_audit_log.
export async function PATCH(request: Request, { params }: Params) {
  try {
    const admin = await requireAdmin()
    const { id } = await params
    const { action } = await request.json()
    if (!['increase', 'decrease', 'reset'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const [project] = await sql`
      SELECT likes_count, original_likes_count,
             (SELECT count(*)::int FROM likes l WHERE l.project_id = p.id) AS real_likes
      FROM projects p WHERE id = ${id}
    `
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    if (action === 'decrease' && project.likes_count <= 0) {
      return NextResponse.json({ error: 'Cannot decrease likes below 0' }, { status: 400 })
    }

    const newCount =
      action === 'increase' ? project.likes_count + 1 :
      action === 'decrease' ? project.likes_count - 1 :
      project.real_likes
    const original = action === 'reset' ? null : project.original_likes_count ?? project.likes_count

    await sql`
      UPDATE projects SET likes_count = ${newCount}, original_likes_count = ${original}, updated_at = now()
      WHERE id = ${id}
    `
    await logAdminAction(admin.email, `likes_${action}`, 'project', id, { from: project.likes_count, to: newCount })
    clearCache()

    return NextResponse.json({ success: true, likes_count: newCount, original_likes_count: original })
  } catch (error) {
    return errorResponse(error, 'Admin likes error')
  }
}
