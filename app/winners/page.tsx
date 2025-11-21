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
      <main className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#ffd93d] via-[#ffc107] to-[#ffd93d] border-4 border-black p-10 mb-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <Sparkles className="absolute top-4 right-4" size={40} strokeWidth={3} />
          <h1 className="text-6xl font-black uppercase mb-4 flex items-center gap-4">
            <Trophy size={60} strokeWidth={3} />
            Winners
          </h1>
          <p className="text-2xl font-bold">Celebrating Excellence</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-2xl font-black animate-pulse">LOADING...</p>
          </div>
        ) : winners.length === 0 ? (
          <div className="bg-white border-4 border-black p-20 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <Trophy size={80} className="mx-auto mb-6 text-gray-400" strokeWidth={3} />
            <h2 className="text-4xl font-black uppercase mb-4">Announcing Soon!</h2>
            <p className="text-xl font-bold text-gray-600">
              Winners will be announced after the judging concludes.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {CATEGORIES.map(category => {
              const categoryWinner = winners.find(w => w.category === category)
              return (
                <div key={category} className="bg-white border-4 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-black uppercase">{category}</h2>
                    <span className="bg-[#c7f464] border-2 border-black px-4 py-2 text-sm font-black">
                      {category}
                    </span>
                  </div>
                  
                  {categoryWinner ? (
                    <div className="bg-[#ffd93d] border-4 border-black p-6 flex items-center gap-6">
                      <Trophy size={60} strokeWidth={3} className="flex-shrink-0" />
                      <div>
                        <p className="text-sm font-black uppercase mb-2">Winner</p>
                        <h3 className="text-4xl font-black">{categoryWinner.team_name}</h3>
                        {categoryWinner.score && (
                          <p className="text-xl font-bold mt-2">Score: {categoryWinner.score}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-gray-400">
                      <p className="text-xl font-black">No winner announced yet</p>
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
