import { Redis } from "@upstash/redis";

/**
 * Thin wrapper around Upstash Redis (aka "Vercel KV"). Returns null when the
 * store isn't configured yet, so the rest of the app can degrade gracefully
 * — analytics/AdSense settings are optional extras, never a hard dependency
 * for the core converter functionality.
 *
 * Supports both the `KV_REST_API_*` env vars (Vercel's Marketplace/KV
 * integration) and the raw `UPSTASH_REDIS_REST_*` vars (connecting to
 * Upstash directly), whichever is present.
 */
let client: Redis | null | undefined;

export function getRedis(): Redis | null {
  if (client !== undefined) return client;

  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  client = url && token ? new Redis({ url, token }) : null;
  return client;
}

export function isKvConfigured(): boolean {
  return getRedis() !== null;
}
