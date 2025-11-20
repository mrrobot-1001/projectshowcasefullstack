'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Award, Search, LogOut, Star, X } from 'lucide-react'
import Image from 'next/image'

interface Project {
  id: string
  title: string
  description: string
  category: string
  team_name: string
  image_url: string
  likes_count: number
}

interface Score {
  innovation: number
  pitching: number
  presentation: number
  creativity: number
  functionality: number
  scalability: number
}

export default function JudgePage() {
  const router = useRouter()
  const [judge, setJudge] = useState<any>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [scoredProjectIds, setScoredProjectIds] = useState<Set<string>>(new Set())
  
  // Scoring modal state
  const [scoringProject, setScoringProject] = useState<Project | null>(null)
  const [scores, setScores] = useState<Score>({
    innovation: 0,
    pitching: 0,
    presentation: 0,
    creativity: 0,
    functionality: 0,
    scalability: 0
  })
  const [submittingScore, setSubmittingScore] = useState(false)
  const [hasExistingScore, setHasExistingScore] = useState(false)

  const categories = ['All', 'Web Development', 'Mobile App', 'AI/ML', 'Game Development', 'IoT', 'AR/VR', 'Cloud Computing', 'Data Science', 'Other']

  useEffect(() => {
    // Check judge authentication
    const judgeAuth = localStorage.getItem('judgeAuth')
    if (!judgeAuth) {
      router.push('/guest-login')
      return
    }

    const judgeData = JSON.parse(judgeAuth)
    setJudge(judgeData)
    fetchProjects()
    fetchScoredProjects(judgeData.id)
  }, [router])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      setProjects(data)
      setFilteredProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchScoredProjects = async (judgeId: string) => {
    try {
      const res = await fetch('/api/scores')
      if (res.ok) {
        const allScores = await res.json()
        const judgeScores = allScores.filter((score: any) => score.judge_id === judgeId)
        const projectIds = new Set<string>(judgeScores.map((score: any) => score.project_id as string))
        setScoredProjectIds(projectIds)
      }
    } catch (error) {
      console.error('Error fetching scored projects:', error)
    }
  }

  useEffect(() => {
    let filtered = projects

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.team_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredProjects(filtered)
  }, [selectedCategory, searchQuery, projects])

  const handleLogout = () => {
    localStorage.removeItem('judgeAuth')
    router.push('/login')
  }

  const openScoringModal = async (project: Project) => {
    setScoringProject(project)
    setHasExistingScore(false)
    
    // Fetch existing score if any
    try {
      const res = await fetch(`/api/scores?projectId=${project.id}&judgeId=${judge.id}`)
      if (res.ok) {
        const data = await res.json()
        if (data.score) {
          // Score already exists - show in read-only mode
          setScores({
            innovation: data.score.innovation,
            pitching: data.score.pitching,
            presentation: data.score.presentation,
            creativity: data.score.creativity,
            functionality: data.score.functionality,
            scalability: data.score.scalability
          })
          setHasExistingScore(true)
        } else {
          // No existing score - reset to zero
          setScores({
            innovation: 0,
            pitching: 0,
            presentation: 0,
            creativity: 0,
            functionality: 0,
            scalability: 0
          })
          setHasExistingScore(false)
        }
      }
    } catch (error) {
      console.error('Error fetching score:', error)
    }
  }

  const submitScore = async () => {
    if (!scoringProject || !judge) return

    // Validate all scores are between 0-10
    const allScores = Object.values(scores)
    if (allScores.some(s => s < 0 || s > 10)) {
      alert('All scores must be between 0 and 10')
      return
    }

    setSubmittingScore(true)

    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: scoringProject.id,
          judgeId: judge.id,
          judgeName: judge.name,
          scores
        })
      })

      if (res.ok) {
        alert('Score submitted successfully!')
        // Refresh the list of scored projects
        await fetchScoredProjects(judge.id)
        setScoringProject(null)
      } else {
        const error = await res.json()
        alert(`Failed to submit score: ${error.error}`)
      }
    } catch (error) {
      console.error('Error submitting score:', error)
      alert('Error submitting score')
    } finally {
      setSubmittingScore(false)
    }
  }

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fef6e4] flex items-center justify-center">
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xl font-black">LOADING...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fef6e4]">
      <Navbar />
      
      <main className="container mx-auto px-4 py-10 max-w-7xl">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#a855f7] via-[#7c3aed] to-[#6d28d9] text-white border-4 border-black p-8 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="absolute top-2 right-20 w-16 h-16 bg-[#ffd93d] border-3 border-white rotate-12 opacity-80"></div>
          <div className="absolute bottom-2 left-20 w-12 h-12 bg-[#ff6b9d] border-3 border-white -rotate-12 opacity-80"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="bg-white border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Award size={32} strokeWidth={3} className="text-[#a855f7]" />
              </div>
              <div>
                <h1 className="text-5xl font-black uppercase">Judge Panel</h1>
                {judge && (
                  <p className="text-xl font-bold mt-1">Welcome, {judge.name}</p>
                )}
              </div>
            </div>
            <Button onClick={handleLogout} variant="destructive" size="sm">
              <LogOut size={18} strokeWidth={3} className="mr-2" />
              LOGOUT
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black" size={20} strokeWidth={3} />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 font-bold"
            />
          </div>

          {/* Category Pills */}
          <div className="flex gap-3 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 font-black border-3 border-black uppercase transition-all ${
                  selectedCategory === category
                    ? 'bg-[#a855f7] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]'
                    : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const isScored = scoredProjectIds.has(project.id)
            return (
              <div
                key={project.id}
                className={`bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-pointer ${isScored ? 'opacity-75' : ''}`}
                onClick={() => openScoringModal(project)}
              >
                <div className="relative h-48 overflow-hidden border-b-4 border-black">
                  <Image
                    src={project.image_url || '/placeholder.jpg'}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                  {/* Scored Badge */}
                  {isScored && (
                    <div className="absolute top-3 right-3 bg-[#c7f464] border-3 border-black px-3 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
                      <Star size={16} strokeWidth={3} className="fill-black" />
                      <span className="text-xs font-black uppercase">SCORED</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-black uppercase mb-2 line-clamp-1">{project.title}</h3>
                  <p className="text-sm font-bold text-gray-600 mb-3">{project.team_name}</p>
                  <p className="text-sm mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex gap-2 items-center">
                    <span className="bg-[#c7f464] border-2 border-black px-3 py-1 text-xs font-black">
                      {project.category}
                    </span>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        openScoringModal(project)
                      }}
                      size="sm"
                      className={`ml-auto ${isScored ? 'bg-[#3b82f6] hover:bg-[#2563eb]' : 'bg-[#a855f7] hover:bg-[#7c3aed]'}`}
                    >
                      <Star size={14} strokeWidth={3} className={`mr-1 ${isScored ? 'fill-white' : ''}`} />
                      {isScored ? 'VIEW SCORE' : 'SCORE'}
                    </Button>
                  </div>
                </div>
            </div>
            )
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl font-black text-gray-400 uppercase">No projects found</p>
          </div>
        )}
      </main>

      {/* Scoring Modal */}
      {scoringProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
            {/* Header - Fixed */}
            <div className="bg-[#a855f7] border-b-4 border-black p-4 md:p-6 flex items-start justify-between gap-3 flex-shrink-0">
              <div className="flex-1 min-w-0 overflow-hidden">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black uppercase text-white break-words line-clamp-2">{scoringProject.title}</h2>
                <p className="text-white font-bold mt-1 text-xs sm:text-sm md:text-base truncate">Team: {scoringProject.team_name}</p>
              </div>
              <button
                onClick={() => setScoringProject(null)}
                className="bg-white border-3 border-black p-2 hover:bg-gray-100 flex-shrink-0"
                aria-label="Close"
              >
                <X size={20} strokeWidth={3} className="md:w-6 md:h-6" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="p-4 md:p-6 overflow-y-auto flex-1">
              {/* Already Scored Banner */}
              {hasExistingScore && (
                <div className="mb-6 bg-gradient-to-r from-[#c7f464] to-[#a8d92e] border-4 border-black p-4 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-3">
                    <div className="bg-white border-3 border-black p-2">
                      <Star size={24} strokeWidth={3} className="text-[#c7f464]" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-black uppercase">Already Scored</h3>
                      <p className="text-sm font-bold">You have already submitted a score for this project</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Project Details */}
              <div className="mb-6">
                <span className="bg-[#c7f464] border-2 border-black px-3 py-1 text-xs font-black inline-block mb-3">
                  {scoringProject.category}
                </span>
                <p className="text-xs sm:text-sm md:text-base font-bold leading-relaxed break-words">{scoringProject.description}</p>
              </div>

              {/* Scoring Criteria */}
              <div className="space-y-3 md:space-y-4">
                {[
                  { key: 'innovation', label: 'Innovation', color: '#ff6b9d', textColor: 'text-black' },
                  { key: 'pitching', label: 'Pitching the Idea', color: '#3b82f6', textColor: 'text-white' },
                  { key: 'presentation', label: 'Presentation Skills', color: '#ffd93d', textColor: 'text-black' },
                  { key: 'creativity', label: 'Creativity', color: '#c7f464', textColor: 'text-black' },
                  { key: 'functionality', label: 'Functionality', color: '#a855f7', textColor: 'text-white' },
                  { key: 'scalability', label: 'Scalability', color: '#06b6d4', textColor: 'text-white' },
                ].map(({ key, label, color, textColor }) => (
                  <div key={key} className={`border-3 border-black p-3 md:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${hasExistingScore ? 'bg-gray-50' : 'bg-white'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <label className="text-xs md:text-sm font-black uppercase flex-1 truncate">{label}</label>
                      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        {/* Number Input */}
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={scores[key as keyof Score]}
                          onChange={(e) => {
                            if (!hasExistingScore) {
                              const val = Math.min(10, Math.max(0, parseInt(e.target.value) || 0))
                              setScores({ ...scores, [key]: val })
                            }
                          }}
                          disabled={hasExistingScore}
                          className={`w-12 sm:w-16 px-1 sm:px-2 py-1 border-2 border-black text-center font-black text-base sm:text-lg ${hasExistingScore ? 'cursor-not-allowed opacity-75' : ''}`}
                          style={{ backgroundColor: color, color: textColor === 'text-white' ? 'white' : 'black' }}
                        />
                        <span className="font-black text-sm sm:text-lg">/10</span>
                      </div>
                    </div>
                    
                    {/* Slider */}
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={scores[key as keyof Score]}
                        onChange={(e) => {
                          if (!hasExistingScore) {
                            setScores({ ...scores, [key]: parseInt(e.target.value) })
                          }
                        }}
                        disabled={hasExistingScore}
                        className={`w-full h-8 md:h-10 border-2 border-black appearance-none rounded-none ${hasExistingScore ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                        style={{
                          background: `linear-gradient(to right, ${color} 0%, ${color} ${scores[key as keyof Score] * 10}%, #ffffff ${scores[key as keyof Score] * 10}%, #ffffff 100%)`
                        }}
                      />
                      <div className="hidden sm:flex justify-between text-xs font-bold mt-1 px-1 text-gray-600">
                        <span>0</span>
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>4</span>
                        <span>5</span>
                        <span>6</span>
                        <span>7</span>
                        <span>8</span>
                        <span>9</span>
                        <span>10</span>
                      </div>
                      <div className="flex sm:hidden justify-between text-xs font-bold mt-1 px-1 text-gray-600">
                        <span>0</span>
                        <span>5</span>
                        <span>10</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Score - Fixed Size */}
              <div className="mt-6 bg-gradient-to-r from-[#a855f7] to-[#7c3aed] border-4 border-black p-4 md:p-6 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-base sm:text-xl md:text-2xl font-black uppercase whitespace-nowrap">TOTAL SCORE</span>
                  <span className="text-3xl sm:text-4xl md:text-5xl font-black whitespace-nowrap">{totalScore}/60</span>
                </div>
                <div className="mt-3 bg-white bg-opacity-20 h-3 overflow-hidden border-2 border-white">
                  <div 
                    className="h-full bg-white transition-all duration-300"
                    style={{ width: `${(totalScore / 60) * 100}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                {!hasExistingScore ? (
                  <>
                    <Button
                      onClick={submitScore}
                      disabled={submittingScore}
                      className="flex-1 bg-[#c7f464] hover:bg-[#a8d92e] text-black border-3 border-black font-black text-sm sm:text-base md:text-lg h-12 md:h-14 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                      {submittingScore ? 'SUBMITTING...' : '✓ SUBMIT SCORE'}
                    </Button>
                    <Button
                      onClick={() => setScoringProject(null)}
                      variant="outline"
                      className="px-6 md:px-8 h-12 md:h-14 font-black text-sm sm:text-base"
                    >
                      CANCEL
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setScoringProject(null)}
                    className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white border-3 border-black font-black text-sm sm:text-base md:text-lg h-12 md:h-14 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    CLOSE
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
