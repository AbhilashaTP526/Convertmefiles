import { getRedis } from "./kv";

/**
 * Fixed-window rate limiter backed by KV. Best-effort: if KV isn't
 * configured, this no-ops (allows the request) rather than failing closed,
 * since rate limiting is a hardening measure, not a hard dependency for the
 * core site to function.
 */
export async function isRateLimited(bucket: string, identifier: string, limit: number, windowSeconds: number): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;

  const key = `ratelimit:${bucket}:${identifier}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, windowSeconds);
  }
  return count > limit;
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
