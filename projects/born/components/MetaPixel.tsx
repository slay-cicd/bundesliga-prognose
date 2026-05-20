"use client";

/**
 * MetaPixel — Born
 *
 * Pattern adapted from Concorde (see memory/2026-04-20.md):
 * - next/script afterInteractive for non-blocking load
 * - Polls for fbq availability before firing (fix: poll for fbq)
 * - Queues calls when script loads late (fix: queue fbq calls when script loads late)
 * - Fires PageView on every pathname/searchParams change (App Router doesn't auto-fire)
 * - Wrap with <Suspense fallback={null}> at call site (useSearchParams requirement)
 */

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || "3540406136097473";

type FbqFn = (...args: unknown[]) => void;

// Augment window with optional fbq
declare global {
  interface Window {
    fbq?: FbqFn & {
      callMethod?: FbqFn;
      queue: unknown[][];
      loaded?: boolean;
      version?: string;
      push?: FbqFn;
    };
    _fbq?: Window["fbq"];
  }
}

// Queue for calls made before fbq is ready
const fbqQueue: Array<() => void> = [];
let fbqReady = false;

function hasFbq(): boolean {
  return typeof window !== "undefined" && typeof window.fbq === "function";
}

/**
 * Safe fbq call: queues if fbq not yet available, fires immediately if it is.
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  const fire = () => {
    if (hasFbq()) {
      if (params) {
        window.fbq!("track", eventName, params);
      } else {
        window.fbq!("track", eventName);
      }
    }
  };

  if (fbqReady && hasFbq()) {
    fire();
  } else {
    fbqQueue.push(fire);
  }
}

/** Flush queued calls once fbq is confirmed available */
function flushQueue() {
  fbqReady = true;
  while (fbqQueue.length > 0) {
    const fn = fbqQueue.shift();
    fn?.();
  }
}

/**
 * Poll for fbq availability and flush queued calls.
 *
 * Bug fix (2026-05-20): previously this only ran from <Script onLoad> which is
 * unreliable in production builds (sometimes never fires for afterInteractive
 * scripts when the script tag is inlined). Now we ALSO start the poll from a
 * client-side effect, so the queue always gets flushed even if onLoad never fires.
 *
 * Symptom of the bug: only PageView fired (from the inline init script directly
 * calling fbq). All other events (ViewContent on /inquire, Lead on submit,
 * Schedule, CompleteRegistration) were silently queued forever — Meta saw 0
 * conversions despite real leads coming in.
 */
function pollForFbq(attempt = 0) {
  if (fbqReady) return;
  if (hasFbq()) {
    flushQueue();
    return;
  }
  if (attempt < 30) {
    // ~7s total: 100ms * 1.15^30 ≈ caps at ~1500ms per attempt
    setTimeout(() => pollForFbq(attempt + 1), Math.min(100 * Math.pow(1.15, attempt), 1500));
  }
}

export function MetaPixelEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Belt + braces: kick the poll on mount in case <Script onLoad> never fires.
  useEffect(() => {
    pollForFbq();
  }, []);

  useEffect(() => {
    const fire = () => {
      if (hasFbq()) {
        window.fbq!("track", "PageView");
      }
    };

    if (fbqReady && hasFbq()) {
      fire();
    } else {
      fbqQueue.push(fire);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return null;
}

export default function MetaPixel() {
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
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');
`,
        }}
        onLoad={() => pollForFbq()}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      <MetaPixelEvents />
    </>
  );
}
