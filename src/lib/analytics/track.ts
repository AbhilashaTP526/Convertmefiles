export type TrackEvent =
  | { event: "page_view"; path: string }
  | { event: "conversion_started"; slug: string }
  | { event: "conversion_completed"; slug: string }
  | { event: "conversion_failed"; slug: string };

/**
 * Fire-and-forget aggregate event tracking. Never throws, never blocks the
 * UI — analytics must not be able to break the converter experience.
 */
export function trackEvent(payload: TrackEvent): void {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      return;
    }
    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Analytics must never break the app.
  }
}
