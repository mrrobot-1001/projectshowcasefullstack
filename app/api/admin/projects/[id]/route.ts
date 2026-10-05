import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { requireAdmin, errorResponse } from '@/lib/auth'
import { logAdminAction } from '@/lib/audit'
import { clearCache } from '@/lib/cache'

type Params = { params: Promise<{ id: string }> }
// likes_count is changed only through the audited Likes control
const EDITABLE = ['title', 'description', 'category', 'tags', 'github_url', 'demo_url', 'image_url']

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const admin = await requireAdmin()
    const { id } = await params
    const [project] = await sql`DELETE FROM projects WHERE id = ${id} RETURNING title`
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

    await logAdminAction(admin.email, 'delete_project', 'project', id, { title: project.title })
    clearCache()
    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    return errorResponse(error, 'Admin project delete error')
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const admin = await requireAdmin()
    const { id } = await params
    const body = await request.json()
    const updates: Record<string, any> = Object.fromEntries(Object.entries(body).filter(([k]) => EDITABLE.includes(k)))
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    }

    const [project] = await sql`
      UPDATE projects SET ${sql(updates)}, updated_at = now() WHERE id = ${id} RETURNING *
    `
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

    await logAdminAction(admin.email, 'update_project', 'project', id, { fields: Object.keys(updates) })
    clearCache()
    return NextResponse.json({ project })
  } catch (error) {
    return errorResponse(error, 'Admin project update error')
  }
}
