'use client'

import Image from 'next/image'
import { Heart } from 'lucide-react'
import { useState } from 'react'

interface ProjectCardProps {
  id: string
  title: string
  description: string
  thumbnail: string
  track: string
  likes: number
  onLike?: () => void
}

export function ProjectCard({
  id,
  title,
  description,
  thumbnail,
  track,
  likes,
  onLike,
}: ProjectCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(likes)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
    onLike?.()
  }

  return (
    <div className="group soft-shadow bg-card rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative w-full h-48 md:h-56 bg-muted overflow-hidden">
        <Image
          src={thumbnail || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        {/* Track Badge */}
        <div className="mb-3">
          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-secondary/30 text-secondary-foreground">
            {track}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-base md:text-lg mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>

        {/* Like Button */}
        <button
          onClick={handleLike}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
        >
          <Heart
            size={18}
            className={`transition-all ${
              isLiked
                ? 'fill-accent text-accent scale-110'
                : 'hover:scale-110'
            }`}
          />
          <span>{likeCount}</span>
        </button>
      </div>
    </div>
  )
}
