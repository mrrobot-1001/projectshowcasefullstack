import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const tags = JSON.parse(formData.get('tags') as string)
    const githubUrl = formData.get('github_url') as string
    const demoUrl = formData.get('demo_url') as string
    const teamCode = formData.get('team_code') as string
    const image = formData.get('image') as File

    // Verify team code
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('unique_team_code', teamCode)
      .single()

    if (teamError || !team) {
      return NextResponse.json(
        { error: 'Invalid team code' },
        { status: 400 }
      )
    }

    // Upload image to Supabase Storage
    let imageUrl = ''
    if (image) {
      const fileExt = image.name.split('.').pop()
      const fileName = `${team.id}-${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(fileName, image)

      if (uploadError) {
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 400 }
        )
      }

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(fileName)

      imageUrl = publicUrl
    }

    // Create project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        title,
        description,
        category,
        image_url: imageUrl,
        team_id: team.id,
        team_name: team.team_name,
        tags,
        github_url: githubUrl || null,
        demo_url: demoUrl || null,
      })
      .select()
      .single()

    if (projectError) {
      return NextResponse.json(
        { error: projectError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Project upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const supabase = await createClient()

    let query = supabase
      .from('projects')
      .select('*')
      .order('likes_count', { ascending: false })

    if (category && category !== 'All') {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data: projects, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(projects || [])
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
