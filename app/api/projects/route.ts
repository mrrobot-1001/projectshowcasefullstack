import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { requireUser, errorResponse } from '@/lib/auth'
import { saveImage, UploadError } from '@/lib/uploads'
import { PROJECT_CATEGORIES } from '@/lib/queries'

const isHttpUrl = (value: string) => /^https?:\/\/\S+$/i.test(value)

// Submit a project for a team (the team code proves you belong to it).
export async function POST(request: Request) {
  try {
    await requireUser()

    const formData = await request.formData()
    const title = String(formData.get('title') ?? '').trim()
    const description = String(formData.get('description') ?? '').trim()
    const category = String(formData.get('category') ?? '')
    const githubUrl = String(formData.get('github_url') ?? '').trim()
    const demoUrl = String(formData.get('demo_url') ?? '').trim()
    const teamCode = String(formData.get('team_code') ?? '').trim()
    const image = formData.get('image')

    let tags: string[] = []
    try {
      const parsed = JSON.parse(String(formData.get('tags') ?? '[]'))
      if (Array.isArray(parsed)) tags = parsed.map(String).slice(0, 20)
    } catch {
      // tags are optional
    }

    if (!title || !category) {
      return NextResponse.json({ error: 'Title and category are required' }, { status: 400 })
    }
    if (!PROJECT_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }
    if ((githubUrl && !isHttpUrl(githubUrl)) || (demoUrl && !isHttpUrl(demoUrl))) {
      return NextResponse.json({ error: 'Links must start with http:// or https://' }, { status: 400 })
    }

    const [team] = await sql`SELECT id, team_name FROM teams WHERE unique_team_code = ${teamCode}`
    if (!team) {
      return NextResponse.json({ error: 'Invalid team code' }, { status: 400 })
    }

    const imageUrl = image instanceof File && image.size > 0 ? await saveImage(image, 'projects') : ''

    const [project] = await sql`
      INSERT INTO projects (title, description, category, image_url, team_id, team_name, tags, github_url, demo_url)
      VALUES (${title}, ${description}, ${category}, ${imageUrl}, ${team.id}, ${team.team_name},
              ${tags}, ${githubUrl || null}, ${demoUrl || null})
      RETURNING *
    `
    return NextResponse.json({ project })
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return errorResponse(error, 'Project upload error')
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')?.trim()

    const filterCategory = category && category !== 'All' ? category : null
    const pattern = search ? `%${search.replace(/[\\%_]/g, '\\$&')}%` : null

    const projects = await sql`
      SELECT * FROM projects
      WHERE (${filterCategory}::text IS NULL OR category = ${filterCategory})
        AND (${pattern}::text IS NULL OR title ILIKE ${pattern} OR description ILIKE ${pattern})
      ORDER BY likes_count DESC, created_at ASC
    `

    return NextResponse.json(projects, {
      headers: { 'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30' },
    })
  } catch (error) {
    return errorResponse(error, 'Projects list error')
  }
}
