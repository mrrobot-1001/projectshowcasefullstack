'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Heart, Github, ExternalLink, ArrowLeft } from 'lucide-react'
import Image from 'next/image'

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [projectId, setProjectId] = useState('')

  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params
      setProjectId(resolvedParams.id)
    }
    fetchParams()
  }, [params])

  useEffect(() => {
    if (projectId) {
      fetchProject()
      checkAuth()
    }
  }, [projectId])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      const data = await response.json()
      
      if (response.ok) {
        setProject(data.project)
        checkLikeStatus()
      }
    } catch (error) {
      console.error('Failed to fetch project:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/user')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.log('Not authenticated')
    }
  }

  const checkLikeStatus = async () => {
    try {
      const response = await fetch(`/api/likes?project_id=${projectId}`)
      const data = await response.json()
      setLiked(data.liked)
    } catch (error) {
      console.log('Failed to check like status')
    }
  }

  const handleLike = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId }),
      })

      const data = await response.json()

      if (response.ok) {
        setLiked(data.liked)
        fetchProject() // Refresh to get updated likes count
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error('Failed to like project:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Loading...</h2>
            <p className="text-muted-foreground">Fetching project details</p>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
            <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist</p>
            <Button onClick={() => router.push('/projects')}>
              Back to Projects
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="max-w-5xl mx-auto">
          {/* Project Image */}
          {project.image_url && (
            <div className="relative w-full h-[400px] rounded-3xl overflow-hidden mb-8">
              <Image
                src={project.image_url}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Project Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  {project.title}
                </h1>
                <p className="text-xl text-muted-foreground">
                  by {project.team_name}
                </p>
              </div>
              <Button
                size="lg"
                variant={liked ? 'default' : 'outline'}
                onClick={handleLike}
                className="gap-2"
              >
                <Heart
                  className={`w-5 h-5 ${liked ? 'fill-current' : ''}`}
                />
                {project.likes_count}
              </Button>
            </div>

            {/* Category Badge */}
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              {project.category}
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-lg max-w-none mb-8">
            <h2 className="text-2xl font-bold mb-4">About This Project</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {project.description}
            </p>
          </div>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-3">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-muted rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-4 mb-8">
            {project.github_url && (
              <Button
                variant="outline"
                size="lg"
                asChild
              >
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <Github className="w-5 h-5" />
                  View Code
                </a>
              </Button>
            )}
            {project.demo_url && (
              <Button
                size="lg"
                asChild
              >
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  Live Demo
                </a>
              </Button>
            )}
          </div>

          {/* Team Info */}
          {project.teams && (
            <div className="bg-card rounded-3xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Team Information</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Team:</span> {project.teams.team_name}
                </p>
                <p>
                  <span className="font-semibold">Leader:</span> {project.teams.leader_name}
                </p>
                {project.teams.members && project.teams.members.length > 0 && (
                  <div>
                    <span className="font-semibold">Members:</span>
                    <ul className="list-disc list-inside ml-4 mt-2">
                      {project.teams.members.map((member: any, index: number) => (
                        <li key={index}>{member.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
