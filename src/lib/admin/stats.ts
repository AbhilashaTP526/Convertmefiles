import { getRedis } from "./kv";

const STATS_TTL_SECONDS = 60 * 60 * 24 * 95; // ~95 days

function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

export type ConversionEventType = "conversion_started" | "conversion_completed" | "conversion_failed";

/** Records one aggregate pageview. No IP, no user agent, no cookies — just a per-day counter per path. */
export async function recordPageView(path: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  const key = `stats:pageviews:${dateKey(new Date())}`;
  await redis.hincrby(key, path, 1);
  await redis.expire(key, STATS_TTL_SECONDS);
}

/** Records one aggregate conversion funnel event — no filenames or file contents involved. */
export async function recordConversionEvent(slug: string, event: ConversionEventType): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  const key = `stats:conversions:${dateKey(new Date())}`;
  await redis.hincrby(key, `${slug}:${event}`, 1);
  await redis.expire(key, STATS_TTL_SECONDS);
}

export interface DailyStats {
  date: string;
  pageViews: number;
  conversionsStarted: number;
  conversionsCompleted: number;
  conversionsFailed: number;
}

export interface StatsSummary {
  configured: boolean;
  days: DailyStats[];
  totalPageViews: number;
  totalConversionsStarted: number;
  totalConversionsCompleted: number;
  topPages: Array<{ path: string; count: number }>;
  topConversions: Array<{ slug: string; started: number; completed: number }>;
}

const EMPTY_SUMMARY: StatsSummary = {
  configured: false,
  days: [],
  totalPageViews: 0,
  totalConversionsStarted: 0,
  totalConversionsCompleted: 0,
  topPages: [],
  topConversions: [],
};

export async function getStatsSummary(rangeDays = 14): Promise<StatsSummary> {
  const redis = getRedis();
  if (!redis) return EMPTY_SUMMARY;

  const days: DailyStats[] = [];
  const pageTotals = new Map<string, number>();
  const conversionTotals = new Map<string, { started: number; completed: number; failed: number }>();

  for (let i = rangeDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const key = dateKey(d);

    const [pageviewHash, conversionHash] = await Promise.all([
      redis.hgetall<Record<string, number>>(`stats:pageviews:${key}`),
      redis.hgetall<Record<string, number>>(`stats:conversions:${key}`),
    ]);

    let dayPageViews = 0;
    for (const [path, count] of Object.entries(pageviewHash ?? {})) {
      const n = Number(count);
      dayPageViews += n;
      pageTotals.set(path, (pageTotals.get(path) ?? 0) + n);
    }

    let dayStarted = 0;
    let dayCompleted = 0;
    let dayFailed = 0;
    for (const [field, countRaw] of Object.entries(conversionHash ?? {})) {
      const count = Number(countRaw);
      const separatorIndex = field.lastIndexOf(":");
      const slug = field.slice(0, separatorIndex);
      const event = field.slice(separatorIndex + 1);
      const totals = conversionTotals.get(slug) ?? { started: 0, completed: 0, failed: 0 };
      if (event === "conversion_started") {
        totals.started += count;
        dayStarted += count;
      } else if (event === "conversion_completed") {
        totals.completed += count;
        dayCompleted += count;
      } else if (event === "conversion_failed") {
        totals.failed += count;
        dayFailed += count;
      }
      conversionTotals.set(slug, totals);
    }

    days.push({
      date: key,
      pageViews: dayPageViews,
      conversionsStarted: dayStarted,
      conversionsCompleted: dayCompleted,
      conversionsFailed: dayFailed,
    });
  }

  const topPages = [...pageTotals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([path, count]) => ({ path, count }));

  const topConversions = [...conversionTotals.entries()]
    .sort((a, b) => b[1].started - a[1].started)
    .slice(0, 8)
    .map(([slug, t]) => ({ slug, started: t.started, completed: t.completed }));

  return {
    configured: true,
    days,
    totalPageViews: days.reduce((sum, d) => sum + d.pageViews, 0),
    totalConversionsStarted: days.reduce((sum, d) => sum + d.conversionsStarted, 0),
    totalConversionsCompleted: days.reduce((sum, d) => sum + d.conversionsCompleted, 0),
    topPages,
    topConversions,
  };
}
