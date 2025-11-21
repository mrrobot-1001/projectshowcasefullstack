'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Trophy, Medal, Sparkles } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'

interface LeaderboardItem {
  id: string
  rank: number
  title: string
  team_name: string
  category: string
  likes_count: number
}

const CATEGORY_OPTIONS = ['All', ...CATEGORIES]

function getRankBadge(rank: number) {
  if (rank === 1) {
    return (
      <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-yellow-400 border-3 sm:border-4 border-black text-black font-black text-base sm:text-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        1
      </div>
    )
  }
  if (rank === 2) {
    return (
      <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 border-3 sm:border-4 border-black text-black font-black text-base sm:text-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        2
      </div>
    )
  }
  if (rank === 3) {
    return (
      <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-orange-400 border-3 sm:border-4 border-black text-black font-black text-base sm:text-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        3
      </div>
    )
  }
  return (
    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-white border-2 sm:border-3 border-black text-black font-bold text-sm sm:text-base">
      {rank}
    </div>
  )
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Debounce API calls
    const timer = setTimeout(() => {
      fetchLeaderboard()
    }, 300)

    return () => clearTimeout(timer)
  }, [selectedCategory])

  const fetchLeaderboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const url = selectedCategory === 'All'
        ? '/api/leaderboard'
        : `/api/leaderboard?category=${encodeURIComponent(selectedCategory)}`

      const response = await fetch(url, {
        // Add cache headers
        headers: {
          'Cache-Control': 'max-age=30'
        }
      })

      if (response.status === 429) {
        setError('Too many requests. Please wait a moment.')
        return
      }

      const data = await response.json()

      if (response.ok && data.leaderboard) {
        setLeaderboard(data.leaderboard)
      } else {
        setLeaderboard([])
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
      setError('Failed to load leaderboard. Please try again.')
      setLeaderboard([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fef6e4]">
      <Navbar />

      <main className="w-full">
        {/* Refined Neo-Brutalist Header - Blue/Cyan Theme */}
        <section className="relative overflow-hidden px-4 sm:px-6 py-20 md:py-28 lg:py-36 border-b-4 border-black bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900">
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>

          {/* Floating Geometric Shapes */}
          <div className="absolute top-16 right-24 w-20 h-20 bg-white/5 border-2 border-white/10 rotate-12 backdrop-blur-sm shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)]"></div>
          <div className="absolute top-32 right-48 w-12 h-12 bg-cyan-500/10 border-2 border-cyan-400/20 -rotate-6 backdrop-blur-sm"></div>
          <div className="absolute bottom-20 left-24 w-16 h-16 bg-white/5 border-2 border-white/10 rotate-45 backdrop-blur-sm shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)]"></div>
          <div className="absolute bottom-40 left-56 w-10 h-10 bg-yellow-500/10 border-2 border-yellow-400/20 -rotate-12 backdrop-blur-sm"></div>

          {/* Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>

          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="max-w-4xl">
              {/* Trophy Icon Badge */}
              <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-white/10 border-2 border-white/20 backdrop-blur-md shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)]">
                <Trophy className="w-5 h-5 text-yellow-400" strokeWidth={3} />
                <span className="text-sm font-bold text-white/80 tracking-wider">RANKINGS</span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 text-white tracking-tight leading-[0.9]">
                Leader<br />board
              </h1>

              <div className="max-w-2xl">
                <p className="text-lg md:text-xl lg:text-2xl font-medium text-white/70 leading-relaxed mb-8">
                  Top teams ranked by community votes
                </p>

                {/* Stats Bar */}
                <div className="flex flex-wrap gap-6 text-white/60">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 border border-white/30"></div>
                    <span className="text-sm font-bold">Top Ranked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-500 border border-white/30"></div>
                    <span className="text-sm font-bold">Community Voted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 border border-white/30"></div>
                    <span className="text-sm font-bold">Live Updates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12 max-w-7xl">

          {/* Category Filter Pills */}
          <div className="mb-6 sm:mb-8 flex gap-2 sm:gap-3 overflow-x-auto pb-3 scrollbar-hide">
            {CATEGORY_OPTIONS.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 font-bold text-xs sm:text-sm border-3 border-black whitespace-nowrap transition-all ${selectedCategory === category
                    ? 'bg-[#3b82f6] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]'
                    : 'bg-white text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Leaderboard Content */}
          {loading ? (
            <div className="bg-white border-3 sm:border-4 border-black p-8 sm:p-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-lg sm:text-xl font-bold text-black">Loading leaderboard...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="bg-[#f97316] border-3 sm:border-4 border-black p-8 sm:p-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-black" strokeWidth={3} />
              <p className="text-xl sm:text-2xl font-black text-black mb-2">No Projects Yet!</p>
              <p className="text-base sm:text-lg font-bold text-black">Be the first to submit a project in this category.</p>
            </div>
          ) : (
            <div className="bg-white border-3 sm:border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              {/* Table Header - Desktop Only */}
              <div className="hidden lg:grid grid-cols-12 gap-4 p-4 md:p-6 bg-black text-white font-black text-sm md:text-base border-b-4 border-black">
                <div className="col-span-1">RANK</div>
                <div className="col-span-4">PROJECT</div>
                <div className="col-span-3">TEAM</div>
                <div className="col-span-2">CATEGORY</div>
                <div className="col-span-2 text-right">VOTES</div>
              </div>

              {/* Table Body */}
              <div className="divide-y-3 sm:divide-y-4 divide-black">
                {leaderboard.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 sm:p-4 md:p-6 hover:bg-[#fef6e4] transition-colors ${item.rank <= 3 ? 'bg-yellow-50' : ''
                      }`}
                  >
                    {/* Mobile Layout (< lg) */}
                    <div className="lg:hidden">
                      <div className="flex items-start gap-3 sm:gap-4">
                        {/* Rank Badge */}
                        <div className="flex-shrink-0">
                          {getRankBadge(item.rank)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-black text-base sm:text-lg text-black leading-tight mb-1">
                            {item.title}
                          </h3>
                          <p className="text-sm sm:text-base font-bold text-gray-700 mb-2">
                            {item.team_name}
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-block px-2 sm:px-3 py-1 text-xs font-black bg-[#c7f464] text-black border-2 border-black">
                              {item.category}
                            </span>
                            <div className="flex items-center gap-1.5 sm:gap-2 bg-[#ff6b9d] border-2 sm:border-3 border-black px-2 sm:px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                              <span className="text-lg sm:text-xl">❤</span>
                              <span className="font-black text-base sm:text-lg text-black">{item.likes_count}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout (lg+) */}
                    <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                      {/* Rank */}
                      <div className="col-span-1">
                        {getRankBadge(item.rank)}
                      </div>

                      {/* Project Title */}
                      <div className="col-span-4">
                        <p className="font-black text-lg text-black leading-tight">
                          {item.title}
                        </p>
                      </div>

                      {/* Team Name */}
                      <div className="col-span-3">
                        <p className="font-bold text-black">{item.team_name}</p>
                      </div>

                      {/* Category */}
                      <div className="col-span-2">
                        <span className="inline-block px-3 py-1.5 text-xs font-black bg-[#c7f464] text-black border-2 border-black">
                          {item.category}
                        </span>
                      </div>

                      {/* Votes */}
                      <div className="col-span-2 flex justify-end">
                        <div className="flex items-center gap-2 bg-[#ff6b9d] border-3 border-black px-4 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                          <span className="text-2xl">❤</span>
                          <span className="font-black text-lg text-black">{item.likes_count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
