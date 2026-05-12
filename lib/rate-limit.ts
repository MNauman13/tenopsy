type WindowEntry = {
    count: number;
    resetAt: number;
};

// NOTE: In-memory store — works for single-server and long-lived processes.
// For serverless/distributed deployments replace with Upstash Redis.
const store = new Map<string, WindowEntry>();

function cleanup() {
    const now = Date.now();
    for (const [key, entry] of store) {
        if (now >= entry.resetAt) store.delete(key);
    }
}

export interface RateLimitResult {
    success: boolean;
    remaining: number;
    resetAt: number;
}

/**
 * Fixed-window rate limiter.
 * @param identifier - unique key (e.g. user email or IP address)
 * @param limit      - max requests allowed per window
 * @param windowMs   - window duration in milliseconds
 */
export function rateLimit(
    identifier: string,
    limit: number,
    windowMs: number
): RateLimitResult {
    cleanup();
    const now = Date.now();
    const entry = store.get(identifier);

    if (!entry || now >= entry.resetAt) {
        const resetAt = now + windowMs;
        store.set(identifier, { count: 1, resetAt });
        return { success: true, remaining: limit - 1, resetAt };
    }

    if (entry.count >= limit) {
        return { success: false, remaining: 0, resetAt: entry.resetAt };
    }

    entry.count += 1;
    return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

export function getClientIp(req: Request): string {
    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();
    return req.headers.get('x-real-ip') ?? 'unknown';
}

export function rateLimitHeaders(result: RateLimitResult, limit: number): Record<string, string> {
    return {
        'X-RateLimit-Limit': String(limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
        ...(result.success ? {} : {
            'Retry-After': String(Math.ceil((result.resetAt - Date.now()) / 1000)),
        }),
    };
}
