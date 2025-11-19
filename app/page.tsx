'use client'

import { Navbar } from '@/components/navbar'
import { ProjectCard } from '@/components/project-card'
import { FilterPills } from '@/components/filter-pills'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

// Mock data
const PROJECTS = [
  {
    id: '1',
    title: 'AI Chat Assistant',
    description: 'An intelligent chatbot powered by machine learning for customer support',
    thumbnail: '/ai-chat-assistant-interface.jpg',
    track: 'AI/ML',
    likes: 342,
  },
  {
    id: '2',
    title: 'Social Media Dashboard',
    description: 'Real-time analytics dashboard for social media metrics',
    thumbnail: '/analytics-dashboard.png',
    track: 'Web Development',
    likes: 218,
  },
  {
    id: '3',
    title: 'Mobile Fitness App',
    description: 'Track workouts, calories, and fitness goals on mobile',
    thumbnail: '/fitness-mobile-app-interface.png',
    track: 'Mobile App',
    likes: 156,
  },
  {
    id: '4',
    title: 'Game Engine Demo',
    description: '3D game engine with physics simulation and graphics',
    thumbnail: '/3d-game-engine.jpg',
    track: 'Game Dev',
    likes: 289,
  },
  {
    id: '5',
    title: 'IoT Home Control',
    description: 'Smart home automation system with voice control',
    thumbnail: '/smart-home-iot-system.jpg',
    track: 'IoT',
    likes: 198,
  },
  {
    id: '6',
    title: 'Design System UI Kit',
    description: 'Comprehensive component library and design tokens',
    thumbnail: '/design-system-ui-components.jpg',
    track: 'Design',
    likes: 412,
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="w-full">
        {/* Hero Section */}
        <section className="px-4 py-8 md:py-16 lg:py-20 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto max-w-6xl">
            <div className="space-y-6 md:space-y-8">
              {/* Hero Content */}
              <div className="space-y-4 md:space-y-5">
                <div className="flex items-center gap-2 text-sm md:text-base font-medium text-primary">
                  <Sparkles size={18} />
                  <span>Welcome to Student Cabinet</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
                  Discover Amazing Projects
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl text-pretty leading-relaxed">
                  Explore innovative creations from students across Computer Science and Engineering. From AI to gaming, see what our community is building.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button size="lg" asChild className="w-full sm:w-auto">
                  <a href="/upload" className="flex items-center justify-center gap-2">
                    Submit Project
                    <ArrowRight size={18} />
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                  <a href="/team">Create a Team</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Filters & Projects Section */}
        <section className="px-4 py-12 md:py-16 lg:py-20">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-12 md:mb-16">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">Featured Projects</h2>
                  <p className="text-muted-foreground text-sm md:text-base mt-2">Browse projects by category</p>
                </div>
                <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                  <a href="/projects">View All Projects</a>
                </Button>
              </div>

              {/* Filter Pills */}
              <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
                <div className="flex gap-2 min-w-min md:min-w-0 md:flex-wrap">
                  <FilterPills />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {PROJECTS.map((project) => (
                <ProjectCard key={project.id} {...project} />
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="px-4 py-12 md:py-16 lg:py-20 border-t border-border/50">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold text-balance">
                  Have a Project to Showcase?
                </h2>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of students sharing their innovative work. Upload your project and get recognized by the community.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button size="lg" asChild className="w-full sm:w-auto">
                  <a href="/upload">Get Started</a>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                  <a href="/leaderboard">View Leaderboard</a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
