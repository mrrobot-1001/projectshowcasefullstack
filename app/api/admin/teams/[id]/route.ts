import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { requireAdmin, errorResponse } from '@/lib/auth'
import { logAdminAction } from '@/lib/audit'

type Params = { params: Promise<{ id: string }> }
const EDITABLE = ['team_name', 'leader_name', 'leader_email', 'members', 'unique_team_code']

export async function PATCH(request: Request, { params }: Params) {
  try {
    const admin = await requireAdmin()
    const { id } = await params
    const body = await request.json()
    const updates: Record<string, any> = Object.fromEntries(Object.entries(body).filter(([k]) => EDITABLE.includes(k)))
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    }
    if ('members' in updates) updates.members = sql.json(Array.isArray(updates.members) ? updates.members : [])

    const team = await sql.begin(async tx => {
      const [row] = await tx`UPDATE teams SET ${tx(updates)} WHERE id = ${id} RETURNING *`
      // Projects carry a copy of the team name for listings
      if (row && 'team_name' in updates) {
        await tx`UPDATE projects SET team_name = ${row.team_name} WHERE team_id = ${id}`
      }
      return row
    })
    if (!team) return NextResponse.json({ error: 'Team not found' }, { status: 404 })

    await logAdminAction(admin.email, 'update_team', 'team', id, { fields: Object.keys(updates) })
    return NextResponse.json({ team })
  } catch (error) {
    return errorResponse(error, 'Admin team update error')
  }
}

// Deletes the team and (via cascade) its projects, their likes and scores.
export async function DELETE(_request: Request, { params }: Params) {
  try {
    const admin = await requireAdmin()
    const { id } = await params
    const [team] = await sql`DELETE FROM teams WHERE id = ${id} RETURNING team_name`
    if (!team) return NextResponse.json({ error: 'Team not found' }, { status: 404 })

    await logAdminAction(admin.email, 'delete_team', 'team', id, { team_name: team.team_name })
    return NextResponse.json({ success: true, message: 'Team deleted successfully' })
  } catch (error) {
    return errorResponse(error, 'Admin team delete error')
  }
}
