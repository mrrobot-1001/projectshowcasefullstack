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

  // Clean up old entries
  if (store[identifier] && now > store[identifier].resetTime) {
    delete store[identifier]
  }
  const record = store[identifier]

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

// Behind Cloudflare, CF-Connecting-IP is set by Cloudflare and can't be forged
// by the client; the first X-Forwarded-For entry can, so it is never the key.
export function clientIp(request: Request): string {
  const cf = request.headers.get('cf-connecting-ip')
  if (cf) return cf.trim()
  const hops = (request.headers.get('x-forwarded-for') || '').split(',').map(h => h.trim()).filter(Boolean)
  return hops[hops.length - 1] || 'anonymous'
}
