import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { requireUser, errorResponse } from '@/lib/auth'

export async function GET() {
  try {
    const user = await requireUser()

    const likes = await sql`
      SELECT l.id, l.category, l.created_at,
             jsonb_build_object(
               'id', p.id, 'title', p.title, 'description', p.description,
               'image_url', p.image_url, 'likes_count', p.likes_count, 'category', p.category
             ) AS project
      FROM likes l
      JOIN projects p ON p.id = l.project_id
      WHERE l.user_id = ${user.sub}
      ORDER BY l.created_at DESC
      LIMIT 50
    `

    return NextResponse.json(likes, {
      headers: { 'Cache-Control': 'private, max-age=5, stale-while-revalidate=10' },
    })
  } catch (error) {
    return errorResponse(error, 'User likes error')
  }
}
