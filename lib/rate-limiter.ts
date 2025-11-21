// Simple in-memory rate limiter
interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export interface RateLimitConfig {
  interval: number // Time window in milliseconds
  maxRequests: number // Max requests per interval
}

export function rateLimit(identifier: string, config: RateLimitConfig): boolean {
  const now = Date.now()
  const record = store[identifier]

  // Clean up old entries
  if (record && now > record.resetTime) {
    delete store[identifier]
  }

  // Check if limit exceeded
  if (record && record.count >= config.maxRequests) {
    return false // Rate limit exceeded
  }

  // Update or create record
  if (!store[identifier]) {
    store[identifier] = {
      count: 1,
      resetTime: now + config.interval
    }
  } else {
    store[identifier].count++
  }

  return true // Request allowed
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  })
}, 60000) // Clean every minute
