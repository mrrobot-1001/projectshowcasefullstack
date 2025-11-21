'use client'

import { Navbar } from '@/components/navbar'
import { Users, Award, Star } from 'lucide-react'
import { CABINET_MEMBERS } from '@/lib/constants'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fef6e4]">
      <Navbar />
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#ff6b9d] to-[#f50057] border-4 border-black p-10 mb-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-5xl font-black text-white uppercase mb-4">About Student Cabinet</h1>
          <p className="text-xl font-bold text-white">Bennett University</p>
        </div>

        {/* Board Members */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#ffd93d] border-4 border-black p-8 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <Star size={48} className="mx-auto mb-4" strokeWidth={3} />
            <h3 className="text-sm font-black uppercase mb-2">President</h3>
            <p className="text-2xl font-black">{CABINET_MEMBERS.president}</p>
          </div>
          
          <div className="bg-[#3b82f6] border-4 border-black p-8 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <Award size={48} className="mx-auto mb-4 text-white" strokeWidth={3} />
            <h3 className="text-sm font-black uppercase mb-2 text-white">Vice President</h3>
            <p className="text-2xl font-black text-white">{CABINET_MEMBERS.vicePresident}</p>
          </div>
          
          <div className="bg-[#c7f464] border-4 border-black p-8 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <Users size={48} className="mx-auto mb-4" strokeWidth={3} />
            <h3 className="text-sm font-black uppercase mb-2">General Secretary</h3>
            <p className="text-2xl font-black">{CABINET_MEMBERS.generalSecretary}</p>
          </div>
        </div>

        {/* About Content */}
        <div className="bg-white border-4 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-3xl font-black uppercase mb-6">Our Mission</h2>
          <p className="text-lg font-bold leading-relaxed mb-4">
            The Student Cabinet at Bennett University is dedicated to fostering innovation, 
            creativity, and excellence among students through various initiatives and events.
          </p>
          <p className="text-lg font-bold leading-relaxed">
            The Team Showcase is our flagship event celebrating the incredible talent and 
            innovative spirit of our student community.
          </p>
        </div>
      </main>
    </div>
  )
}
