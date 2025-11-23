// Simple in-memory rate limiter for development
// For production, use Upstash Redis or similar

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

const store: RateLimitStore = {};

// Clean up old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    Object.keys(store).forEach(key => {
        if (store[key].resetTime < now) {
            delete store[key];
        }
    });
}, 5 * 60 * 1000);

export interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
}

export function rateLimit(identifier: string, config: RateLimitConfig): { success: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const key = identifier;

    if (!store[key] || store[key].resetTime < now) {
        // First request or window expired
        store[key] = {
            count: 1,
            resetTime: now + config.windowMs,
        };
        return {
            success: true,
            remaining: config.maxRequests - 1,
            resetTime: store[key].resetTime,
        };
    }

    if (store[key].count >= config.maxRequests) {
        // Rate limit exceeded
        return {
            success: false,
            remaining: 0,
            resetTime: store[key].resetTime,
        };
    }

    // Increment count
    store[key].count++;
    return {
        success: true,
        remaining: config.maxRequests - store[key].count,
        resetTime: store[key].resetTime,
    };
}

// Preset configurations
export const RATE_LIMITS = {
    // 5 requests per minute for registration
    REGISTER: { maxRequests: 5, windowMs: 60 * 1000 },
    // 10 requests per minute for resume parsing (expensive OpenAI calls)
    PARSE_RESUME: { maxRequests: 10, windowMs: 60 * 1000 },
    // 20 requests per minute for general API
    GENERAL: { maxRequests: 20, windowMs: 60 * 1000 },
};
