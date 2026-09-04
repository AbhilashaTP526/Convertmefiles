import { getSiteSettings } from "@/lib/admin/settings";
import { AdSlot } from "@/components/ads/ad-slot";

type SlotKey = "belowConverter" | "belowContent";

/**
 * Server-rendered placement wrapper. Templates render this unconditionally;
 * it renders nothing until AdSense is enabled and configured in /admin, so
 * turning ads on is a settings change, not a code change.
 */
export async function AdPlacement({ slotKey }: { slotKey: SlotKey }) {
  const settings = await getSiteSettings();
  const slotId = settings.adsense.slots[slotKey];

  if (!settings.adsense.enabled || !settings.adsense.clientId || !slotId) return null;

  return (
    <div className="my-6 flex justify-center overflow-hidden" aria-label="Advertisement">
      <AdSlot clientId={settings.adsense.clientId} slot={slotId} />
    </div>
  );
}
