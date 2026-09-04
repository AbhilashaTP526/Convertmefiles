import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/auth";
import { getStatsSummary } from "@/lib/admin/stats";

export async function GET(request: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const requested = Number(url.searchParams.get("days") ?? "14");
  const days = Number.isFinite(requested) ? Math.min(90, Math.max(1, Math.trunc(requested))) : 14;

  const summary = await getStatsSummary(days);
  return NextResponse.json(summary);
}
