"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initMixpanel, mpTrack } from "@/lib/mixpanel";

/**
 * Mounts Mixpanel once at the root and fires a Page Viewed event on every
 * Next.js App Router navigation (no full reload → we track manually). Designed
 * to be dropped into app/layout.tsx inside a <Suspense> boundary because we
 * use useSearchParams.
 */
export function MixpanelProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // One-shot init (first mount only — lib guards against double-init).
  useEffect(() => {
    initMixpanel();
  }, []);

  // Fire Page Viewed on every route or query change.
  useEffect(() => {
    const qs = searchParams?.toString();
    mpTrack("Page Viewed", {
      path: pathname,
      url: typeof window !== "undefined" ? window.location.href : pathname,
      query: qs || undefined,
      referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
    });
  }, [pathname, searchParams]);

  return null;
}
