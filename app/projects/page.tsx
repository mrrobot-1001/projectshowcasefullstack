'use client'

import { Navbar } from '@/components/navbar'
import { ProjectCard } from '@/components/project-card'
import { FilterPills } from '@/components/filter-pills'
import { useState, useEffect } from 'react'

export default function ProjectsPage() {
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
    <div className="min-h-screen bg-[#fef6e4]">
      <Navbar />

      <main className="container mx-auto px-4 pb-16 md:pb-20 pt-8">
        {/* Header */}
        <section className="mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase">All Projects</h1>
          <p className="text-lg font-bold text-gray-700">
            Browse the full collection of projects submitted by our community
          </p>
        </section>

        {/* Filter Pills */}
        <div className="mb-8">
          <FilterPills onSelectCategory={setSelectedCategory} selectedCategory={selectedCategory} />
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="bg-white border-4 border-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xl font-bold text-black">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-[#c7f464] border-4 border-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-2xl font-black text-black mb-2">No Projects Found!</p>
            <p className="text-lg font-bold text-black">Try selecting a different category or upload your own project.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                {...project}
                onLikeUpdate={fetchProjects}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
