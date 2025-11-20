'use client'

export function ProjectCardSkeleton() {
  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-pulse">
      {/* Thumbnail Skeleton */}
      <div className="w-full h-48 md:h-56 bg-gray-200 border-b-4 border-black"></div>

      {/* Content Skeleton */}
      <div className="p-5">
        {/* Track Badge Skeleton */}
        <div className="mb-3">
          <div className="h-7 w-24 bg-gray-300 border-2 border-black"></div>
        </div>

        {/* Title Skeleton */}
        <div className="mb-3 space-y-2">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="h-6 bg-gray-300 rounded w-1/2"></div>
        </div>

        {/* Description Skeleton */}
        <div className="mb-5 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>

        {/* Like Button Skeleton */}
        <div className="h-10 w-32 bg-gray-300 border-3 border-black"></div>
      </div>
    </div>
  )
}
