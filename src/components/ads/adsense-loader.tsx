import Script from "next/script";
import { getSiteSettings } from "@/lib/admin/settings";

/** Renders the AdSense loader script site-wide, but only once AdSense is actually enabled in /admin. */
export async function AdSenseLoader() {
  const settings = await getSiteSettings();
  if (!settings.adsense.enabled || !settings.adsense.clientId) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${settings.adsense.clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
