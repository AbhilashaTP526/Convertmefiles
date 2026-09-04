"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics/track";

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackEvent({ event: "page_view", path: pathname });
  }, [pathname]);

  return null;
}
