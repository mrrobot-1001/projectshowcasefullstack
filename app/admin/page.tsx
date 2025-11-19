'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  
  const [stats, setStats] = useState<any>(null)
  const [teams, setTeams] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'stats' | 'teams' | 'projects' | 'leaderboard'>('stats')

  const [leaderboardEdit, setLeaderboardEdit] = useState({ projectId: '', likes: 0 })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const adminAuth = localStorage.getItem('adminAuth')
    if (adminAuth === 'true') {
      setIsAuthenticated(true)
      fetchData()
    }
    setLoading(false)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      credentials.email === 'admin@bennett.edu.in'
    ) {
      localStorage.setItem('adminAuth', 'true')
      setIsAuthenticated(true)
      fetchData()
    } else {
      alert('Invalid credentials')
    }
  }

  const fetchData = async () => {
    try {
      const [statsRes, teamsRes, projectsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/teams'),
        fetch('/api/admin/projects'),
      ])

      const statsData = await statsRes.json()
      const teamsData = await teamsRes.json()
      const projectsData = await projectsRes.json()

      setStats(statsData.stats)
      setTeams(teamsData.teams || [])
      setProjects(projectsData.projects || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  const updateLeaderboard = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          project_id: leaderboardEdit.projectId,
          new_likes_count: leaderboardEdit.likes,
        }),
      })

      if (response.ok) {
        alert('Leaderboard updated successfully')
        fetchData()
      } else {
        alert('Failed to update leaderboard')
      }
    } catch (error) {
      alert('Error updating leaderboard')
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-3xl p-8 shadow-lg">
            <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="Admin Email"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                required
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        <div className="flex gap-4 mb-8 flex-wrap">
          {(['stats', 'teams', 'projects', 'leaderboard'] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>

        {activeTab === 'stats' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-2">Total Teams</h3>
              <p className="text-3xl font-bold">{stats.totalTeams}</p>
            </div>
            <div className="bg-card p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-2">Total Projects</h3>
              <p className="text-3xl font-bold">{stats.totalProjects}</p>
            </div>
            <div className="bg-card p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-2">Total Users</h3>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <div className="bg-card p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-2">Total Likes</h3>
              <p className="text-3xl font-bold">{stats.totalLikes}</p>
            </div>
          </div>
        )}

        {activeTab === 'teams' && (
          <div className="bg-card rounded-xl p-6 shadow">
            <h2 className="text-2xl font-bold mb-4">Teams</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Team Name</th>
                    <th className="text-left p-2">Leader</th>
                    <th className="text-left p-2">Code</th>
                    <th className="text-left p-2">Members</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team) => (
                    <tr key={team.id} className="border-b">
                      <td className="p-2">{team.team_name}</td>
                      <td className="p-2">{team.leader_name}</td>
                      <td className="p-2 font-mono text-sm">{team.unique_team_code}</td>
                      <td className="p-2">{team.members?.length || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="bg-card rounded-xl p-6 shadow">
            <h2 className="text-2xl font-bold mb-4">Projects</h2>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.team_name}</p>
                  <p className="text-sm mt-2 line-clamp-2">{project.description}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span>Category: {project.category}</span>
                    <span>Likes: {project.likes_count}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">ID: {project.id}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="bg-card rounded-xl p-6 shadow">
            <h2 className="text-2xl font-bold mb-4">Manipulate Leaderboard</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Use this to manually adjust project likes count. Get Project ID from Projects tab.
            </p>
            <form onSubmit={updateLeaderboard} className="space-y-4 max-w-md">
              <Input
                type="text"
                placeholder="Project ID (from Projects tab)"
                value={leaderboardEdit.projectId}
                onChange={(e) =>
                  setLeaderboardEdit({ ...leaderboardEdit, projectId: e.target.value })
                }
                required
              />
              <Input
                type="number"
                placeholder="New Likes Count"
                value={leaderboardEdit.likes || ''}
                onChange={(e) =>
                  setLeaderboardEdit({ ...leaderboardEdit, likes: parseInt(e.target.value) || 0 })
                }
                required
                min="0"
              />
              <Button type="submit">Update Likes Count</Button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
