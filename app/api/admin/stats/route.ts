import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limiter'
import { getCached, setCache } from '@/lib/cache'

export async function GET(request: Request) {
  try {
    const clientIp = request.headers.get('x-forwarded-for') || 'anonymous'
    
    // Rate limiting: 20 requests per minute for admin
    if (!rateLimit(`admin:stats:${clientIp}`, { interval: 60000, maxRequests: 20 })) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Check cache (2 minute TTL for stats)
    const cacheKey = 'admin:stats'
    const cached = getCached<any>(cacheKey)
    if (cached) {
      return NextResponse.json({ stats: cached })
    }

    const supabase = await createClient()

    // Parallel queries for better performance
    const [teamsCount, projectsCount, usersCount, likesCount, projectsData] = await Promise.all([
      supabase.from('teams').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('likes').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('category')
    ])

    const categoryStats = projectsData.data?.reduce((acc: any, project: any) => {
      acc[project.category] = (acc[project.category] || 0) + 1
      return acc
    }, {})

    const stats = {
      totalTeams: teamsCount.count || 0,
      totalProjects: projectsCount.count || 0,
      totalUsers: usersCount.count || 0,
      totalLikes: likesCount.count || 0,
      projectsByCategory: categoryStats || {}
    }

    // Cache for 2 minutes
    setCache(cacheKey, stats, 120000)

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
