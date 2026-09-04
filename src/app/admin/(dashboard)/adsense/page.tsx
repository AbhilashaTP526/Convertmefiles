import { redirect } from "next/navigation";
import { FiAlertCircle } from "react-icons/fi";
import { requireAdminSession } from "@/lib/admin/auth";
import { getSiteSettings } from "@/lib/admin/settings";
import { isKvConfigured } from "@/lib/admin/kv";
import { AdsenseSettingsForm } from "@/components/admin/adsense-settings-form";

export const metadata = { title: "AdSense" };

export default async function AdminAdsensePage() {
  if (!(await requireAdminSession())) redirect("/admin/login");

  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">AdSense</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Paste your AdSense publisher ID and ad slot IDs below — ads appear on the site as soon as you save, no
          deploy required.
        </p>
      </div>

      {!isKvConfigured() && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <FiAlertCircle aria-hidden className="mt-0.5 shrink-0 text-amber-600" size={18} />
          <p className="text-sm text-amber-800">
            Settings storage isn&apos;t connected yet, so changes here can&apos;t be saved. Add a free Upstash Redis
            (Vercel KV) database under Storage → Create Database in your Vercel project, connect it, and redeploy.
          </p>
        </div>
      )}

      <AdsenseSettingsForm initial={settings.adsense} />
    </div>
  );
}
