import { NextResponse } from 'next/server'
import { requireAdmin, errorResponse } from '@/lib/auth'

export async function GET() {
  try {
    const admin = await requireAdmin()
    return NextResponse.json({ email: admin.email })
  } catch (error) {
    return errorResponse(error, 'Admin session error')
  }
}
