"use client";

import { useEffect } from "react";
import { mpTrack } from "@/lib/mixpanel";

/**
 * Global click delegate: any element with `data-event="..."` anywhere in the
 * tree (typically CTA buttons and links) triggers a Mixpanel event with that
 * name. Additional `data-*` attributes are attached as properties so we can
 * tag the CTA (e.g. `data-location="hero"`).
 *
 * Intentionally uses a single capture-phase listener so we don't have to touch
 * every CTA component.
 */
export function EventDelegate() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const handler = (evt: MouseEvent) => {
      const path = evt.composedPath?.() ?? [];
      for (const node of path) {
        if (!(node instanceof HTMLElement)) continue;
        const name = node.dataset?.event;
        if (!name) continue;
        const props: Record<string, unknown> = {
          href: (node as HTMLAnchorElement).href || undefined,
          text: (node.textContent || "").trim().slice(0, 120) || undefined,
        };
        // Copy any other data-* attributes (data-location, data-variant, …)
        for (const key of Object.keys(node.dataset || {})) {
          if (key === "event") continue;
          props[key] = node.dataset[key];
        }
        mpTrack(name, props);
        return;
      }
    };
    document.addEventListener("click", handler, { capture: true });
    return () => document.removeEventListener("click", handler, { capture: true });
  }, []);

  return null;
}
