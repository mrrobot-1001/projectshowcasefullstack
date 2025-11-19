'use client'

import { Navbar } from '@/components/navbar'
import { Trophy, Medal } from 'lucide-react'
import Image from 'next/image'

const LEADERBOARD_DATA = [
  {
    rank: 1,
    title: 'AI Chat Assistant',
    team: 'AI Pioneers',
    track: 'AI/ML',
    likes: 445,
  },
  {
    rank: 2,
    title: 'Predictive Analytics Engine',
    team: 'Data Wizards',
    track: 'AI/ML',
    likes: 434,
  },
  {
    rank: 3,
    title: 'Design System UI Kit',
    team: 'Design Collective',
    track: 'Design',
    likes: 412,
  },
  {
    rank: 4,
    title: 'AR Try-On Experience',
    team: 'Mobile Innovators',
    track: 'Mobile App',
    likes: 334,
  },
  {
    rank: 5,
    title: 'Game Engine Demo',
    team: 'Game Crafters',
    track: 'Game Dev',
    likes: 289,
  },
  {
    rank: 6,
    title: 'Cloud Infrastructure',
    team: 'Cloud Masters',
    track: 'Cloud',
    likes: 267,
  },
  {
    rank: 7,
    title: 'Social Media Dashboard',
    team: 'Web Developers',
    track: 'Web Development',
    likes: 218,
  },
  {
    rank: 8,
    title: 'IoT Home Control',
    team: 'Smart Home Team',
    track: 'IoT',
    likes: 198,
  },
]

function getRankIcon(rank: number) {
  if (rank === 1) return <Trophy className="w-5 h-5 text-amber-500" />
  if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />
  if (rank === 3) return <Medal className="w-5 h-5 text-orange-600" />
  return <span className="text-sm font-semibold text-muted-foreground">#{rank}</span>
}

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 pb-16 md:pb-20">
        {/* Header */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-accent" />
            <h1 className="text-4xl md:text-5xl font-bold">Leaderboard</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Top projects ranked by community votes
          </p>
        </section>

        {/* Track Filter */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {['All', 'AI/ML', 'Web', 'Mobile', 'Game Dev', 'Design'].map((track) => (
            <button
              key={track}
              className="px-4 py-2 rounded-full text-sm font-medium bg-muted hover:bg-muted/80 whitespace-nowrap transition-colors"
            >
              {track}
            </button>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="soft-shadow bg-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/20 bg-muted/50">
                  <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold">
                    Rank
                  </th>
                  <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold">
                    Project
                  </th>
                  <th className="hidden md:table-cell px-4 md:px-6 py-4 text-left text-sm font-semibold">
                    Team
                  </th>
                  <th className="hidden lg:table-cell px-4 md:px-6 py-4 text-left text-sm font-semibold">
                    Track
                  </th>
                  <th className="px-4 md:px-6 py-4 text-right text-sm font-semibold">
                    Votes
                  </th>
                </tr>
              </thead>
              <tbody>
                {LEADERBOARD_DATA.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-border/10 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center justify-center">
                        {getRankIcon(item.rank)}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground md:hidden">
                        {item.team}
                      </p>
                    </td>
                    <td className="hidden md:table-cell px-4 md:px-6 py-4">
                      <p className="text-sm">{item.team}</p>
                    </td>
                    <td className="hidden lg:table-cell px-4 md:px-6 py-4">
                      <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-secondary/30 text-secondary-foreground">
                        {item.track}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-right font-semibold">
                      {item.likes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
