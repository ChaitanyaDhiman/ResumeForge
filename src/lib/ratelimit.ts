// Simple in-memory rate limiter for development
// ⚠️ WARNING: For production, use a distributed solution like Upstash Redis or Vercel KV
// In-memory storage will not work across multiple serverless instances

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

/**
 * Extracts the real IP address from request headers
 * Handles various proxy headers in order of priority
 */
export function extractIpAddress(request: Request): string {
    const headers = request.headers;

    // Check various headers in order of reliability
    const forwardedFor = headers.get('x-forwarded-for');
    if (forwardedFor) {
        // x-forwarded-for can contain multiple IPs, take the first one
        return forwardedFor.split(',')[0].trim();
    }

    const realIp = headers.get('x-real-ip');
    if (realIp) {
        return realIp;
    }

    const cfConnectingIp = headers.get('cf-connecting-ip'); // Cloudflare
    if (cfConnectingIp) {
        return cfConnectingIp;
    }

    return 'unknown';
}

export function rateLimit(identifier: string, config: RateLimitConfig): { success: boolean; remaining: number; resetTime: number } {
    // Allow bypass for testing if environment variable is set
    if (process.env.RATE_LIMIT_BYPASS === 'true' && process.env.NODE_ENV !== 'production') {
        return {
            success: true,
            remaining: config.maxRequests,
            resetTime: Date.now() + config.windowMs,
        };
    }

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
    // 5 requests per 10 minutes for OTP resend
    RESEND_OTP: { maxRequests: 5, windowMs: 10 * 60 * 1000 }
};
