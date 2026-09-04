import { NextResponse } from "next/server";
import { z } from "zod";
import { conversionBySlug } from "@/config/conversions";
import { recordPageView, recordConversionEvent } from "@/lib/admin/stats";
import { isRateLimited, getClientIp } from "@/lib/admin/rate-limit";

const PATH_PATTERN = /^\/[a-zA-Z0-9\-/]{0,200}$/;

const eventSchema = z.discriminatedUnion("event", [
  z.object({ event: z.literal("page_view"), path: z.string().regex(PATH_PATTERN) }),
  z.object({ event: z.literal("conversion_started"), slug: z.string().max(60) }),
  z.object({ event: z.literal("conversion_completed"), slug: z.string().max(60) }),
  z.object({ event: z.literal("conversion_failed"), slug: z.string().max(60) }),
]);

/**
 * Public, unauthenticated aggregate event tracking. No PII, no file
 * contents, no cookies read or set here — just a per-day counter bump. See
 * the privacy policy: "converter page viewed / conversion started /
 * completed / failed" is exactly what's tracked, nothing more.
 */
export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (await isRateLimited("track", ip, 120, 60)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  const json = await request.json().catch(() => null);
  const parsed = eventSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const data = parsed.data;

  if (data.event === "page_view") {
    await recordPageView(data.path);
  } else {
    if (!conversionBySlug[data.slug]) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    await recordConversionEvent(data.slug, data.event);
  }

  return NextResponse.json({ ok: true });
}
