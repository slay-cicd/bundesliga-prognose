"use client";

import mixpanel from "mixpanel-browser";

// ─── Project token ──────────────────────────────────────────────────────────
// Default falls back to the Atlas project so events flow into a single
// workspace until Fabian creates a dedicated Concorde project. Switch by
// setting NEXT_PUBLIC_MIXPANEL_TOKEN on Vercel.
// All events are tagged with `product: "concorde"` as a super property so the
// Atlas workspace can filter cleanly if sharing.
const DEFAULT_TOKEN = "1e4c480d84cd0fd22031ffc141447183";
const TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || DEFAULT_TOKEN;

let initialized = false;

export function initMixpanel() {
  if (initialized) return;
  if (typeof window === "undefined") return;

  try {
    mixpanel.init(TOKEN, {
      autocapture: true,             // clicks, form submits, page changes
      record_sessions_percent: 100,  // Session Replay on 100% (dial down later)
      api_host: "https://api-eu.mixpanel.com",
      debug: false,
      persistence: "localStorage",
      ignore_dnt: false,
    });

    mixpanel.register({
      product: "concorde",
      platform: "web",
      domain: "concordemarket.de",
      app_version: "1.0",
    });

    initialized = true;
  } catch (e) {
    console.error("Mixpanel init error:", e);
  }
}

export function mpTrack(event: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!initialized) initMixpanel();
  try {
    mixpanel.track(event, properties ?? {});
  } catch (e) {
    console.error("Mixpanel track error:", e);
  }
}

export function mpIdentify(id: string) {
  if (typeof window === "undefined") return;
  if (!initialized) initMixpanel();
  try {
    mixpanel.identify(id);
  } catch (e) {
    console.error("Mixpanel identify error:", e);
  }
}

export function mpSetProfile(properties: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!initialized) initMixpanel();
  try {
    mixpanel.people.set(properties);
  } catch (e) {
    console.error("Mixpanel people.set error:", e);
  }
}

export function mpSetFunnelVariant(variant: "funnel" | "funnel1" | "direct" | "registrierung") {
  if (typeof window === "undefined") return;
  if (!initialized) initMixpanel();
  try {
    mixpanel.register({ funnel_variant: variant });
  } catch (e) {
    console.error("Mixpanel register variant error:", e);
  }
}

export function mpRegisterSuper(properties: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!initialized) initMixpanel();
  try {
    mixpanel.register(properties);
  } catch (e) {
    console.error("Mixpanel register super error:", e);
  }
}

export function mpReset() {
  if (typeof window === "undefined") return;
  if (!initialized) return;
  try {
    mixpanel.reset();
  } catch (e) {
    console.error("Mixpanel reset error:", e);
  }
}
