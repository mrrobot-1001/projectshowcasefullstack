import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { requireAdmin, errorResponse } from '@/lib/auth'

export async function GET() {
  try {
    await requireAdmin()
    const users = await sql`
      SELECT id, email, name, phone_number, enrollment_number, is_team_leader, team_id, created_at
      FROM users ORDER BY created_at DESC
    `
    return NextResponse.json({ users })
  } catch (error) {
    return errorResponse(error, 'Admin users error')
  }
}
