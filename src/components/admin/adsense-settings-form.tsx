"use client";

import { useState } from "react";
import { FiAlertCircle, FiCheckCircle, FiLoader } from "react-icons/fi";
import type { SiteSettings } from "@/lib/admin/settings";
import { Button } from "@/components/ui/button";

export function AdsenseSettingsForm({ initial }: { initial: SiteSettings["adsense"] }) {
  const [enabled, setEnabled] = useState(initial.enabled);
  const [clientId, setClientId] = useState(initial.clientId);
  const [belowConverter, setBelowConverter] = useState(initial.slots.belowConverter);
  const [belowContent, setBelowContent] = useState(initial.slots.belowContent);

  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError(null);

    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enabled,
        clientId: clientId.trim(),
        slots: { belowConverter: belowConverter.trim(), belowContent: belowContent.trim() },
      }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error ?? "Failed to save settings.");
      setStatus("error");
      return;
    }

    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      <label className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
        />
        <span>
          <span className="block font-medium text-zinc-900">Show ads</span>
          <span className="block text-sm text-zinc-500">Turn AdSense on or off site-wide without removing your settings below.</span>
        </span>
      </label>

      <div>
        <label htmlFor="clientId" className="block text-sm font-medium text-zinc-700">
          AdSense publisher ID
        </label>
        <input
          id="clientId"
          type="text"
          placeholder="ca-pub-1234567890123456"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm font-mono focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
        <p className="mt-1 text-xs text-zinc-500">Found in your AdSense account under Account → Account information.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="belowConverter" className="block text-sm font-medium text-zinc-700">
            Ad slot — below converter
          </label>
          <input
            id="belowConverter"
            type="text"
            placeholder="1234567890"
            value={belowConverter}
            onChange={(e) => setBelowConverter(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm font-mono focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div>
          <label htmlFor="belowContent" className="block text-sm font-medium text-zinc-700">
            Ad slot — below page content
          </label>
          <input
            id="belowContent"
            type="text"
            placeholder="1234567890"
            value={belowContent}
            onChange={(e) => setBelowContent(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm font-mono focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>
      <p className="text-xs text-zinc-500">
        Leave a slot blank to skip that placement. Each ad unit ID comes from AdSense → Ads → By ad unit.
      </p>

      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <FiAlertCircle aria-hidden className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary" disabled={status === "saving"}>
          {status === "saving" && <FiLoader aria-hidden className="animate-spin" />}
          {status === "saving" ? "Saving…" : "Save changes"}
        </Button>
        {status === "saved" && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-700">
            <FiCheckCircle aria-hidden /> Saved
          </span>
        )}
      </div>
    </form>
  );
}
