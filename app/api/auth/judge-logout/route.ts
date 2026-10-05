import { NextResponse } from 'next/server'
import { endSession, errorResponse } from '@/lib/auth'

export async function POST() {
  try {
    await endSession('judge')
    return NextResponse.json({ success: true })
  } catch (error) {
    return errorResponse(error, 'Judge logout error')
  }
}
