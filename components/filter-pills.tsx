'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const TRACKS = [
  'All',
  'Web Development',
  'Mobile App',
  'AI/ML',
  'Design',
  'Game Dev',
  'IoT',
  'Cloud',
]

interface FilterPillsProps {
  onSelect?: (track: string) => void
}

export function FilterPills({ onSelect }: FilterPillsProps) {
  const [selected, setSelected] = useState('All')
  const [scroll, setScroll] = useState(0)

  const handleSelect = (track: string) => {
    setSelected(track)
    onSelect?.(track)
  }

  return (
    <div className="relative flex items-center gap-2 mb-8">
      {/* Scroll left button */}
      <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-muted hover:bg-muted/80 transition-colors flex-shrink-0">
        <ChevronLeft size={18} />
      </button>

      {/* Pills container */}
      <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 -mx-4 md:mx-0 px-4 md:px-0 no-scrollbar">
        {TRACKS.map((track) => (
          <button
            key={track}
            onClick={() => handleSelect(track)}
            className={`px-4 md:px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
              selected === track
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-muted text-foreground border-transparent hover:bg-muted/80'
            }`}
          >
            {track}
          </button>
        ))}
      </div>

      {/* Scroll right button */}
      <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-muted hover:bg-muted/80 transition-colors flex-shrink-0">
        <ChevronRight size={18} />
      </button>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
