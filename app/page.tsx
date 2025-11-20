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
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="w-full">
        {/* Refined Neo-Brutalist Header */}
        <section className="relative overflow-hidden px-4 sm:px-6 py-20 md:py-28 lg:py-36 border-b-4 border-black bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
          
          {/* Floating Geometric Shapes */}
          <div className="absolute top-16 right-24 w-20 h-20 bg-white/5 border-2 border-white/10 rotate-12 backdrop-blur-sm shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)]"></div>
          <div className="absolute top-32 right-48 w-12 h-12 bg-pink-500/10 border-2 border-pink-400/20 -rotate-6 backdrop-blur-sm"></div>
          <div className="absolute bottom-20 left-24 w-16 h-16 bg-white/5 border-2 border-white/10 rotate-45 backdrop-blur-sm shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)]"></div>
          <div className="absolute bottom-40 left-56 w-10 h-10 bg-blue-500/10 border-2 border-blue-400/20 -rotate-12 backdrop-blur-sm"></div>
          
          {/* Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-500/30 to-transparent"></div>
          
          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="max-w-4xl">
              {/* Version Badge */}
              <div className="inline-block mb-6 px-4 py-2 bg-white/10 border-2 border-white/20 backdrop-blur-md shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)]">
                <span className="text-sm font-bold text-white/80 tracking-wider">VERSION 2.0</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 text-white tracking-tight leading-[0.9]">
                Project<br/>Showcase
              </h1>
              
              <div className="max-w-2xl">
                <p className="text-lg md:text-xl lg:text-2xl font-medium text-white/70 leading-relaxed mb-8">
                  Discover innovative projects from Bennett University students
                </p>
                
                {/* Stats Bar */}
                <div className="flex flex-wrap gap-6 text-white/60">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 border border-white/30"></div>
                    <span className="text-sm font-bold">Innovation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 border border-white/30"></div>
                    <span className="text-sm font-bold">Creativity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 border border-white/30"></div>
                    <span className="text-sm font-bold">Excellence</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="px-4 sm:px-6 py-12 md:py-16 lg:py-20 bg-gray-50">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-10 md:mb-12">
              {/* Filter Pills */}
              <FilterPills onSelectCategory={setSelectedCategory} selectedCategory={selectedCategory} />
            </div>

            {loading ? (
              <div className="bg-white border-3 border-black p-16 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="inline-block w-8 h-8 border-3 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-lg font-bold text-black">Loading projects...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="bg-white border-3 border-black p-16 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 border-3 border-black flex items-center justify-center">
                  <span className="text-3xl">📂</span>
                </div>
                <p className="text-2xl font-black text-black mb-2">No Projects Found</p>
                <p className="text-base font-medium text-gray-600">Try selecting a different category or upload your own project</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
