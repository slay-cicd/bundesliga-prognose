"use client";

import { useEffect } from "react";
import { trackEvent } from "./MetaPixel";

export default function InquirePixelEvents() {
  useEffect(() => {
    // Fire ViewContent on /inquire load. trackEvent is queue-safe: if fbq isn't
    // ready yet, it queues and flushes once the pixel script loads.
    trackEvent("ViewContent", {
      content_name: "Born Inquire Funnel",
      content_category: "lead_funnel",
    });
  }, []);

  return null;
}
