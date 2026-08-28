/**
 * Rate Limiter for AI Shortcut Generator Route
 * Provides per-IP sliding window request tracking to prevent API quota exhaustion.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

const MAX_REQUESTS_PER_WINDOW = 20; // 20 requests per hour per IP
const WINDOW_DURATION_MS = 60 * 60 * 1000; // 1 hour

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetInMinutes: number } {
  const now = Date.now();
  const record = memoryStore.get(ip);

  // Clean expired
  if (!record || now > record.resetAt) {
    memoryStore.set(ip, {
      count: 1,
      resetAt: now + WINDOW_DURATION_MS
    });
    return {
      allowed: true,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      resetInMinutes: Math.ceil(WINDOW_DURATION_MS / (60 * 1000))
    };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    const remainingMs = record.resetAt - now;
    return {
      allowed: false,
      remaining: 0,
      resetInMinutes: Math.ceil(remainingMs / (60 * 1000))
    };
  }

  record.count += 1;
  const remainingMs = record.resetAt - now;
  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - record.count,
    resetInMinutes: Math.ceil(remainingMs / (60 * 1000))
  };
}
