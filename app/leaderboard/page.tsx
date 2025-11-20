'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Trophy, Medal, Sparkles } from 'lucide-react'

interface LeaderboardItem {
  id: string
  rank: number
  title: string
  team_name: string
  category: string
  likes_count: number
}

const CATEGORIES = ['All', 'Web Development', 'Mobile App', 'AI/ML', 'Game Dev', 'IoT', 'Cloud', 'Design']

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

  useEffect(() => {
    fetchLeaderboard()
  }, [selectedCategory])

  const fetchLeaderboard = async () => {
    setLoading(true)
    try {
      const url = selectedCategory === 'All' 
        ? '/api/leaderboard'
        : `/api/leaderboard?category=${encodeURIComponent(selectedCategory)}`
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (response.ok && data.leaderboard) {
        setLeaderboard(data.leaderboard)
      } else {
        setLeaderboard([])
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
      setLeaderboard([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fef6e4]">
      <Navbar />

      <main className="w-full">
        {/* Neo-Brutalist Header with Gradients */}
        <section className="relative overflow-hidden px-4 sm:px-6 py-8 sm:py-12 md:py-16 border-b-4 border-black bg-gradient-to-br from-[#ff6b9d] via-[#ff4081] to-[#f50057]">
          {/* Decorative Elements - responsive sizing */}
          <div className="absolute top-4 sm:top-6 right-6 sm:right-12 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-[#c7f464] border-3 sm:border-4 border-black rotate-12 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
          <div className="absolute bottom-4 sm:bottom-8 left-6 sm:left-16 w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#3b82f6] border-3 sm:border-4 border-black -rotate-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
          <div className="absolute top-1/2 right-1/4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#ffd93d] border-3 sm:border-4 border-black rotate-45"></div>
          
          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white drop-shadow-lg" strokeWidth={3} />
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight drop-shadow-lg text-center sm:text-left">
                Leaderboard
              </h1>
            </div>
            <p className="text-base sm:text-lg md:text-xl font-bold text-white/95 drop-shadow text-center sm:text-left">
              🏆 Top projects ranked by community votes
            </p>
          </div>
        </section>

        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12 max-w-7xl">

        {/* Category Filter Pills */}
        <div className="mb-6 sm:mb-8 flex gap-2 sm:gap-3 overflow-x-auto pb-3 scrollbar-hide">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 font-bold text-xs sm:text-sm border-3 border-black whitespace-nowrap transition-all ${
                selectedCategory === category
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
                  className={`p-3 sm:p-4 md:p-6 hover:bg-[#fef6e4] transition-colors ${
                    item.rank <= 3 ? 'bg-yellow-50' : ''
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
