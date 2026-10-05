import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { requireAdmin, errorResponse } from '@/lib/auth'

export async function GET() {
  try {
    await requireAdmin()
    const projects = await sql`
      SELECT p.*, (SELECT to_jsonb(t) FROM teams t WHERE t.id = p.team_id) AS teams
      FROM projects p ORDER BY p.created_at DESC
    `
    return NextResponse.json({ projects })
  } catch (error) {
    return errorResponse(error, 'Admin projects error')
  }
}
