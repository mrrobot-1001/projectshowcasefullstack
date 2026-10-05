import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { requireAdmin, errorResponse } from '@/lib/auth'

export async function GET() {
  try {
    await requireAdmin()
    const entries = await sql`SELECT * FROM admin_audit_log ORDER BY created_at DESC LIMIT 50`
    return NextResponse.json({ entries })
  } catch (error) {
    return errorResponse(error, 'Audit log error')
  }
}
