'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Shield, Users, FolderOpen, BarChart3, Edit, Trash2, X, Save, UserPlus, Trophy, RotateCcw } from 'lucide-react'

export default function SecretAdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  
  const [stats, setStats] = useState<any>(null)
  const [teams, setTeams] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [scores, setScores] = useState<any[]>([])
  const [winners, setWinners] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'stats' | 'teams' | 'users' | 'projects' | 'likes' | 'results' | 'winners'>('stats')
  const [dataLoading, setDataLoading] = useState(false)
  
  // Results filters
  const [selectedResultCategory, setSelectedResultCategory] = useState('All')
  const [selectedJudge, setSelectedJudge] = useState('All')
  
  // Winner selection
  const [selectedWinners, setSelectedWinners] = useState<{ [category: string]: string }>({})

  const [editingTeam, setEditingTeam] = useState<any>(null)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [editingProject, setEditingProject] = useState<any>(null)
  
  // Likes manipulation
  const [likesManipulation, setLikesManipulation] = useState({ projectId: '', likes: 0 })
  const [secretClicks, setSecretClicks] = useState(0)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const auth = localStorage.getItem('xxxAdminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
      fetchData()
    }
    setLoading(false)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'AdminSecure@2024') {
      localStorage.setItem('xxxAdminAuth', 'true')
      setIsAuthenticated(true)
      fetchData()
    } else {
      alert('Invalid password')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('xxxAdminAuth')
    setIsAuthenticated(false)
    router.push('/')
  }

  const fetchData = async () => {
    setDataLoading(true)
    try {
      const [statsRes, teamsRes, usersRes, projectsRes, scoresRes, winnersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/teams'),
        fetch('/api/admin/users'),
        fetch('/api/admin/projects'),
        fetch('/api/scores'),
        fetch('/api/winners'),
      ])

      const statsData = await statsRes.json()
      const teamsData = await teamsRes.json()
      const usersData = await usersRes.json()
      const projectsData = await projectsRes.json()
      const scoresData = await scoresRes.json()
      const winnersData = await winnersRes.json()

      setStats(statsData.stats)
      setTeams(teamsData.teams || [])
      setUsers(usersData.users || [])
      setProjects(projectsData.projects || [])
      setScores(Array.isArray(scoresData) ? scoresData : [])
      setWinners(winnersData.winners || [])
      
      // Initialize selected winners from existing winners
      const winnerMap: { [category: string]: string } = {}
      winnersData.winners?.forEach((w: any) => {
        winnerMap[w.category] = w.project_id
      })
      setSelectedWinners(winnerMap)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setDataLoading(false)
    }
  }

  // Team operations
  const deleteTeam = async (teamId: string) => {
    if (!confirm('Delete this team and ALL its projects?')) return
    
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

  // User operations
  const deleteUser = async (userId: string) => {
    if (!confirm('Delete this user? This cannot be undone!')) return
    
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
      if (res.ok) {
        alert('User deleted successfully')
        fetchData()
      } else {
        alert('Failed to delete user')
      }
    } catch (error) {
      alert('Error deleting user')
    }
  }

  const updateUser = async (userId: string, updates: any) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (res.ok) {
        alert('User updated successfully')
        setEditingUser(null)
        fetchData()
      } else {
        alert('Failed to update user')
      }
    } catch (error) {
      alert('Error updating user')
    }
  }

  // Project operations
  const deleteProject = async (projectId: string) => {
    if (!confirm('Delete this project?')) return
    
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
        alert('Failed to update project')
      }
    } catch (error) {
      alert('Error updating project')
    }
  }

  // Likes manipulation
  const manipulateLikes = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@bennett.edu.in',
          password: 'AdminSecure@2024',
          project_id: likesManipulation.projectId,
          new_likes_count: likesManipulation.likes,
        }),
      })

      if (response.ok) {
        alert('✅ Likes manipulated successfully!')
        setLikesManipulation({ projectId: '', likes: 0 })
        fetchData()
      } else {
        alert('❌ Failed to manipulate likes')
      }
    } catch (error) {
      alert('Error manipulating likes')
    }
  }

  // Announce winner
  const announceWinner = async (category: string) => {
    const projectId = selectedWinners[category]
    if (!projectId) {
      alert('Please select a team first')
      return
    }

    try {
      const response = await fetch('/api/winners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          project_id: projectId,
        }),
      })

      if (response.ok) {
        alert(`✅ Winner announced for ${category}!`)
        fetchData()
      } else {
        const error = await response.json()
        alert(`❌ Failed: ${error.error}`)
      }
    } catch (error) {
      alert('Error announcing winner')
    }
  }

  const handleSecretClick = () => {
    setSecretClicks(prev => prev + 1)
    if (secretClicks + 1 >= 3) {
      setActiveTab('likes')
      setSecretClicks(0)
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
      <div className="min-h-screen bg-gradient-to-br from-[#1e1e1e] via-[#000000] to-[#1e1e1e] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-gradient-to-br from-[#ff6b9d] to-[#f50057] border-4 border-black p-10 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-center mb-6">
              <Shield size={80} className="text-white drop-shadow-lg" strokeWidth={3} />
            </div>
            <h1 className="text-4xl font-black mb-6 text-center uppercase text-white drop-shadow-lg">Secret Admin</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter secret password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-center"
              />
              <Button type="submit" className="w-full" size="lg">
                UNLOCK
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
              <Shield size={48} strokeWidth={3} className="animate-pulse" />
              <div>
                <h1 className="text-5xl font-black uppercase">Secret Admin Panel</h1>
                <p className="text-sm font-bold text-white/80 mt-1">Full Access Control - /xxx</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="destructive" size="sm">
              LOGOUT
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap items-center">
          {(['stats', 'teams', 'users', 'projects', 'results', 'winners'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-black border-3 border-black uppercase transition-all ${
                activeTab === tab
                  ? 'bg-[#ff6b9d] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]'
                  : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              {tab === 'stats' && <BarChart3 size={18} strokeWidth={3} className="inline mr-2" />}
              {tab === 'teams' && <Users size={18} strokeWidth={3} className="inline mr-2" />}
              {tab === 'users' && <UserPlus size={18} strokeWidth={3} className="inline mr-2" />}
              {tab === 'projects' && <FolderOpen size={18} strokeWidth={3} className="inline mr-2" />}
              {tab === 'results' && <Trophy size={18} strokeWidth={3} className="inline mr-2" />}
              {tab === 'winners' && <Trophy size={18} strokeWidth={3} className="inline mr-2" />}
              {tab}
            </button>
          ))}
          
          {/* Secret Invisible Button - Triple click to reveal Likes tab */}
          <button
            onClick={handleSecretClick}
            className="w-8 h-8 opacity-0 hover:opacity-5 transition-opacity cursor-default"
            title="Secret"
          >
            🎯
          </button>
          
          {/* Likes Tab - Only visible after activation */}
          {(activeTab === 'likes' || secretClicks > 0) && (
            <button
              onClick={() => setActiveTab('likes')}
              className={`px-6 py-3 font-black border-3 border-black uppercase transition-all ${
                activeTab === 'likes'
                  ? 'bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px] animate-pulse'
                  : 'bg-gradient-to-r from-[#ffd93d] to-[#ff6b9d] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              <span className="inline mr-2">🎯</span>
              LIKES CONTROL
            </button>
          )}
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
                      <label className="block text-sm font-black mb-2 uppercase">Team Code</label>
                      <Input
                        value={editingTeam.unique_team_code}
                        onChange={(e) => setEditingTeam({ ...editingTeam, unique_team_code: e.target.value })}
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
                        <Save size={16} strokeWidth={3} className="mr-1" />
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
                        <p className="text-xs text-gray-600 mt-1">ID: {team.id}</p>
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

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {users.map((user: any) => (
              <div key={user.id} className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                {editingUser?.id === user.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-black mb-2 uppercase">Name</label>
                      <Input
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-black mb-2 uppercase">Email</label>
                      <Input
                        type="email"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-black mb-2 uppercase">Enrollment Number</label>
                      <Input
                        value={editingUser.enrollment_number || ''}
                        onChange={(e) => setEditingUser({ ...editingUser, enrollment_number: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`team-leader-${user.id}`}
                        checked={editingUser.is_team_leader || false}
                        onChange={(e) => setEditingUser({ ...editingUser, is_team_leader: e.target.checked })}
                        className="w-5 h-5 border-3 border-black"
                      />
                      <label htmlFor={`team-leader-${user.id}`} className="text-sm font-black uppercase">
                        Team Leader
                      </label>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={() => updateUser(user.id, editingUser)} size="sm">
                        <Save size={16} strokeWidth={3} className="mr-1" />
                        SAVE
                      </Button>
                      <Button onClick={() => setEditingUser(null)} variant="outline" size="sm">
                        <X size={16} strokeWidth={3} className="mr-1" />
                        CANCEL
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-black uppercase">{user.name}</h3>
                        <p className="text-sm font-bold mt-1">{user.email}</p>
                        <p className="text-xs text-gray-600 mt-1">ID: {user.id}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => setEditingUser(user)} 
                          variant="outline" 
                          size="sm"
                        >
                          <Edit size={16} strokeWidth={3} className="mr-1" />
                          EDIT
                        </Button>
                        <Button 
                          onClick={() => deleteUser(user.id)} 
                          variant="destructive" 
                          size="sm"
                        >
                          <Trash2 size={16} strokeWidth={3} className="mr-1" />
                          DELETE
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-black">ENROLLMENT: <span className="font-normal">{user.enrollment_number || 'N/A'}</span></p>
                      <p className="text-sm font-black">TEAM LEADER: <span className="font-normal">{user.is_team_leader ? 'Yes' : 'No'}</span></p>
                      {user.team_id && (
                        <p className="text-sm font-black">TEAM ID: <span className="font-normal">{user.team_id}</span></p>
                      )}
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
                      <label className="block text-sm font-black mb-2 uppercase">Project Title</label>
                      <Input
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-black mb-2 uppercase">Description</label>
                      <Input
                        value={editingProject.description}
                        onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-black mb-2 uppercase">Category</label>
                      <Input
                        value={editingProject.category}
                        onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-black mb-2 uppercase">GitHub URL</label>
                        <Input
                          value={editingProject.github_url || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, github_url: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-black mb-2 uppercase">Demo URL</label>
                        <Input
                          value={editingProject.demo_url || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, demo_url: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={() => updateProject(project.id, editingProject)} size="sm">
                        <Save size={16} strokeWidth={3} className="mr-1" />
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
                          {project.github_url && (
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="bg-black text-white border-2 border-black px-3 py-1 font-black hover:bg-gray-800">
                              GITHUB
                            </a>
                          )}
                          {project.demo_url && (
                            <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="bg-[#3b82f6] text-white border-2 border-black px-3 py-1 font-black hover:bg-blue-600">
                              DEMO
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-2">ID: {project.id}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
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
                )}
              </div>
            ))}
          </div>
        )}

        {/* Likes Manipulation Tab */}
        {activeTab === 'likes' && (
          <div className="space-y-6">
            {/* Warning Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#ff6b9d] to-[#f50057] border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#ffd93d] border-4 border-black -mr-12 -mt-12 rotate-45"></div>
              <h2 className="text-3xl font-black mb-2 uppercase text-white relative z-10 drop-shadow-lg">⚠️ Likes Manipulation</h2>
              <p className="font-bold text-white/95 relative z-10">
                Directly control project vote counts and leaderboard rankings. Use with extreme caution!
              </p>
            </div>

            {/* Manipulation Form */}
            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-2xl font-black mb-6 uppercase">Manual Likes Control</h3>
              <form onSubmit={manipulateLikes} className="space-y-6">
                <div>
                  <label className="block text-sm font-black mb-2 uppercase">Project ID</label>
                  <Input
                    type="text"
                    placeholder="Enter project ID from Projects tab..."
                    value={likesManipulation.projectId}
                    onChange={(e) => setLikesManipulation({ ...likesManipulation, projectId: e.target.value })}
                    required
                  />
                  <p className="text-xs text-gray-600 mt-1">Find the project ID in the Projects tab below each project</p>
                </div>
                
                <div>
                  <label className="block text-sm font-black mb-2 uppercase">New Likes Count</label>
                  <Input
                    type="number"
                    placeholder="Enter exact number of likes..."
                    value={likesManipulation.likes || ''}
                    onChange={(e) => setLikesManipulation({ ...likesManipulation, likes: parseInt(e.target.value) || 0 })}
                    required
                    min="0"
                  />
                  <p className="text-xs text-gray-600 mt-1">This will override the current likes count</p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] hover:from-[#9333ea] hover:to-[#db2777]"
                  size="lg"
                >
                  🎯 MANIPULATE LIKES COUNT
                </Button>
              </form>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-[#ffd93d] to-[#ffc107] border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black mb-4 uppercase">💡 Quick Actions</h3>
              <div className="space-y-2 text-sm font-bold">
                <p>• Set likes to <span className="bg-black text-white px-2 py-1">0</span> to reset a project</p>
                <p>• Set likes to <span className="bg-black text-white px-2 py-1">1000+</span> to boost to top of leaderboard</p>
                <p>• Changes are instant and affect the live leaderboard</p>
                <p>• Use Projects tab below to find project IDs</p>
              </div>
            </div>

            {/* Projects Reference */}
            <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black mb-4 uppercase">📋 Projects Reference</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {projects.map((project: any) => (
                  <div 
                    key={project.id} 
                    className="flex items-center justify-between p-3 border-2 border-black bg-[#fef6e4] hover:bg-[#fff9e5] transition-colors cursor-pointer"
                    onClick={() => setLikesManipulation({ ...likesManipulation, projectId: project.id })}
                  >
                    <div className="flex-1">
                      <p className="font-black text-sm">{project.title}</p>
                      <p className="text-xs text-gray-600 font-mono">{project.id}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="bg-[#ff6b9d] text-white px-3 py-1 font-black text-sm border-2 border-black">
                        ❤️ {project.likes_count}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setLikesManipulation({ projectId: project.id, likes: project.likes_count })
                        }}
                        className="bg-[#3b82f6] text-white px-3 py-1 font-black text-xs border-2 border-black hover:bg-blue-600"
                      >
                        SELECT
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            {/* Header with Refresh */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-[#a855f7] to-[#7c3aed] text-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div>
                <h2 className="text-3xl font-black uppercase flex items-center gap-3">
                  <Trophy size={32} strokeWidth={3} />
                  Judging Results & Rankings
                </h2>
                <p className="font-bold mt-1">Cumulative scores and category-based rankings</p>
              </div>
              <Button 
                onClick={fetchData} 
                disabled={dataLoading}
                className="bg-white text-black hover:bg-gray-100 border-3 border-black"
              >
                <RotateCcw size={18} strokeWidth={3} className="mr-2" />
                REFRESH
              </Button>
            </div>

            {dataLoading ? (
              <div className="text-center py-20">
                <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block">
                  <p className="text-xl font-black animate-pulse">LOADING RESULTS...</p>
                </div>
              </div>
            ) : scores.length === 0 ? (
              <div className="text-center py-20">
                <Trophy size={64} strokeWidth={3} className="mx-auto mb-4 text-gray-400" />
                <p className="text-2xl font-black text-gray-400 uppercase mb-2">No scores submitted yet</p>
                <p className="text-sm font-bold text-gray-500">Judges haven't started scoring projects</p>
              </div>
            ) : (
              <>
                {/* Filters Section */}
                <div className="bg-white border-4 border-black p-4 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-xl font-black uppercase mb-4">Filter Results</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category Filter */}
                    <div>
                      <label className="block text-sm font-black uppercase mb-3">Select Category</label>
                      <div className="flex flex-wrap gap-2">
                        {['All', ...Array.from(new Set(projects.map((p: any) => p.category)))].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setSelectedResultCategory(cat)}
                            className={`px-4 py-2 font-black border-3 border-black uppercase text-sm transition-all ${
                              selectedResultCategory === cat
                                ? 'bg-[#c7f464] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]'
                                : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Judge Filter */}
                    <div>
                      <label className="block text-sm font-black uppercase mb-3">Select Judge</label>
                      <div className="flex flex-wrap gap-2">
                        {['All', ...Array.from(new Set(scores.map((s: any) => s.judge_name)))].map((judge) => (
                          <button
                            key={judge}
                            onClick={() => setSelectedJudge(judge)}
                            className={`px-4 py-2 font-black border-3 border-black uppercase text-sm transition-all ${
                              selectedJudge === judge
                                ? 'bg-[#3b82f6] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]'
                                : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                            }`}
                          >
                            {judge}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rankings Section */}
                {(() => {
                  // Calculate cumulative scores for all projects
                  const projectScores = new Map()
                  
                  scores.forEach((score: any) => {
                    // Apply judge filter
                    if (selectedJudge !== 'All' && score.judge_name !== selectedJudge) return
                    
                    if (!projectScores.has(score.project_id)) {
                      projectScores.set(score.project_id, {
                        projectId: score.project_id,
                        totalScore: 0,
                        judgeCount: 0,
                        scores: []
                      })
                    }
                    
                    const ps = projectScores.get(score.project_id)
                    ps.scores.push(score)
                    ps.totalScore += score.total_score
                    ps.judgeCount += 1
                  })
                  
                  // Get filtered projects with scores
                  let filteredProjectsWithScores = Array.from(projectScores.entries())
                    .map(([projectId, data]: [string, any]) => {
                      const project = projects.find((p: any) => p.id === projectId)
                      if (!project) return null
                      
                      // Apply category filter
                      if (selectedResultCategory !== 'All' && project.category !== selectedResultCategory) return null
                      
                      return {
                        project,
                        ...data,
                        cumulativeScore: data.totalScore
                      }
                    })
                    .filter(Boolean)
                    .sort((a: any, b: any) => b.cumulativeScore - a.cumulativeScore)
                  
                  return (
                    <div className="bg-gradient-to-br from-[#fef6e4] to-[#fff9e5] border-4 border-black p-4 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl md:text-3xl font-black uppercase">
                          🏆 Rankings
                          {selectedResultCategory !== 'All' && (
                            <span className="ml-3 text-lg bg-[#c7f464] border-3 border-black px-3 py-1">
                              {selectedResultCategory}
                            </span>
                          )}
                          {selectedJudge !== 'All' && (
                            <span className="ml-3 text-lg bg-[#3b82f6] text-white border-3 border-black px-3 py-1">
                              {selectedJudge}
                            </span>
                          )}
                        </h2>
                        <div className="bg-white border-3 border-black px-4 py-2">
                          <p className="text-xs font-black uppercase">Total Projects</p>
                          <p className="text-2xl font-black text-center">{filteredProjectsWithScores.length}</p>
                        </div>
                      </div>

                      {filteredProjectsWithScores.length === 0 ? (
                        <div className="text-center py-10">
                          <p className="text-xl font-black text-gray-400 uppercase">No projects found with selected filters</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {filteredProjectsWithScores.map((item: any, index: number) => (
                            <div 
                              key={item.project.id}
                              className="bg-white border-4 border-black p-4 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all"
                            >
                              <div className="flex flex-col lg:flex-row items-start gap-4">
                                {/* Rank Badge */}
                                <div className={`${
                                  index === 0 ? 'bg-[#ffd93d]' :
                                  index === 1 ? 'bg-[#c0c0c0]' :
                                  index === 2 ? 'bg-[#cd7f32]' :
                                  'bg-[#3b82f6]'
                                } border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-w-[80px] text-center flex-shrink-0`}>
                                  {index < 3 && <p className="text-2xl mb-1">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</p>}
                                  <p className="text-xs font-black uppercase">Rank</p>
                                  <p className="text-4xl font-black">#{index + 1}</p>
                                </div>

                                {/* Project Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                                    <div className="flex-1 min-w-0">
                                      <h3 className="text-xl md:text-2xl font-black uppercase mb-2 break-words">{item.project.title}</h3>
                                      <p className="text-sm font-bold mb-1">Team: {item.project.team_name}</p>
                                      <span className="bg-[#c7f464] border-2 border-black px-3 py-1 text-xs font-black inline-block">
                                        {item.project.category}
                                      </span>
                                    </div>

                                    {/* Cumulative Score */}
                                    <div className="bg-gradient-to-br from-[#a855f7] to-[#7c3aed] text-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-w-[140px] text-center flex-shrink-0">
                                      <p className="text-xs font-black uppercase mb-1">Cumulative Score</p>
                                      <p className="text-5xl font-black">{item.cumulativeScore}</p>
                                      <p className="text-xs font-bold mt-1">from {item.judgeCount} judge{item.judgeCount !== 1 ? 's' : ''}</p>
                                      <div className="mt-2 pt-2 border-t-2 border-white/30">
                                        <p className="text-xs font-bold">Avg: {(item.cumulativeScore / item.judgeCount).toFixed(1)}/60</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Judge Breakdown */}
                                  <div className="border-t-3 border-black pt-4">
                                    <p className="text-sm font-black uppercase mb-3">Judge Scores</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                      {item.scores.map((score: any) => (
                                        <div key={score.id} className="bg-[#fef6e4] border-2 border-black p-3">
                                          <div className="flex items-center justify-between mb-2">
                                            <p className="font-black text-sm truncate flex-1" title={score.judge_name}>{score.judge_name}</p>
                                            <span className="bg-black text-white border border-black px-2 py-1 font-black text-xs ml-2">
                                              {score.total_score}/60
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-3 gap-1 text-xs">
                                            <div className="text-center">
                                              <p className="bg-[#ff6b9d] border border-black px-1 py-1 font-black">{score.innovation}</p>
                                            </div>
                                            <div className="text-center">
                                              <p className="bg-[#3b82f6] text-white border border-black px-1 py-1 font-black">{score.pitching}</p>
                                            </div>
                                            <div className="text-center">
                                              <p className="bg-[#ffd93d] border border-black px-1 py-1 font-black">{score.presentation}</p>
                                            </div>
                                            <div className="text-center">
                                              <p className="bg-[#c7f464] border border-black px-1 py-1 font-black">{score.creativity}</p>
                                            </div>
                                            <div className="text-center">
                                              <p className="bg-[#a855f7] text-white border border-black px-1 py-1 font-black">{score.functionality}</p>
                                            </div>
                                            <div className="text-center">
                                              <p className="bg-[#06b6d4] text-white border border-black px-1 py-1 font-black">{score.scalability}</p>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })()}
              </>
            )}
          </div>
        )}

        {/* Winners Tab */}
        {activeTab === 'winners' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#ffd93d] to-[#ffc107] border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-3 mb-2">
                <Trophy size={32} strokeWidth={3} />
                <h2 className="text-3xl font-black uppercase">Announce Winners</h2>
              </div>
              <p className="font-bold">Select and announce the winning team for each category</p>
            </div>

            {dataLoading ? (
              <div className="text-center py-20">
                <p className="text-xl font-black animate-pulse">LOADING...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {['AI/ML', 'Cybersecurity and Blockchain', 'Open Innovation', 'Software and Automation', 'Clubs and Chapter'].map((category) => {
                  const categoryProjects = projects.filter(p => p.category === category)
                  const currentWinner = winners.find(w => w.category === category)
                  
                  return (
                    <div key={category} className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-black uppercase">{category}</h3>
                        <span className="bg-[#c7f464] border-2 border-black px-4 py-2 text-sm font-black">
                          {categoryProjects.length} Teams
                        </span>
                      </div>

                      {/* Current Winner Display */}
                      {currentWinner && (
                        <div className="bg-[#ffd93d] border-3 border-black p-4 mb-4 flex items-center gap-4">
                          <Trophy size={32} strokeWidth={3} />
                          <div>
                            <p className="text-xs font-black uppercase mb-1">Current Winner</p>
                            <p className="text-xl font-black">{currentWinner.team_name}</p>
                          </div>
                        </div>
                      )}

                      {/* Team Selection */}
                      <div className="space-y-3">
                        <label className="text-sm font-black uppercase">Select Winning Team:</label>
                        <select
                          value={selectedWinners[category] || ''}
                          onChange={(e) => setSelectedWinners({ ...selectedWinners, [category]: e.target.value })}
                          className="w-full px-4 py-3 border-3 border-black font-bold text-base"
                        >
                          <option value="">-- Choose a team --</option>
                          {categoryProjects
                            .sort((a, b) => a.team_name.localeCompare(b.team_name))
                            .map((project) => (
                              <option key={project.id} value={project.id}>
                                {project.team_name}
                              </option>
                            ))}
                        </select>

                        <Button
                          onClick={() => announceWinner(category)}
                          disabled={!selectedWinners[category]}
                          className="w-full bg-[#ff6b9d] hover:bg-[#ff4081] border-3 border-black font-black uppercase text-lg h-14 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                        >
                          <Trophy size={20} strokeWidth={3} className="mr-2" />
                          {currentWinner ? 'Update Winner' : 'Announce Winner'}
                        </Button>
                      </div>

                      {/* Top 3 Teams by Score */}
                      {scores.length > 0 && (
                        <div className="mt-6 pt-6 border-t-3 border-black">
                          <p className="text-sm font-black uppercase mb-3">Top 3 Teams by Score:</p>
                          <div className="space-y-2">
                            {categoryProjects
                              .map(project => {
                                const projectScores = scores.filter(s => s.project_id === project.id)
                                const avgScore = projectScores.length > 0
                                  ? projectScores.reduce((sum, s) => sum + s.total_score, 0) / projectScores.length
                                  : 0
                                return { ...project, avgScore, judgeCount: projectScores.length }
                              })
                              .filter(p => p.judgeCount > 0)
                              .sort((a, b) => b.avgScore - a.avgScore)
                              .slice(0, 3)
                              .map((project, index) => (
                                <div key={project.id} className="bg-[#fef6e4] border-2 border-black p-3 flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <span className="text-2xl font-black">#{index + 1}</span>
                                    <div>
                                      <p className="font-black">{project.team_name}</p>
                                      <p className="text-xs font-bold text-gray-600">{project.judgeCount} judge{project.judgeCount !== 1 ? 's' : ''}</p>
                                    </div>
                                  </div>
                                  <span className="bg-[#3b82f6] text-white border-2 border-black px-3 py-1 font-black text-lg">
                                    {project.avgScore.toFixed(1)}/60
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
