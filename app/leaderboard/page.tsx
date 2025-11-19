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
      <div className="flex items-center justify-center w-10 h-10 bg-yellow-400 border-4 border-black text-black font-black text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        1
      </div>
    )
  }
  if (rank === 2) {
    return (
      <div className="flex items-center justify-center w-10 h-10 bg-gray-300 border-4 border-black text-black font-black text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        2
      </div>
    )
  }
  if (rank === 3) {
    return (
      <div className="flex items-center justify-center w-10 h-10 bg-orange-400 border-4 border-black text-black font-black text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        3
      </div>
    )
  }
  return (
    <div className="flex items-center justify-center w-10 h-10 bg-white border-3 border-black text-black font-bold text-base">
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

      <main className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Neo-Brutalist Header */}
        <div className="mb-10 bg-[#ff6b9d] border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
          <div className="flex items-center gap-4 mb-3">
            <Trophy className="w-10 h-10 text-black" strokeWidth={3} />
            <h1 className="text-5xl md:text-6xl font-black text-black uppercase tracking-tight">
              Leaderboard
            </h1>
          </div>
          <p className="text-lg md:text-xl font-bold text-black">
            🏆 Top projects ranked by community votes
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="mb-8 flex gap-3 overflow-x-auto pb-3">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 font-bold text-sm border-3 border-black whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-[#3b82f6] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]'
                  : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Leaderboard Content */}
        {loading ? (
          <div className="bg-white border-4 border-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xl font-bold text-black">Loading leaderboard...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="bg-[#f97316] border-4 border-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-black" strokeWidth={3} />
            <p className="text-2xl font-black text-black mb-2">No Projects Yet!</p>
            <p className="text-lg font-bold text-black">Be the first to submit a project in this category.</p>
          </div>
        ) : (
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 md:p-6 bg-black text-white font-black text-sm md:text-base border-b-4 border-black">
              <div className="col-span-2 md:col-span-1">RANK</div>
              <div className="col-span-6 md:col-span-4">PROJECT</div>
              <div className="hidden md:block md:col-span-3">TEAM</div>
              <div className="hidden lg:block lg:col-span-2">CATEGORY</div>
              <div className="col-span-4 md:col-span-2 text-right">VOTES</div>
            </div>

            {/* Table Body */}
            <div className="divide-y-4 divide-black">
              {leaderboard.map((item) => (
                <div
                  key={item.id}
                  className={`grid grid-cols-12 gap-4 p-4 md:p-6 hover:bg-[#fef6e4] transition-colors ${
                    item.rank <= 3 ? 'bg-yellow-50' : ''
                  }`}
                >
                  {/* Rank */}
                  <div className="col-span-2 md:col-span-1 flex items-center">
                    {getRankBadge(item.rank)}
                  </div>

                  {/* Project Title */}
                  <div className="col-span-6 md:col-span-4 flex flex-col justify-center">
                    <p className="font-black text-base md:text-lg text-black leading-tight">
                      {item.title}
                    </p>
                    <p className="text-sm font-bold text-gray-700 md:hidden mt-1">
                      {item.team_name}
                    </p>
                  </div>

                  {/* Team Name */}
                  <div className="hidden md:flex md:col-span-3 items-center">
                    <p className="font-bold text-black">{item.team_name}</p>
                  </div>

                  {/* Category */}
                  <div className="hidden lg:flex lg:col-span-2 items-center">
                    <span className="inline-block px-3 py-1.5 text-xs font-black bg-[#c7f464] text-black border-2 border-black">
                      {item.category}
                    </span>
                  </div>

                  {/* Votes */}
                  <div className="col-span-4 md:col-span-2 flex items-center justify-end">
                    <div className="flex items-center gap-2 bg-[#ff6b9d] border-3 border-black px-4 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      <span className="text-2xl">❤️</span>
                      <span className="font-black text-lg text-black">{item.likes_count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
