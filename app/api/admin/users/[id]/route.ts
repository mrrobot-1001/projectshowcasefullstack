import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { requireAdmin, errorResponse } from '@/lib/auth'
import { logAdminAction } from '@/lib/audit'

type Params = { params: Promise<{ id: string }> }
const EDITABLE = ['name', 'email', 'phone_number', 'enrollment_number', 'is_team_leader', 'team_id']

export async function PATCH(request: Request, { params }: Params) {
  try {
    const admin = await requireAdmin()
    const { id } = await params
    const body = await request.json()
    const updates: Record<string, any> = Object.fromEntries(Object.entries(body).filter(([k]) => EDITABLE.includes(k)))
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    }
    if (typeof updates.email === 'string') updates.email = updates.email.trim().toLowerCase()

    const [user] = await sql`
      UPDATE users SET ${sql(updates)} WHERE id = ${id}
      RETURNING id, email, name, phone_number, enrollment_number, is_team_leader, team_id, created_at
    `
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    await logAdminAction(admin.email, 'update_user', 'user', id, { fields: Object.keys(updates) })
    return NextResponse.json({ user })
  } catch (error) {
    return errorResponse(error, 'Admin user update error')
  }
}

// Deletes the user; their likes go with them, and project counts are corrected.
export async function DELETE(_request: Request, { params }: Params) {
  try {
    const admin = await requireAdmin()
    const { id } = await params

    const deleted = await sql.begin(async tx => {
      const liked = await tx`SELECT project_id FROM likes WHERE user_id = ${id}`
      const [user] = await tx`DELETE FROM users WHERE id = ${id} RETURNING email`
      if (user && liked.length) {
        const ids = liked.map(l => l.project_id)
        await tx`UPDATE projects SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = ANY(${ids})`
      }
      return user
    })
    if (!deleted) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    await logAdminAction(admin.email, 'delete_user', 'user', id, { email: deleted.email })
    return NextResponse.json({ success: true, message: 'User deleted successfully' })
  } catch (error) {
    return errorResponse(error, 'Admin user delete error')
  }
}
