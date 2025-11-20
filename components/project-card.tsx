'use client'

import Image from 'next/image'
import { Heart } from 'lucide-react'
import { useState, useEffect, memo } from 'react'

interface ProjectCardProps {
  id: string
  title: string
  description: string
  thumbnail?: string
  image_url?: string
  track?: string
  category?: string
  likes?: number
  likes_count?: number
  onLike?: () => void
  onLikeUpdate?: () => void
}

const cardBackgrounds = [
  'bg-white',
  'bg-gray-50',
  'bg-blue-50/30',
  'bg-purple-50/30',
  'bg-pink-50/30',
  'bg-green-50/30',
]

const trackColors = [
  'bg-black',
  'bg-[#3b82f6]',
  'bg-[#8b5cf6]',
  'bg-[#ec4899]',
  'bg-[#f59e0b]',
  'bg-[#10b981]',
  'bg-[#06b6d4]',
  'bg-[#ef4444]',
]

export const ProjectCard = memo(function ProjectCard({
  id,
  title,
  description,
  thumbnail,
  image_url,
  track,
  category,
  likes,
  likes_count,
  onLike,
  onLikeUpdate,
}: ProjectCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(likes_count || likes || 0)
  const [loading, setLoading] = useState(false)

  const imageUrl = image_url || thumbnail || '/placeholder.svg'
  const projectTrack = category || track || 'General'

  // Check if user has already liked this project
  useEffect(() => {
    checkLikeStatus()
  }, [id])

  const checkLikeStatus = async () => {
    try {
      const response = await fetch(`/api/likes?project_id=${id}`, {
        next: { revalidate: 5 }
      })
      if (response.ok) {
        const data = await response.json()
        setIsLiked(data.liked)
      }
    } catch (error) {
      console.error('Error checking like status:', error)
    }
  }

  const handleLike = async () => {
    if (loading) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project_id: id }),
      })

      if (response.ok) {
        const data = await response.json()
        setIsLiked(data.liked)
        setLikeCount(prev => data.liked ? (prev || 0) + 1 : Math.max((prev || 0) - 1, 0))
        
        // Call the callbacks
        onLike?.()
        onLikeUpdate?.()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update vote')
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      alert('Failed to update vote. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Use id to deterministically select colors
  const cardIndex = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const bgColor = cardBackgrounds[cardIndex % cardBackgrounds.length]
  const trackColor = trackColors[cardIndex % trackColors.length]

  return (
    <div className={`group ${bgColor} border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200`}>
      {/* Thumbnail */}
      <div className="relative w-full h-48 md:h-56 bg-gray-100 overflow-hidden border-b-4 border-black">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Track Badge */}
        <div className="mb-3">
          <span className={`inline-block px-3 py-1.5 text-xs font-black ${trackColor} text-white border-2 border-black tracking-wide shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
            {projectTrack}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-black text-lg md:text-xl mb-3 line-clamp-2 text-black">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm font-medium text-gray-700 mb-5 line-clamp-2">
          {description}
        </p>

        {/* Like Button */}
        <button
          onClick={handleLike}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 border-3 border-black font-bold text-sm transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
            isLiked
              ? 'bg-[#ff6b9d] text-white'
              : 'bg-white text-black'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Heart
            size={18}
            strokeWidth={3}
            className={`transition-all ${
              isLiked
                ? 'fill-white'
                : ''
            }`}
          />
          <span>{isLiked ? '❤️ Voted' : `🤍 Vote`} ({likeCount})</span>
        </button>
      </div>
    </div>
  )
})
