import { NextResponse } from 'next/server'
import { endSession, errorResponse } from '@/lib/auth'

export async function POST() {
  try {
    await endSession('admin')
    return NextResponse.json({ success: true })
  } catch (error) {
    return errorResponse(error, 'Admin logout error')
  }
}
