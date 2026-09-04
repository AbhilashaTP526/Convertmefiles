import { redirect } from "next/navigation";
import { FiAlertCircle } from "react-icons/fi";
import { requireAdminSession } from "@/lib/admin/auth";
import { getStatsSummary } from "@/lib/admin/stats";
import { StatTile } from "@/components/admin/stat-tile";
import { DailyTrendChart } from "@/components/admin/daily-trend-chart";
import { BarList } from "@/components/admin/bar-list";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  if (!(await requireAdminSession())) redirect("/admin/login");

  const summary = await getStatsSummary(14);

  if (!summary.configured) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
        <div className="flex items-start gap-3">
          <FiAlertCircle aria-hidden className="mt-0.5 shrink-0 text-amber-600" size={20} />
          <div>
            <p className="font-semibold text-amber-900">Analytics storage isn&apos;t connected yet</p>
            <p className="mt-1 text-sm text-amber-800">
              Add a free Upstash Redis (Vercel KV) database to your project in the Vercel dashboard under Storage →
              Create Database, connect it to this project, and redeploy. Page views and conversion stats will start
              appearing here automatically — no code changes needed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const conversionRate =
    summary.totalConversionsStarted > 0
      ? Math.round((summary.totalConversionsCompleted / summary.totalConversionsStarted) * 100)
      : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">Last 14 days · aggregate only, no personal data</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Page views" value={summary.totalPageViews.toLocaleString()} />
        <StatTile label="Conversions started" value={summary.totalConversionsStarted.toLocaleString()} />
        <StatTile label="Conversions completed" value={summary.totalConversionsCompleted.toLocaleString()} />
        <StatTile label="Completion rate" value={`${conversionRate}%`} hint="completed ÷ started" />
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="font-semibold text-zinc-900">Page views per day</h2>
        <div className="mt-4">
          <DailyTrendChart points={summary.days.map((d) => ({ date: d.date, value: d.pageViews }))} label="Page views" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="font-semibold text-zinc-900">Top pages</h2>
          <div className="mt-4">
            <BarList
              items={summary.topPages.map((p) => ({ label: p.path, value: p.count }))}
              emptyMessage="No page views recorded yet."
            />
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="font-semibold text-zinc-900">Top converters (started)</h2>
          <div className="mt-4">
            <BarList
              items={summary.topConversions.map((c) => ({ label: c.slug, value: c.started }))}
              emptyMessage="No conversions recorded yet."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
