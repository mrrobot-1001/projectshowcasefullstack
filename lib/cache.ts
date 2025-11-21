// Simple in-memory cache with TTL
interface CacheEntry<T> {
  data: T
  expiresAt: number
}

const cache = new Map<string, CacheEntry<any>>()

export interface CacheConfig {
  ttl: number // Time to live in milliseconds
}

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key)
  
  if (!entry) return null
  
  if (Date.now() > entry.expiresAt) {
    cache.delete(key)
    return null
  }
  
  return entry.data as T
}

export function setCache<T>(key: string, data: T, ttl: number): void {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttl
  })
}

export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key)
  } else {
    cache.clear()
  }
}

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of cache.entries()) {
    if (entry.expiresAt < now) {
      cache.delete(key)
    }
  }
}, 60000) // Clean every minute
