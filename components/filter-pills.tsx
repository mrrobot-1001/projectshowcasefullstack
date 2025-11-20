'use client'

import { memo } from 'react'

const CATEGORIES = [
  { name: 'All', color: 'bg-black' },
  { name: 'Web Development', color: 'bg-[#3b82f6]' },
  { name: 'Mobile App', color: 'bg-[#8b5cf6]' },
  { name: 'AI/ML', color: 'bg-[#ec4899]' },
  { name: 'IoT', color: 'bg-[#06b6d4]' },
  { name: 'Game Development', color: 'bg-[#f59e0b]' },
  { name: 'AR/VR', color: 'bg-[#10b981]' },
  { name: 'Blockchain', color: 'bg-[#6366f1]' },
  { name: 'Cloud Computing', color: 'bg-[#14b8a6]' },
  { name: 'Cybersecurity', color: 'bg-[#ef4444]' },
  { name: 'Other', color: 'bg-[#64748b]' }
]

interface FilterPillsProps {
  onSelectCategory: (category: string) => void
  selectedCategory: string
}

export const FilterPills = memo(function FilterPills({ onSelectCategory, selectedCategory }: FilterPillsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
      {CATEGORIES.map((category) => (
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
