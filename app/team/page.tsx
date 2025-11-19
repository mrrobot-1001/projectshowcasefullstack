'use client'

import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, Code2, Settings, Edit, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TeamPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('view')
  const [teamData, setTeamData] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [editProject, setEditProject] = useState<any>(null)

  useEffect(() => {
    fetchTeamData()
  }, [])

  const fetchTeamData = async () => {
    try {
      const userRes = await fetch('/api/auth/user')
      if (!userRes.ok) {
        router.push('/login')
        return
      }
      
      const user = await userRes.json()
      
      // Get team information if user is a team leader
      if (user.is_team_leader) {
        // Fetch team details and projects
        const teamRes = await fetch(`/api/teams/my-team`)
        if (teamRes.ok) {
          const team = await teamRes.json()
          setTeamData(team)
          setProjects(team.projects || [])
        }
      }
    } catch (error) {
      console.error('Error fetching team data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProject = async (projectId: string, updates: any) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (res.ok) {
        fetchTeamData()
        setEditMode(false)
        setEditProject(null)
      }
    } catch (error) {
      console.error('Error updating project:', error)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        fetchTeamData()
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  return (
    <div className="min-h-screen bg-[#fef6e4]">
      <Navbar />

      <main className="container mx-auto px-4 py-10 max-w-6xl">
        {/* Header with Gradients */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#ff6b9d] via-[#ff4081] to-[#f50057] border-4 border-black p-8 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
          {/* Decorative Elements */}
          <div className="absolute top-2 right-12 w-20 h-20 bg-[#c7f464] border-4 border-black rotate-45"></div>
          <div className="absolute bottom-2 left-16 w-14 h-14 bg-[#3b82f6] border-4 border-black -rotate-12"></div>
          <div className="absolute top-1/2 right-1/3 w-12 h-12 bg-[#ffd93d] border-4 border-black rotate-12"></div>
          
          <div className="flex items-center gap-4 mb-3 relative z-10">
            <Users className="w-12 h-12 text-white drop-shadow-lg" strokeWidth={3} />
            <h1 className="text-5xl font-black text-white uppercase drop-shadow-lg">Team Management</h1>
          </div>
          <p className="text-lg font-bold text-white/95 relative z-10 drop-shadow">
            ⚙️ Manage your team and projects
          </p>
        </div>

        {loading ? (
          <div className="bg-white border-4 border-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xl font-black">LOADING...</p>
          </div>
        ) : !teamData ? (
          <div className="bg-white border-4 border-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <Users size={64} className="mx-auto mb-4 text-black" strokeWidth={3} />
            <h2 className="text-2xl font-black mb-3 uppercase">No Team Found</h2>
            <p className="font-bold text-gray-700 mb-6">
              You need to create a team during signup or join an existing team.
            </p>
            <Button onClick={() => router.push('/signup')} size="lg">
              GO TO SIGNUP
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Team Info Card */}
            <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-black uppercase mb-2">{teamData.name}</h2>
                  <div className="flex items-center gap-3 p-3 bg-[#c7f464] border-3 border-black inline-block">
                    <Code2 size={20} strokeWidth={3} />
                    <span className="font-black">CODE: {teamData.code}</span>
                  </div>
                </div>
              </div>
              
              {/* Team Members */}
              <div className="mt-6">
                <h3 className="text-xl font-black mb-3 uppercase border-b-3 border-black pb-2">
                  Team Members ({teamData.members?.length || 0})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {teamData.members?.map((member: any, index: number) => (
                    <div key={index} className="p-3 bg-[#fef6e4] border-2 border-black font-bold">
                      👤 {member.name} ({member.email})
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Projects Section */}
            <div className="bg-[#3b82f6] border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-3xl font-black text-white uppercase mb-2">Team Projects</h2>
              <p className="font-bold text-white">Manage and edit your project submissions</p>
            </div>

            {projects.length === 0 ? (
              <div className="bg-white border-4 border-black p-10 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-xl font-black mb-2">NO PROJECTS YET!</p>
                <p className="font-bold text-gray-700 mb-4">Upload your first project to get started.</p>
                <Button onClick={() => router.push('/upload')} size="lg">
                  UPLOAD PROJECT
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    {editMode && editProject?.id === project.id ? (
                      <div className="space-y-4">
                        <Input
                          value={editProject.title}
                          onChange={(e) => setEditProject({...editProject, title: e.target.value})}
                          placeholder="Project Title"
                          className="text-xl font-bold"
                        />
                        <textarea
                          value={editProject.description}
                          onChange={(e) => setEditProject({...editProject, description: e.target.value})}
                          className="w-full px-4 py-3 border-3 border-black font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none"
                          rows={4}
                        />
                        <div className="flex gap-2">
                          <Button onClick={() => handleUpdateProject(project.id, editProject)} size="sm">
                            SAVE
                          </Button>
                          <Button onClick={() => { setEditMode(false); setEditProject(null) }} variant="outline" size="sm">
                            CANCEL
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-black uppercase mb-2">{project.title}</h3>
                            <span className="inline-block px-3 py-1 bg-[#c7f464] border-2 border-black text-xs font-black uppercase">
                              {project.category}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => { setEditMode(true); setEditProject(project) }}
                              className="p-2 border-3 border-black bg-white hover:bg-[#fef6e4] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                            >
                              <Edit size={18} strokeWidth={3} />
                            </button>
                            <button 
                              onClick={() => handleDeleteProject(project.id)}
                              className="p-2 border-3 border-black bg-[#ff6b9d] hover:bg-red-500 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                            >
                              <Trash2 size={18} strokeWidth={3} />
                            </button>
                          </div>
                        </div>
                        <p className="font-bold text-gray-700 mb-4">{project.description}</p>
                        <div className="flex items-center gap-4 text-sm font-bold">
                          <span className="px-3 py-1 bg-[#ff6b9d] border-2 border-black">
                            ❤️ {project.likes_count || 0} VOTES
                          </span>
                          {project.github_url && (
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-black text-white border-2 border-black hover:bg-gray-800 transition-colors">
                              🔗 GITHUB
                            </a>
                          )}
                          {project.demo_url && (
                            <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-[#3b82f6] text-white border-2 border-black hover:bg-blue-600 transition-colors">
                              🚀 DEMO
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
