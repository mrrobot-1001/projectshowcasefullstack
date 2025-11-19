'use client'

import { Navbar } from '@/components/navbar'
import { ProjectCard } from '@/components/project-card'
import { FilterPills } from '@/components/filter-pills'

const ALL_PROJECTS = [
  {
    id: '1',
    title: 'AI Chat Assistant',
    description: 'An intelligent chatbot powered by machine learning',
    thumbnail: '/ai-chat.jpg',
    track: 'AI/ML',
    likes: 342,
  },
  {
    id: '2',
    title: 'Social Media Dashboard',
    description: 'Real-time analytics dashboard for metrics',
    thumbnail: '/general-data-dashboard.png',
    track: 'Web Development',
    likes: 218,
  },
  {
    id: '3',
    title: 'Mobile Fitness App',
    description: 'Track workouts and fitness goals',
    thumbnail: '/fitness-app-interface.png',
    track: 'Mobile App',
    likes: 156,
  },
  {
    id: '4',
    title: 'Game Engine Demo',
    description: '3D game engine with physics',
    thumbnail: '/game-engine.jpg',
    track: 'Game Dev',
    likes: 289,
  },
  {
    id: '5',
    title: 'IoT Home Control',
    description: 'Smart home automation system',
    thumbnail: '/smart-home.jpg',
    track: 'IoT',
    likes: 198,
  },
  {
    id: '6',
    title: 'Design System UI Kit',
    description: 'Comprehensive component library',
    thumbnail: '/design-system-abstract.png',
    track: 'Design',
    likes: 412,
  },
  {
    id: '7',
    title: 'Cloud Infrastructure Platform',
    description: 'Scalable cloud deployment solution',
    thumbnail: '/cloud-platform.jpg',
    track: 'Cloud',
    likes: 267,
  },
  {
    id: '8',
    title: 'AR Try-On Experience',
    description: 'Augmented reality app for products',
    thumbnail: '/ar-experience.jpg',
    track: 'Mobile App',
    likes: 334,
  },
  {
    id: '9',
    title: 'Predictive Analytics Engine',
    description: 'ML model for data prediction',
    thumbnail: '/analytics-engine.jpg',
    track: 'AI/ML',
    likes: 445,
  },
]

export default function ProjectsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 pb-16 md:pb-20">
        {/* Header */}
        <section className="mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">All Projects</h1>
          <p className="text-lg text-muted-foreground">
            Browse the full collection of projects submitted by our community
          </p>
        </section>

        {/* Filter Pills */}
        <FilterPills />

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {ALL_PROJECTS.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </main>
    </div>
  )
}
