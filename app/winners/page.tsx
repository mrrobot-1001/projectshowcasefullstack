'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Trophy, Sparkles } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'

export default function WinnersPage() {
  const [winners, setWinners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWinners()
  }, [])

  const fetchWinners = async () => {
    try {
      const res = await fetch('/api/winners')
      if (res.ok) {
        const data = await res.json()
        setWinners(data.winners || [])
      }
    } catch (error) {
      console.error('Error fetching winners:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fef6e4]">
      <Navbar />
      <main className="container mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 max-w-7xl">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#ffd93d] via-[#ffc107] to-[#ffd93d] border-3 sm:border-4 border-black p-6 sm:p-8 md:p-10 mb-6 sm:mb-8 md:mb-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <Sparkles className="absolute top-3 right-3 sm:top-4 sm:right-4" size={28} strokeWidth={3} />
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <Trophy size={40} className="sm:w-12 sm:h-12 md:w-16 md:h-16" strokeWidth={3} />
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-tight">
              Winners
            </h1>
          </div>
          <p className="text-lg sm:text-xl md:text-2xl font-bold">Celebrating Excellence</p>
        </div>

        {loading ? (
          <div className="text-center py-12 sm:py-16 md:py-20">
            <p className="text-xl sm:text-2xl font-black animate-pulse">LOADING...</p>
          </div>
        ) : winners.length === 0 ? (
          <div className="bg-white border-3 sm:border-4 border-black p-8 sm:p-12 md:p-16 lg:p-20 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <Trophy size={60} className="sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 text-gray-400" strokeWidth={3} />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase mb-3 sm:mb-4">Announcing Soon!</h2>
            <p className="text-base sm:text-lg md:text-xl font-bold text-gray-600">
              Winners will be announced after the judging concludes.
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {CATEGORIES.map(category => {
              const firstPlace = winners.find(w => w.category === category && w.position === 1)
              const secondPlace = winners.find(w => w.category === category && w.position === 2)
              const thirdPlace = winners.find(w => w.category === category && w.position === 3)
              const hasWinners = firstPlace || secondPlace || thirdPlace
              
              return (
                <div key={category} className="bg-white border-3 sm:border-4 border-black p-4 sm:p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase">{category}</h2>
                    <span className="bg-[#c7f464] border-2 border-black px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-black inline-block w-fit">
                      {category}
                    </span>
                  </div>
                  
                  {hasWinners ? (
                    <div className="space-y-3 sm:space-y-4">
                      {/* 1st Place */}
                      {firstPlace && (
                        <div className="bg-gradient-to-r from-[#ffd93d] to-[#ffc107] border-3 sm:border-4 border-black p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <span className="text-4xl sm:text-5xl md:text-6xl">🥇</span>
                              <Trophy size={32} strokeWidth={3} className="sm:w-12 sm:h-12 md:w-14 md:h-14" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-black uppercase mb-1 sm:mb-2">1st Place Winner</p>
                              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black break-words">{firstPlace.team_name}</h3>
                              {firstPlace.score && (
                                <p className="text-base sm:text-lg font-bold mt-1 sm:mt-2">Score: {firstPlace.score}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 2nd Place */}
                      {secondPlace && (
                        <div className="bg-gradient-to-r from-[#c0c0c0] to-[#a8a8a8] border-3 sm:border-4 border-black p-4 sm:p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                            <span className="text-3xl sm:text-4xl md:text-5xl">🥈</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm font-black uppercase mb-1">2nd Place</p>
                              <h3 className="text-xl sm:text-2xl md:text-3xl font-black break-words">{secondPlace.team_name}</h3>
                              {secondPlace.score && (
                                <p className="text-sm sm:text-base font-bold mt-1">Score: {secondPlace.score}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 3rd Place */}
                      {thirdPlace && (
                        <div className="bg-gradient-to-r from-[#cd7f32] to-[#b8732d] border-3 sm:border-4 border-black p-4 sm:p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                            <span className="text-3xl sm:text-4xl md:text-5xl">🥉</span>
                            <div className="flex-1 min-w-0 text-white">
                              <p className="text-xs sm:text-sm font-black uppercase mb-1">3rd Place</p>
                              <h3 className="text-xl sm:text-2xl md:text-3xl font-black break-words">{thirdPlace.team_name}</h3>
                              {thirdPlace.score && (
                                <p className="text-sm sm:text-base font-bold mt-1">Score: {thirdPlace.score}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-10 text-gray-400">
                      <p className="text-lg sm:text-xl font-black">No winners announced yet</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
