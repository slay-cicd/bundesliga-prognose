import { NextResponse } from "next/server";
import { createHash } from "node:crypto";

/**
 * /api/inquire — captures the funnel, writes leads to Google Sheet,
 * and fires Meta Conversions API (server-side) for resilient attribution.
 *
 * Persistence:
 *   Primary: append to the "Born — Leads" Google Sheet via Sheets API v4,
 *   using an OAuth refresh token (provisioned for jochen@born.com).
 *   The refresh token + client credentials are stored in Vercel env:
 *     SHEETS_REFRESH_TOKEN, SHEETS_CLIENT_ID, SHEETS_CLIENT_SECRET, SHEETS_ID
 *
 *   Fallback: console.log a structured BORN_LEAD line so we can recover
 *   from Vercel logs if the Sheets call fails (e.g. quota, network).
 *
 * Meta CAPI (added 2026-05-20):
 *   Client-side fbq frequently loses events in Facebook/Instagram in-app
 *   browsers (which is ~100% of our paid traffic). We mirror the Lead event
 *   server-side with hashed PII + fbp/fbc cookies for dedup, so Meta sees
 *   conversions even when ITP/iframe restrictions block the pixel.
 *   Required env: META_CAPI_TOKEN  (generate in Events Manager → Pixel
 *   3540406136097473 → Settings → Conversions API → Generate access token)
 *   Optional env: META_PIXEL_ID (defaults to 3540406136097473)
 *                 META_TEST_EVENT_CODE (for Test Events tab during QA)
 *
 * Idempotent: dedup happens in Sheets API by checking column B (Lead ID)
 * before append. If the same id is sent twice, we no-op.
 */

const SHEET_ID = process.env.SHEETS_ID || "1U8jMCEnz5u9lvQdt8wYpXk0dD9la7_KGSiYAodTpAKU";
const TAB = "Leads";

async function mintAccessToken(): Promise<string | null> {
  const cid = process.env.SHEETS_CLIENT_ID;
  const csec = process.env.SHEETS_CLIENT_SECRET;
  const rt = process.env.SHEETS_REFRESH_TOKEN;
  if (!cid || !csec || !rt) return null;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: cid,
      client_secret: csec,
      refresh_token: rt,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) {
    console.error("SHEETS token mint failed", res.status, await res.text());
    return null;
  }
  const j = (await res.json()) as { access_token?: string };
  return j.access_token ?? null;
}

async function isDuplicate(at: string, id: string): Promise<boolean> {
  // Read column B (Lead IDs) and see if id is already present
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${TAB}!B:B`,
    { headers: { Authorization: `Bearer ${at}` } }
  );
  if (!res.ok) return false; // fail open — better to risk dup than skip
  const j = (await res.json()) as { values?: string[][] };
  const rows = j.values ?? [];
  for (let i = 1; i < rows.length; i++) {
    if ((rows[i]?.[0] || "") === id) return true;
  }
  return false;
}

async function appendToSheet(at: string, row: string[]): Promise<boolean> {
  // Bug fix (2026-05-20): Sheets API `values:append` finds the "table" near
  // the given range. Anchoring on "A1:V1" or "A:V" let the API auto-detect
  // table boundaries that included previously-misplaced rows, causing every
  // new write to drift further right (A → T → AB → AJ...).
  //
  // Fix: anchor on just "A1" — single-cell range guarantees the table is
  // detected from column A only, so new rows always land in A:V properly.
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${TAB}!A1:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${at}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [row] }),
    }
  );
  if (!res.ok) {
    console.error("SHEETS append failed", res.status, await res.text());
    return false;
  }
  return true;
}

function parseUtms(ref: string): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    const u = new URL(ref);
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((k) => {
      const v = u.searchParams.get(k);
      if (v) out[k] = v;
    });
  } catch {
    // ignore
  }
  return out;
}

function sha256(s: string): string {
  return createHash("sha256").update(s.trim().toLowerCase()).digest("hex");
}

function parseCookie(header: string | null, name: string): string | undefined {
  if (!header) return undefined;
  const m = header.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return m?.[1];
}

/**
 * Fire Meta CAPI Lead event. Best-effort — do not block the response.
 * Uses event_id = lead id for client/server dedup.
 */
async function sendCapiLead(opts: {
  eventId: string;
  email?: string;
  phone?: string;
  firstName?: string;
  ip?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  sourceUrl?: string;
  customData?: Record<string, unknown>;
}): Promise<void> {
  const pixelId = process.env.META_PIXEL_ID || "3540406136097473";
  const token = process.env.META_CAPI_TOKEN;
  if (!token) {
    console.warn("META_CAPI_TOKEN missing — skipping CAPI Lead");
    return;
  }

  const userData: Record<string, unknown> = {};
  if (opts.email) userData.em = [sha256(opts.email)];
  if (opts.phone) {
    const digits = opts.phone.replace(/\D/g, "");
    if (digits) userData.ph = [sha256(digits)];
  }
  if (opts.firstName) userData.fn = [sha256(opts.firstName)];
  if (opts.ip) userData.client_ip_address = opts.ip;
  if (opts.userAgent) userData.client_user_agent = opts.userAgent;
  if (opts.fbp) userData.fbp = opts.fbp;
  if (opts.fbc) userData.fbc = opts.fbc;

  const event = {
    event_name: "Lead",
    event_time: Math.floor(Date.now() / 1000),
    event_id: opts.eventId,
    action_source: "website",
    event_source_url: opts.sourceUrl || "https://carewithborn.com/inquire",
    user_data: userData,
    custom_data: opts.customData || {},
  };

  const payload: Record<string, unknown> = { data: [event] };
  if (process.env.META_TEST_EVENT_CODE) {
    payload.test_event_code = process.env.META_TEST_EVENT_CODE;
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) {
      console.error("META CAPI failed", res.status, await res.text());
    } else {
      const j = await res.json();
      console.log("META CAPI ok", JSON.stringify(j));
    }
  } catch (e) {
    const err = e as Error;
    console.error("META CAPI exception", err?.message || err);
  }
}

/**
 * Slack notification for new leads. Posts to the Born team channel (or DM).
 * Required env: SLACK_BOT_TOKEN, SLACK_LEAD_CHANNEL
 * Best-effort — never blocks the user response.
 */
async function notifySlackNewLead(lead: {
  id: string;
  name: string;
  email: string;
  phone: string;
  timeline: string;
  relation: string;
  services: string;
  region: string;
  referer: string;
}): Promise<void> {
  const token = process.env.SLACK_BOT_TOKEN;
  const channel = process.env.SLACK_LEAD_CHANNEL;
  if (!token || !channel) {
    console.warn("SLACK_BOT_TOKEN or SLACK_LEAD_CHANNEL missing — skipping Slack notify");
    return;
  }

  // Parse UTMs from referer for attribution
  let utmCampaign = "";
  let utmContent = "";
  try {
    const u = new URL(lead.referer);
    utmCampaign = u.searchParams.get("utm_campaign") || "";
    utmContent = u.searchParams.get("utm_content") || "";
  } catch {
    // no referer / not parseable
  }

  const TIMELINE_LABELS: Record<string, string> = {
    now: "⏱ NOW (within month)",
    soon: "📅 This quarter",
    year: "📆 This year",
    future: "🔎 Just exploring",
  };
  const RELATION_LABELS: Record<string, string> = {
    self: "self",
    parent: "for parent",
    spouse: "for spouse",
    other: "for family",
    advisor: "as advisor",
  };

  const lines = [
    `*🌱 New Born lead* — ${lead.name}`,
    `• 📧 ${lead.email}${lead.phone ? `  • 📞 ${lead.phone}` : ""}`,
    `• ${TIMELINE_LABELS[lead.timeline] || lead.timeline} • ${RELATION_LABELS[lead.relation] || lead.relation} • ${lead.services || "—"}`,
    `• 📍 ${lead.region || "—"}`,
  ];
  if (utmCampaign || utmContent) {
    lines.push(`• *Source:* ${utmCampaign}${utmContent ? ` / ${utmContent}` : ""}`);
  }
  lines.push(`<https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?gid=0|Open in sheet →>`);

  try {
    const res = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        channel,
        text: lines.join("\n"),
        unfurl_links: false,
      }),
    });
    if (!res.ok) {
      console.error("Slack notify HTTP failed", res.status, await res.text());
      return;
    }
    const j = (await res.json()) as { ok: boolean; error?: string };
    if (!j.ok) {
      console.error("Slack notify error", j.error);
    } else {
      console.log("Slack notify ok", lead.id);
    }
  } catch (e) {
    const err = e as Error;
    console.error("Slack notify exception", err?.message || err);
  }
}

export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  const userAgent = req.headers.get("user-agent") || "";
  const referer = req.headers.get("referer") || "";
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "";
  const cookieHeader = req.headers.get("cookie");
  const fbp = parseCookie(cookieHeader, "_fbp");
  const fbc = parseCookie(cookieHeader, "_fbc");

  const entry = {
    id,
    receivedAt: new Date().toISOString(),
    userAgent,
    referer,
    ip,
    ...body,
  } as Record<string, unknown>;

  // 1. Always log (safety net + future analytics)
  console.log("BORN_LEAD " + JSON.stringify(entry));

  // 2. Write to Google Sheet — best effort, don't block on failure
  try {
    const at = await mintAccessToken();
    if (at) {
      const dup = await isDuplicate(at, id);
      if (!dup) {
        const services = Array.isArray(body.services)
          ? (body.services as string[]).join(", ")
          : String(body.services || "");
        const loc = (body.location as { city?: string; zip?: string }) || {};
        const contact = (body.contact as { name?: string; email?: string; phone?: string }) || {};
        const utms = parseUtms(referer);

        const row = [
          String(entry.receivedAt),
          id,
          String(body.source || utms.utm_source || ""),
          String(utms.utm_campaign || ""),
          String(utms.utm_content || ""),
          String(contact.name || ""),
          String(contact.email || ""),
          String(contact.phone || ""),
          String(body.timeline || ""),
          String(body.relation || ""),
          services,
          String(body.region || ""),
          String(loc.city || ""),
          String(loc.zip || ""),
          String(body.careStage || ""),
          String(body.household || ""),
          String(body.currentCare || ""),
          String(body.budget || ""),
          String(body.notes || ""),
          userAgent.substring(0, 200),
          referer.substring(0, 200),
          ip,
        ];
        await appendToSheet(at, row);
      }
    } else {
      console.warn("SHEETS env vars missing — skipped Sheets write");
    }
  } catch (e) {
    const err = e as Error;
    console.error("SHEETS write exception", err?.message || err);
  }

  // 3. Meta CAPI — only for the primary inquiry submit (kind != deeper_context)
  //    The deeper_context update doesn't represent a new Lead conversion.
  if (body.kind !== "deeper_context") {
    const contact = (body.contact as { name?: string; email?: string; phone?: string }) || {};
    const services = Array.isArray(body.services)
      ? (body.services as string[]).join(",")
      : String(body.services || "");
    const firstName = (contact.name || "").split(/\s+/)[0];

    // Fire-and-forget so we don't slow down the user response
    sendCapiLead({
      eventId: id,
      email: contact.email,
      phone: contact.phone,
      firstName,
      ip,
      userAgent,
      fbp,
      fbc,
      sourceUrl: referer || "https://carewithborn.com/inquire",
      customData: {
        content_name: "Born Inquiry",
        content_category: services,
        timeline: String(body.timeline || ""),
        relation: String(body.relation || ""),
        region: String(body.region || ""),
      },
    }).catch((e) => console.error("CAPI fire-and-forget rejected", e));

    // 4. Slack notification — ping the team when a new lead lands.
    //    Skips test/healthcheck emails to keep the channel clean.
    const email = (contact.email || "").toLowerCase();
    const name = (contact.name || "").toLowerCase();
    const isTest =
      email.includes("noreply") ||
      email.includes("healthcheck") ||
      email.includes("capi-") ||
      email.includes("pixel-test") ||
      email.includes("verify") ||
      email.endsWith("@example.com") ||
      email.endsWith("@born-leads.test") ||
      email.endsWith("@bornverify.zzz") ||
      email.endsWith("@bornlongtest.zzz") ||
      email.endsWith("@borntestnotreal.test") ||
      email.endsWith(".test") ||
      name.startsWith("test ") ||
      name.includes("e2e") ||
      name.includes("debug") ||
      name.includes("healthcheck") ||
      name.includes("sheet fix") ||
      name.includes("sheet trace") ||
      name.includes("sheet debug");
    if (!isTest) {
      notifySlackNewLead({
        id,
        name: contact.name || "(no name)",
        email: contact.email || "(no email)",
        phone: contact.phone || "",
        timeline: String(body.timeline || ""),
        relation: String(body.relation || ""),
        services,
        region: String(body.region || ""),
        referer,
      }).catch((e) => console.error("Slack notify failed", e));
    }
  }

  return NextResponse.json({ ok: true, id });
}
