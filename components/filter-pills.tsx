'use client'

const CATEGORIES = [
  { name: 'All', color: 'bg-[#ff6b9d]' },
  { name: 'Web Development', color: 'bg-[#3b82f6]' },
  { name: 'Mobile App', color: 'bg-[#c7f464]' },
  { name: 'AI/ML', color: 'bg-[#a855f7]' },
  { name: 'IoT', color: 'bg-[#22d3ee]' },
  { name: 'Game Development', color: 'bg-[#ffd93d]' },
  { name: 'AR/VR', color: 'bg-[#f97316]' },
  { name: 'Blockchain', color: 'bg-[#8b5cf6]' },
  { name: 'Cloud Computing', color: 'bg-[#10b981]' },
  { name: 'Cybersecurity', color: 'bg-[#ec4899]' },
  { name: 'Other', color: 'bg-[#64748b]' }
]

interface FilterPillsProps {
  onSelectCategory: (category: string) => void
  selectedCategory: string
}

export function FilterPills({ onSelectCategory, selectedCategory }: FilterPillsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-3">
      {CATEGORIES.map((category) => (
        <button
          key={category.name}
          onClick={() => onSelectCategory(category.name)}
          className={`px-5 py-2.5 font-bold text-sm border-3 border-black whitespace-nowrap transition-all uppercase ${
            selectedCategory === category.name
              ? `${category.color} text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]`
              : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
