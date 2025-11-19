'use client'

import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { BarChart3, Users, Heart, Eye, Trash2, Eye as Eye2 } from 'lucide-react'
import { useState } from 'react'

const STATS = [
  {
    label: 'Total Projects',
    value: '2,543',
    icon: BarChart3,
    color: 'text-primary',
  },
  {
    label: 'Total Teams',
    value: '847',
    icon: Users,
    color: 'text-secondary',
  },
  {
    label: 'Total Votes',
    value: '45.2K',
    icon: Heart,
    color: 'text-accent',
  },
  {
    label: 'Active Users',
    value: '3,921',
    icon: Eye,
    color: 'text-primary',
  },
]

const RECENT_PROJECTS = [
  {
    id: 1,
    title: 'AI Chat Assistant',
    team: 'AI Pioneers',
    votes: 445,
    status: 'approved',
  },
  {
    id: 2,
    title: 'Suspicious Project XYZ',
    team: 'Unknown Team',
    votes: 2,
    status: 'pending',
  },
  {
    id: 3,
    title: 'Mobile Fitness App',
    team: 'Mobile Team',
    votes: 156,
    status: 'approved',
  },
  {
    id: 4,
    title: 'Inappropriate Content',
    team: 'Spam Account',
    votes: 0,
    status: 'flagged',
  },
  {
    id: 5,
    title: 'Game Engine Demo',
    team: 'Game Crafters',
    votes: 289,
    status: 'approved',
  },
]

export default function AdminPage() {
  const [projects, setProjects] = useState(RECENT_PROJECTS)
  const [hiddenProjects, setHiddenProjects] = useState<number[]>([])

  const toggleHide = (id: number) => {
    setHiddenProjects((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const deleteProject = (id: number) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 pb-16 md:pb-20">
        {/* Header */}
        <section className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Moderate projects and manage the platform
          </p>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {STATS.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="soft-shadow bg-card rounded-2xl p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Recent Projects */}
        <div className="soft-shadow bg-card rounded-2xl overflow-hidden">
          <div className="px-6 py-6 border-b border-border/20">
            <h2 className="text-2xl font-bold">Recent Projects</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/20 bg-muted/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Project
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Team
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Votes
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className={`border-b border-border/10 hover:bg-muted/30 transition-colors ${
                      hiddenProjects.includes(project.id) ? 'opacity-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium">{project.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted-foreground">{project.team}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{project.votes}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          project.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : project.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {project.status.charAt(0).toUpperCase() +
                          project.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleHide(project.id)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title={
                            hiddenProjects.includes(project.id)
                              ? 'Show'
                              : 'Hide'
                          }
                        >
                          <Eye2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        </button>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-destructive hover:text-destructive/80" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
