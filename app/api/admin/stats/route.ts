import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get total counts
    const { count: totalTeams } = await supabase
      .from('teams')
      .select('*', { count: 'exact', head: true })

    const { count: totalProjects } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })

    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    const { count: totalLikes } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })

    // Get projects by category
    const { data: projectsByCategory } = await supabase
      .from('projects')
      .select('category')

    const categoryStats = projectsByCategory?.reduce((acc: any, project: any) => {
      acc[project.category] = (acc[project.category] || 0) + 1
      return acc
    }, {})

    return NextResponse.json({
      stats: {
        totalTeams: totalTeams || 0,
        totalProjects: totalProjects || 0,
        totalUsers: totalUsers || 0,
        totalLikes: totalLikes || 0,
        categoryStats: categoryStats || {},
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
