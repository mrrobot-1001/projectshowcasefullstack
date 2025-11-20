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
    <div className="min-h-screen bg-[#fef6e4]">
      <Navbar />
      
      <main className="w-full">
        {/* Neo-Brutalist Header with Gradients */}
        <section className="relative overflow-hidden px-4 py-12 md:py-16 border-b-4 border-black bg-gradient-to-br from-[#ff6b9d] via-[#ff4081] to-[#f50057]">
          {/* Decorative Elements */}
          <div className="absolute top-6 right-12 w-20 h-20 bg-[#c7f464] border-4 border-black rotate-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
          <div className="absolute bottom-8 left-16 w-16 h-16 bg-[#3b82f6] border-4 border-black -rotate-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
          <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-[#ffd93d] border-4 border-black rotate-45"></div>
          
          <div className="container mx-auto max-w-7xl relative z-10">
            <h1 className="text-4xl md:text-6xl font-black mb-4 text-white uppercase tracking-tight drop-shadow-lg">
              Project Showcase
            </h1>
            <p className="text-lg md:text-xl font-bold text-white/95 drop-shadow">
                Explore innovative projects from Bennett University students
            </p>
          </div>
        </section>

        {/* Projects Section */}
        <section className="px-4 py-10">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-8">
              {/* Filter Pills */}
              <FilterPills onSelectCategory={setSelectedCategory} selectedCategory={selectedCategory} />
            </div>

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project: any) => (
                  <ProjectCard 
                    key={project.id} 
                    {...project} 
                    onLikeUpdate={fetchProjects}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
