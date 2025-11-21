'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Trophy, Award, Medal, Star, Sparkles, AlertCircle } from 'lucide-react'

const CATEGORIES = ['AI/ML', 'Clubs and Chapter', 'Cybersecurity and Blockchain', 'Software and Automation', 'Open Innovation', 'SEAS']

interface TeamScore {
  team_name: string
  category: string
  totalScore: number
  judgeCount: number
  averageScore: number
}

interface CategoryWinners {
  first?: TeamScore
  second?: TeamScore
  third?: TeamScore
}

export default function WinnersPage() {
  const [winnersData, setWinnersData] = useState<Record<string, CategoryWinners>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTopTeams()
  }, [])

  const fetchTopTeams = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all scores and projects
      const [scoresRes, projectsRes] = await Promise.all([
        fetch('/api/scores'),
        fetch('/api/projects')
      ])

      if (!scoresRes.ok || !projectsRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const scores = await scoresRes.json()
      const projects = await projectsRes.json()

      // Create a map of project_id to project data
      const projectMap: Record<string, any> = {}
      projects.forEach((project: any) => {
        projectMap[project.id] = project
      })

      // Group scores by team and category
      const teamScores: Record<string, { totalScore: number; judgeCount: number; category: string; team_name: string }> = {}

      scores.forEach((score: any) => {
        const project = projectMap[score.project_id]
        if (!project) return // Skip if project not found

        const key = `${project.team_name}_${project.category}`
        if (!teamScores[key]) {
          teamScores[key] = {
            team_name: project.team_name,
            category: project.category,
            totalScore: 0,
            judgeCount: 0
          }
        }
        teamScores[key].totalScore += score.total_score || 0
        teamScores[key].judgeCount += 1
      })

      // Calculate average scores and group by category
      const categoryTeams: Record<string, TeamScore[]> = {}

      Object.values(teamScores).forEach((team) => {
        const averageScore = team.judgeCount > 0 ? team.totalScore / team.judgeCount : 0
        
        if (!categoryTeams[team.category]) {
          categoryTeams[team.category] = []
        }

        categoryTeams[team.category].push({
          team_name: team.team_name,
          category: team.category,
          totalScore: team.totalScore,
          judgeCount: team.judgeCount,
          averageScore: averageScore
        })
      })

      // Sort each category by average score and get top 3
      const winners: Record<string, CategoryWinners> = {}

      CATEGORIES.forEach(category => {
        const teams = categoryTeams[category] || []
        
        // Sort by average score descending, then by judge count as tiebreaker
        const sortedTeams = teams.sort((a, b) => {
          const avgDiff = b.averageScore - a.averageScore
          if (Math.abs(avgDiff) > 0.01) return avgDiff
          return b.judgeCount - a.judgeCount
        })

        winners[category] = {
          first: sortedTeams[0],
          second: sortedTeams[1],
          third: sortedTeams[2]
        }
      })

      setWinnersData(winners)
    } catch (err) {
      console.error('Error fetching winners:', err)
      setError('Failed to load winners. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fef6e4]">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 max-w-7xl">
        {/* Neo-Brutalist Header */}
        <div className="bg-gradient-to-r from-[#ffd93d] via-[#ffc107] to-[#ffd93d] border-4 border-black p-8 md:p-10 mb-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-black rounded-none flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Trophy size={40} className="md:w-12 md:h-12 text-[#ffd93d]" strokeWidth={3} />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight">
              Winners
            </h1>
          </div>
          <p className="text-xl md:text-2xl font-bold">
            🏆 Top 3 Teams by Average Score in Each Category
          </p>
        </div>

        {/* Winners Display - Neo-Brutalist Style */}
        <div className="space-y-8">
          {loading ? (
            <div className="bg-white border-4 border-black p-20 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <Trophy className="animate-bounce mb-4 mx-auto" size={48} strokeWidth={3} />
              <p className="text-2xl font-black uppercase">Loading Winners...</p>
            </div>
          ) : error ? (
            <div className="bg-[#ff6b9d] border-4 border-black p-10 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <AlertCircle className="mb-4 mx-auto" size={48} strokeWidth={3} />
              <p className="text-xl font-black uppercase mb-4">{error}</p>
              <button 
                onClick={fetchTopTeams}
                className="px-6 py-3 bg-black text-white font-black uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {Object.keys(winnersData).length === 0 && (
                <div className="bg-[#ffd93d] border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-3">
                    <Sparkles size={24} strokeWidth={3} />
                    <p className="font-black text-lg uppercase">
                      No scores submitted yet. Winners will appear once judging begins.
                    </p>
                  </div>
                </div>
              )}
              
              {CATEGORIES.map((category, categoryIndex) => {
                const categoryWinners = winnersData[category] || {}
            
            return (
              <div 
                key={category} 
                className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
              >
                {/* Category Header - Neo-Brutalist */}
                <div className="bg-gradient-to-r from-[#c7f464] to-[#a8e04a] border-b-4 border-black px-6 py-5">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-black flex items-center justify-center border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        <Award size={24} strokeWidth={3} className="text-[#ffd93d]" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                        {category}
                      </h2>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="text-black fill-black" size={20} strokeWidth={3} />
                      <Star className="text-black fill-black" size={20} strokeWidth={3} />
                      <Star className="text-black fill-black" size={20} strokeWidth={3} />
                    </div>
                  </div>
                </div>
                
                {/* Winners Grid - Neo-Brutalist */}
                <div className="p-6 md:p-8">
                  {!categoryWinners.first && !categoryWinners.second && !categoryWinners.third ? (
                    <div className="text-center py-12 border-4 border-dashed border-gray-300">
                      <p className="font-black text-xl uppercase text-gray-400">No teams scored yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* 1st Place - Gold Neo-Brutalist */}
                      {categoryWinners.first && (
                        <div className="md:order-2 bg-gradient-to-br from-[#ffd700] to-[#ffc107] border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all">
                          <div className="flex items-center justify-between mb-4">
                            <span className="bg-black text-[#ffd93d] text-xs font-black uppercase px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                              🥇 1st Place
                            </span>
                            <div className="w-10 h-10 bg-black flex items-center justify-center border-2 border-black">
                              <Trophy size={20} strokeWidth={3} className="text-[#ffd93d]" />
                            </div>
                          </div>
                          
                          <h3 className="text-2xl md:text-3xl font-black uppercase leading-tight break-words">
                            {categoryWinners.first.team_name}
                          </h3>
                        </div>
                      )}

                      {/* 2nd Place - Silver Neo-Brutalist */}
                      {categoryWinners.second && (
                        <div className="md:order-1 bg-gradient-to-br from-[#e8e8e8] to-[#c0c0c0] border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all">
                          <div className="flex items-center justify-between mb-4">
                            <span className="bg-black text-white text-xs font-black uppercase px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                              🥈 2nd Place
                            </span>
                            <div className="w-10 h-10 bg-white flex items-center justify-center border-2 border-black">
                              <Medal size={20} strokeWidth={3} className="text-gray-700" />
                            </div>
                          </div>
                          
                          <h3 className="text-xl md:text-2xl font-black uppercase leading-tight break-words">
                            {categoryWinners.second.team_name}
                          </h3>
                        </div>
                      )}

                      {/* 3rd Place - Bronze Neo-Brutalist */}
                      {categoryWinners.third && (
                        <div className="md:order-3 bg-gradient-to-br from-[#e5a85f] to-[#cd7f32] border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all">
                          <div className="flex items-center justify-between mb-4">
                            <span className="bg-black text-[#ffd93d] text-xs font-black uppercase px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                              🥉 3rd Place
                            </span>
                            <div className="w-10 h-10 bg-[#8b5a2b] flex items-center justify-center border-2 border-black">
                              <Award size={20} strokeWidth={3} className="text-white" />
                            </div>
                          </div>
                          
                          <h3 className="text-xl md:text-2xl font-black uppercase leading-tight break-words">
                            {categoryWinners.third.team_name}
                          </h3>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
