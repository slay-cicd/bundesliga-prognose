"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// ─── Pixel ID ───────────────────────────────────────────────────────────────
// Concorde pixel (created 2026-04-20). If you ever rotate it, update here and
// on the Vercel env (NEXT_PUBLIC_META_PIXEL_ID takes precedence when set).
const DEFAULT_PIXEL_ID = "3434599673354714";

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || DEFAULT_PIXEL_ID;

// Minimal type stub for fbq global (no `any`).
type FbqFn = {
  (...args: unknown[]): void;
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
  callMethod?: (...args: unknown[]) => void;
  push?: (...args: unknown[]) => void;
};
declare global {
  interface Window {
    fbq?: FbqFn;
    _fbq?: FbqFn;
  }
}

/** Safe wrapper around fbq — no-op if pixel is not loaded yet. */
export function fbq(...args: unknown[]) {
  if (typeof window === "undefined") return;
  if (typeof window.fbq === "function") {
    window.fbq(...args);
  }
}

/** Named event helper. Prefer specific named helpers below. */
export function track(eventName: string, params?: Record<string, unknown>) {
  fbq("track", eventName, params ?? {});
}

/** Custom (non-standard) event helper. */
export function trackCustom(eventName: string, params?: Record<string, unknown>) {
  fbq("trackCustom", eventName, params ?? {});
}

/**
 * Standard-event helpers. These map to Meta's standard events so ad delivery
 * optimisation actually works out of the box.
 */
export const Events = {
  pageView: () => track("PageView"),
  viewContent: (params?: Record<string, unknown>) => track("ViewContent", params),
  lead: (params?: Record<string, unknown>) => track("Lead", params),
  completeRegistration: (params?: Record<string, unknown>) =>
    track("CompleteRegistration", params),
};

/**
 * Injects the Meta Pixel base script + auto-fires PageView on every client
 * route transition (Next.js App Router doesn't reload on nav, so we track
 * manually). Safe to mount once at the root layout.
 */
export function MetaPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Fire PageView on every route change after the pixel script has loaded.
    // The initial PageView is already fired by the inline init script.
    Events.pageView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams?.toString()]);

  return (
    <>
      <Script
        id="meta-pixel-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
          `.trim(),
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
