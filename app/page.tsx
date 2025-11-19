'use client'

import { Navbar } from '@/components/navbar'
import { ProjectCard } from '@/components/project-card'
import { FilterPills } from '@/components/filter-pills'
import { useState, useEffect } from 'react'

export default function Home() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        // Ensure data is an array
        setProjects(Array.isArray(data) ? data : [])
      } else {
        setProjects([])
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter((p: any) => p.category === selectedCategory)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="w-full">
        {/* Clean Header */}
        <section className="px-4 py-12 md:py-16 border-b">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Project Showcase</h1>
            <p className="text-muted-foreground text-lg">
              Explore innovative projects from Bennett University students
            </p>
          </div>
        </section>

        {/* Projects Section */}
        <section className="px-4 py-8">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-8">
              {/* Filter Pills */}
              <div className="overflow-x-auto pb-2">
                <div className="flex gap-2 flex-wrap">
                  <FilterPills onSelectCategory={setSelectedCategory} selectedCategory={selectedCategory} />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading projects...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No projects found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project: any) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
