import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin/auth";
import { getSiteSettings, updateSiteSettings } from "@/lib/admin/settings";

const adsenseSchema = z.object({
  enabled: z.boolean(),
  clientId: z
    .string()
    .max(60)
    .regex(/^(ca-pub-\d{10,20})?$/, "Must look like ca-pub-XXXXXXXXXXXXXXXX, or be left blank."),
  slots: z.object({
    belowConverter: z.string().max(40).regex(/^\d*$/, "Ad slot IDs are numeric."),
    belowContent: z.string().max(40).regex(/^\d*$/, "Ad slot IDs are numeric."),
  }),
});

export async function GET() {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = adsenseSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid settings." }, { status: 400 });
  }

  try {
    const settings = await updateSiteSettings(parsed.data);
    return NextResponse.json(settings);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to save settings." }, { status: 500 });
  }
}
