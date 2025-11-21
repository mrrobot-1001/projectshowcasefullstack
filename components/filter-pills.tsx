'use client'

import { memo } from 'react'
import { CATEGORIES } from '@/lib/constants'

const CATEGORY_COLORS = [
  { name: 'All', color: 'bg-black' },
  { name: 'Clubs and Chapter', color: 'bg-[#3b82f6]' },
  { name: 'AI/ML', color: 'bg-[#ec4899]' },
  { name: 'Cybersecurity and Blockchain', color: 'bg-[#6366f1]' },
  { name: 'Open Innovation', color: 'bg-[#10b981]' },
  { name: 'Software and Automation', color: 'bg-[#f59e0b]' }
]

interface FilterPillsProps {
  onSelectCategory: (category: string) => void
  selectedCategory: string
}

export const FilterPills = memo(function FilterPills({ onSelectCategory, selectedCategory }: FilterPillsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
      {CATEGORY_COLORS.map((category) => (
        <button
          key={category.name}
          onClick={() => onSelectCategory(category.name)}
          className={`px-5 py-2.5 font-bold text-sm border-3 border-black whitespace-nowrap transition-all ${
            selectedCategory === category.name
              ? `${category.color} text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`
              : 'bg-white text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
})
