'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Shield, Users, FolderOpen, BarChart3, Edit, Trash2, X, Heart, Plus, Minus, RotateCcw } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  
  const [stats, setStats] = useState<any>(null)
  const [teams, setTeams] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'stats' | 'teams' | 'projects'>('stats')

  const [editingTeam, setEditingTeam] = useState<any>(null)
  const [editingProject, setEditingProject] = useState<any>(null)

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
    if (credentials.email === 'admin@bennett.edu.in') {
      localStorage.setItem('adminAuth', 'true')
      setIsAuthenticated(true)
      fetchData()
    } else {
      alert('Invalid credentials')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    setIsAuthenticated(false)
    router.push('/')
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

  const deleteTeam = async (teamId: string) => {
    if (!confirm('Are you sure? This will delete the team and all its projects!')) return
    
    try {
      const res = await fetch(`/api/admin/teams/${teamId}`, { method: 'DELETE' })
      if (res.ok) {
        alert('Team deleted successfully')
        fetchData()
      } else {
        const error = await res.json()
        alert(`Failed to delete team: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting team:', error)
      alert('Error deleting team')
    }
  }

  const updateTeam = async (teamId: string, updates: any) => {
    try {
      const res = await fetch(`/api/admin/teams/${teamId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (res.ok) {
        alert('Team updated successfully')
        setEditingTeam(null)
        fetchData()
      } else {
        const error = await res.json()
        alert(`Failed to update team: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating team:', error)
      alert('Error updating team')
    }
  }

  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    
    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, { method: 'DELETE' })
      if (res.ok) {
        alert('Project deleted successfully')
        fetchData()
      } else {
        const error = await res.json()
        alert(`Failed to delete project: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Error deleting project')
    }
  }

  const updateProject = async (projectId: string, updates: any) => {
    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (res.ok) {
        alert('Project updated successfully')
        setEditingProject(null)
        fetchData()
      } else {
        const error = await res.json()
        alert(`Failed to update project: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error updating project:', error)
      alert('Error updating project')
    }
  }

  const manipulateLikes = async (projectId: string, action: 'increase' | 'decrease' | 'reset') => {
    // Show confirmation for reset action
    if (action === 'reset' && !confirm('Are you sure you want to reset likes to the original count?')) {
      return
    }

    try {
      const res = await fetch(`/api/admin/projects/${projectId}/likes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      
      if (res.ok) {
        const data = await res.json()
        alert(`Likes ${action}d successfully! New count: ${data.likes_count}`)
        fetchData()
      } else {
        const error = await res.json()
        alert(`Failed to ${action} likes: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error(`Error ${action}ing likes:`, error)
      alert(`Error ${action}ing likes`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fef6e4] flex items-center justify-center">
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xl font-black">LOADING...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fef6e4] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white border-4 border-black p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-center mb-6">
              <Shield size={64} className="text-black" strokeWidth={3} />
            </div>
            <h1 className="text-3xl font-black mb-6 text-center uppercase">Admin Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="admin@bennett.edu.in"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
              />
              <Button type="submit" className="w-full" size="lg">
                LOGIN
              </Button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fef6e4]">
      <Navbar />
      <main className="container mx-auto px-4 py-10 max-w-7xl">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#1e1e1e] via-[#000000] to-[#1e1e1e] text-white border-4 border-black p-8 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
          {/* Colorful accents */}
          <div className="absolute top-2 right-20 w-16 h-16 bg-[#ff6b9d] border-3 border-white rotate-12 opacity-80"></div>
          <div className="absolute bottom-2 left-20 w-12 h-12 bg-[#c7f464] border-3 border-white -rotate-12 opacity-80"></div>
          <div className="absolute top-1/2 right-1/3 w-10 h-10 bg-[#3b82f6] border-3 border-white rotate-45 opacity-80"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <Shield size={48} strokeWidth={3} />
              <h1 className="text-5xl font-black uppercase">Admin Dashboard</h1>
            </div>
            <Button onClick={handleLogout} variant="destructive" size="sm">
              LOGOUT
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {(['stats', 'teams', 'projects'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-black border-3 border-black uppercase transition-all ${
                activeTab === tab
                  ? 'bg-[#3b82f6] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]'
                  : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              {tab === 'stats' && <BarChart3 size={18} strokeWidth={3} className="inline mr-2" />}
              {tab === 'teams' && <Users size={18} strokeWidth={3} className="inline mr-2" />}
              {tab === 'projects' && <FolderOpen size={18} strokeWidth={3} className="inline mr-2" />}
              {tab}
            </button>
          ))}
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#ff6b9d] to-[#f50057] border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#ffd93d] border-4 border-black -mr-8 -mt-8 rotate-45"></div>
              <h3 className="text-sm font-black mb-2 uppercase relative z-10">Total Teams</h3>
              <p className="text-5xl font-black relative z-10">{stats.totalTeams}</p>
            </div>
            <div className="relative overflow-hidden bg-gradient-to-br from-[#3b82f6] to-[#1e40af] text-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#c7f464] border-4 border-black -mr-8 -mt-8 rotate-45"></div>
              <h3 className="text-sm font-black mb-2 uppercase relative z-10">Total Projects</h3>
              <p className="text-5xl font-black relative z-10">{stats.totalProjects}</p>
            </div>
            <div className="relative overflow-hidden bg-gradient-to-br from-[#c7f464] to-[#a8d92e] border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#a855f7] border-4 border-black -mr-8 -mt-8 rotate-45"></div>
              <h3 className="text-sm font-black mb-2 uppercase relative z-10">Total Users</h3>
              <p className="text-5xl font-black relative z-10">{stats.totalUsers}</p>
            </div>
            <div className="relative overflow-hidden bg-gradient-to-br from-[#ffd93d] to-[#ffc107] border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#ff6b9d] border-4 border-black -mr-8 -mt-8 rotate-45"></div>
              <h3 className="text-sm font-black mb-2 uppercase relative z-10">Total Likes</h3>
              <p className="text-5xl font-black relative z-10">{stats.totalLikes}</p>
            </div>
          </div>
        )}

        {/* Teams Tab */}
        {activeTab === 'teams' && (
          <div className="space-y-4">
            {teams.map((team: any) => (
              <div key={team.id} className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                {editingTeam?.id === team.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-black mb-2 uppercase">Team Name</label>
                      <Input
                        value={editingTeam.team_name}
                        onChange={(e) => setEditingTeam({ ...editingTeam, team_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-black mb-2 uppercase">Team Leader</label>
                      <Input
                        value={editingTeam.leader_name}
                        onChange={(e) => setEditingTeam({ ...editingTeam, leader_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-black mb-2 uppercase">Members (comma separated)</label>
                      <Input
                        value={editingTeam.members?.join(', ') || ''}
                        onChange={(e) => setEditingTeam({ 
                          ...editingTeam, 
                          members: e.target.value.split(',').map(m => m.trim()).filter(Boolean)
                        })}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={() => updateTeam(team.id, editingTeam)} size="sm">
                        SAVE
                      </Button>
                      <Button onClick={() => setEditingTeam(null)} variant="outline" size="sm">
                        <X size={16} strokeWidth={3} className="mr-1" />
                        CANCEL
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-black uppercase">{team.team_name}</h3>
                        <p className="text-sm font-bold mt-1">Code: {team.unique_team_code}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => setEditingTeam(team)} 
                          variant="outline" 
                          size="sm"
                        >
                          <Edit size={16} strokeWidth={3} className="mr-1" />
                          EDIT
                        </Button>
                        <Button 
                          onClick={() => deleteTeam(team.id)} 
                          variant="destructive" 
                          size="sm"
                        >
                          <Trash2 size={16} strokeWidth={3} className="mr-1" />
                          DELETE
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-black">LEADER: <span className="font-normal">{team.leader_name}</span></p>
                      <p className="text-sm font-black">
                        MEMBERS: <span className="font-normal">{team.members?.length || 0} total</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            {projects.map((project: any) => (
              <div key={project.id} className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                {editingProject?.id === project.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-black mb-2 uppercase">Title</label>
                      <Input
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-black mb-2 uppercase">Description</label>
                      <textarea
                        className="w-full min-h-[100px] px-4 py-3 border-3 border-black focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                        value={editingProject.description}
                        onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-black mb-2 uppercase">Category</label>
                      <select
                        className="w-full px-4 py-3 border-3 border-black focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold"
                        value={editingProject.category}
                        onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                      >
                        <option value="Web Development">Web Development</option>
                        <option value="Mobile App">Mobile App</option>
                        <option value="AI/ML">AI/ML</option>
                        <option value="Game Development">Game Development</option>
                        <option value="IoT">IoT</option>
                        <option value="AR/VR">AR/VR</option>
                        <option value="Cloud Computing">Cloud Computing</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={() => updateProject(project.id, editingProject)} size="sm">
                        SAVE
                      </Button>
                      <Button onClick={() => setEditingProject(null)} variant="outline" size="sm">
                        <X size={16} strokeWidth={3} className="mr-1" />
                        CANCEL
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-black uppercase mb-2">{project.title}</h3>
                        <p className="text-sm font-bold mb-1">Team: {project.team_name}</p>
                        <p className="text-sm mb-3">{project.description}</p>
                        <div className="flex gap-4 text-sm flex-wrap">
                          <span className="bg-[#c7f464] border-2 border-black px-3 py-1 font-black">
                            {project.category}
                          </span>
                          <span className="bg-[#ff6b9d] text-white border-2 border-black px-3 py-1 font-black">
                            ❤️ {project.likes_count}
                          </span>
                          {project.original_likes_count !== null && project.original_likes_count !== undefined && (
                            <span className="bg-[#3b82f6] text-white border-2 border-black px-3 py-1 font-black">
                              ORIGINAL: {project.original_likes_count}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        {/* Like Manipulation Controls */}
                        <div className="bg-[#fef6e4] border-3 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-w-[200px]">
                          <p className="text-xs font-black uppercase mb-3 flex items-center gap-1">
                            <Heart size={14} strokeWidth={3} className="fill-[#ff6b9d]" />
                            Manipulate Likes
                          </p>
                          <div className="flex flex-col gap-2">
                            <Button
                              onClick={() => manipulateLikes(project.id, 'increase')}
                              size="sm"
                              className="bg-[#c7f464] hover:bg-[#a8d92e] text-black border-2 border-black h-8 text-xs font-black justify-start"
                              title="Increase likes by 1"
                            >
                              <Plus size={14} strokeWidth={3} className="mr-2" />
                              INCREASE
                            </Button>
                            <Button
                              onClick={() => manipulateLikes(project.id, 'decrease')}
                              size="sm"
                              className="bg-[#ffd93d] hover:bg-[#ffc107] text-black border-2 border-black h-8 text-xs font-black justify-start"
                              title="Decrease likes by 1"
                            >
                              <Minus size={14} strokeWidth={3} className="mr-2" />
                              DECREASE
                            </Button>
                            <Button
                              onClick={() => manipulateLikes(project.id, 'reset')}
                              size="sm"
                              className="bg-[#ff6b9d] hover:bg-[#f50057] text-white border-2 border-black h-8 text-xs font-black justify-start"
                              title="Reset to original likes"
                            >
                              <RotateCcw size={14} strokeWidth={3} className="mr-2" />
                              RESET
                            </Button>
                          </div>
                        </div>
                        
                        {/* Edit and Delete Controls */}
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => setEditingProject(project)} 
                            variant="outline" 
                            size="sm"
                          >
                            <Edit size={16} strokeWidth={3} className="mr-1" />
                            EDIT
                          </Button>
                          <Button 
                            onClick={() => deleteProject(project.id)} 
                            variant="destructive" 
                            size="sm"
                          >
                            <Trash2 size={16} strokeWidth={3} className="mr-1" />
                            DELETE
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
