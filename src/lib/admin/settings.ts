import { cache } from "react";
import { getRedis } from "./kv";

export interface SiteSettings {
  adsense: {
    enabled: boolean;
    /** Google AdSense publisher ID, e.g. "ca-pub-1234567890123456". */
    clientId: string;
    /** Ad unit (slot) IDs for the handful of placements the site templates already have. */
    slots: {
      belowConverter: string;
      belowContent: string;
    };
  };
  updatedAt: string | null;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  adsense: {
    enabled: false,
    clientId: "",
    slots: {
      belowConverter: "",
      belowContent: "",
    },
  },
  updatedAt: null,
};

const SETTINGS_KEY = "convertmefiles:settings";

/** Memoized per-request (React `cache`) so multiple ad placements on one page share a single KV read. */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const redis = getRedis();
  if (!redis) return DEFAULT_SETTINGS;

  const stored = await redis.get<SiteSettings>(SETTINGS_KEY);
  if (!stored) return DEFAULT_SETTINGS;

  // Merge over defaults so adding new settings fields later doesn't break old stored data.
  return {
    adsense: {
      ...DEFAULT_SETTINGS.adsense,
      ...stored.adsense,
      slots: { ...DEFAULT_SETTINGS.adsense.slots, ...stored.adsense?.slots },
    },
    updatedAt: stored.updatedAt ?? null,
  };
});

export async function updateSiteSettings(next: SiteSettings["adsense"]): Promise<SiteSettings> {
  const redis = getRedis();
  if (!redis) {
    throw new Error("Settings storage isn't configured (missing KV_REST_API_URL / KV_REST_API_TOKEN).");
  }

  const settings: SiteSettings = { adsense: next, updatedAt: new Date().toISOString() };
  await redis.set(SETTINGS_KEY, settings);
  return settings;
}
