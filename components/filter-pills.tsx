'use client'

const CATEGORIES = [
  'All',
  'Web Development',
  'Mobile App',
  'AI/ML',
  'IoT',
  'Game Development',
  'AR/VR',
  'Blockchain',
  'Cloud Computing',
  'Cybersecurity',
  'Other'
]

interface FilterPillsProps {
  onSelectCategory: (category: string) => void
  selectedCategory: string
}

export function FilterPills({ onSelectCategory, selectedCategory }: FilterPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            selectedCategory === category
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground hover:bg-muted/80'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
