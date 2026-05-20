import { NextResponse } from "next/server";

/**
 * Daily UA performance + lead pipeline summary.
 *
 * Runs via Vercel Cron at 06:00 UTC = 08:00 CET (07:00 CET in winter).
 * Posts to Slack channel #customer-elderlycare (C0B4ANQN4BH).
 *
 * Required env:
 *   SLACK_BOT_TOKEN, SLACK_LEAD_CHANNEL (or SLACK_DAILY_CHANNEL override)
 *   META_ACCESS_TOKEN (system user token with ads_read on Borndotcom)
 *   SHEETS_CLIENT_ID, SHEETS_CLIENT_SECRET, SHEETS_REFRESH_TOKEN, SHEETS_ID
 *   CRON_SECRET (Vercel auto-sets this; we require Bearer auth)
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BORN_ACCOUNT_ID = "act_1677061273614166";
const SHEET_ID = process.env.SHEETS_ID || "1U8jMCEnz5u9lvQdt8wYpXk0dD9la7_KGSiYAodTpAKU";

type CampaignInsight = {
  campaign_id: string;
  campaign_name: string;
  status?: string;
  impressions?: string;
  clicks?: string;
  spend?: string;
  ctr?: string;
  cpc?: string;
  cpm?: string;
  actions?: { action_type: string; value: string }[];
};

async function mintSheetsToken(): Promise<string | null> {
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
  if (!res.ok) return null;
  const j = (await res.json()) as { access_token?: string };
  return j.access_token ?? null;
}

async function fetchLeadStats(at: string): Promise<{
  total: number;
  yesterday: number;
  today: number;
  recentNames: string[];
}> {
  // Pull all leads (col A = timestamp, col F = name)
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Leads!A:F`,
    { headers: { Authorization: `Bearer ${at}` } }
  );
  if (!res.ok) return { total: 0, yesterday: 0, today: 0, recentNames: [] };
  const j = (await res.json()) as { values?: string[][] };
  const rows = j.values ?? [];

  // Compute "today" and "yesterday" in CET. Sheet stores ISO UTC timestamps.
  // We treat "yesterday" as the previous CET calendar day (the day the report is about).
  const now = new Date();
  const cetOffset = isCESTActive(now) ? 2 : 1; // hours
  const cetNow = new Date(now.getTime() + cetOffset * 3600 * 1000);
  const todayCetYmd = cetNow.toISOString().slice(0, 10);
  const yesterdayDate = new Date(cetNow);
  yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1);
  const yesterdayCetYmd = yesterdayDate.toISOString().slice(0, 10);

  let yesterdayCount = 0;
  let todayCount = 0;
  const recentNames: string[] = [];

  for (const row of rows) {
    const ts = (row[0] || "").trim();
    if (!ts) continue;
    const name = (row[5] || "").trim();
    // Convert UTC timestamp to CET date
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) continue;
    const cetD = new Date(d.getTime() + cetOffset * 3600 * 1000);
    const cetYmd = cetD.toISOString().slice(0, 10);
    if (cetYmd === yesterdayCetYmd) {
      yesterdayCount++;
      if (name) recentNames.push(name);
    } else if (cetYmd === todayCetYmd) {
      todayCount++;
    }
  }

  return {
    total: rows.length,
    yesterday: yesterdayCount,
    today: todayCount,
    recentNames: recentNames.slice(0, 8),
  };
}

function isCESTActive(d: Date): boolean {
  // CEST runs last Sun of March through last Sun of October.
  const year = d.getUTCFullYear();
  const lastSunMar = new Date(Date.UTC(year, 2, 31));
  lastSunMar.setUTCDate(31 - lastSunMar.getUTCDay());
  const lastSunOct = new Date(Date.UTC(year, 9, 31));
  lastSunOct.setUTCDate(31 - lastSunOct.getUTCDay());
  return d >= lastSunMar && d < lastSunOct;
}

async function fetchCampaignPerformance(
  datePreset: "yesterday" | "today"
): Promise<CampaignInsight[]> {
  const token = process.env.META_ACCESS_TOKEN;
  if (!token) return [];

  const url = new URL(`https://graph.facebook.com/v21.0/${BORN_ACCOUNT_ID}/insights`);
  url.searchParams.set("level", "campaign");
  url.searchParams.set("date_preset", datePreset);
  url.searchParams.set(
    "fields",
    "campaign_id,campaign_name,impressions,clicks,spend,ctr,cpc,cpm,actions"
  );
  url.searchParams.set("limit", "25");
  url.searchParams.set("access_token", token);

  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      console.error("Meta insights fetch failed", res.status, await res.text());
      return [];
    }
    const j = (await res.json()) as { data?: CampaignInsight[] };
    return j.data ?? [];
  } catch (e) {
    console.error("Meta insights exception", (e as Error).message);
    return [];
  }
}

function findAction(actions: CampaignInsight["actions"], type: string): number {
  if (!actions) return 0;
  const a = actions.find((x) => x.action_type === type);
  return a ? Number(a.value) || 0 : 0;
}

function eur(n: number): string {
  return `€${n.toFixed(2)}`;
}

function pct(n: number): string {
  return `${n.toFixed(2)}%`;
}

async function postSlack(text: string): Promise<void> {
  const token = process.env.SLACK_BOT_TOKEN;
  const channel = process.env.SLACK_DAILY_CHANNEL || process.env.SLACK_LEAD_CHANNEL;
  if (!token || !channel) {
    console.warn("Slack env missing — skipping daily post");
    return;
  }
  const res = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ channel, text, unfurl_links: false }),
  });
  if (!res.ok) {
    console.error("Slack daily post HTTP failed", res.status, await res.text());
    return;
  }
  const j = (await res.json()) as { ok: boolean; error?: string };
  if (!j.ok) console.error("Slack daily post error", j.error);
  else console.log("Slack daily post ok");
}

export async function GET(req: Request) {
  // Auth: Vercel Cron sends "Authorization: Bearer ${CRON_SECRET}"
  // Allow manual invocation if a debug header is set (for testing)
  const auth = req.headers.get("authorization") || "";
  const debug = req.headers.get("x-debug-key") || "";
  const cronSecret = process.env.CRON_SECRET;
  const debugKey = process.env.CRON_DEBUG_KEY;

  const authedAsCron = cronSecret && auth === `Bearer ${cronSecret}`;
  const authedAsDebug = debugKey && debug === debugKey;

  if (!authedAsCron && !authedAsDebug) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  // 1. Lead stats
  const sheetsAt = await mintSheetsToken();
  const leadStats = sheetsAt
    ? await fetchLeadStats(sheetsAt)
    : { total: 0, yesterday: 0, today: 0, recentNames: [] };

  // 2. Campaign performance — yesterday's full data
  const insights = await fetchCampaignPerformance("yesterday");

  // Aggregate active campaigns + per-campaign breakdown
  const bornCold = insights.find((c) => c.campaign_name.toLowerCase().includes("born | cold"));
  const hearth = insights.find((c) => c.campaign_name.toLowerCase().includes("hearth"));

  const totalSpend = insights.reduce((acc, c) => acc + Number(c.spend || 0), 0);
  const totalClicks = insights.reduce((acc, c) => acc + Number(c.clicks || 0), 0);
  const totalImpressions = insights.reduce((acc, c) => acc + Number(c.impressions || 0), 0);
  const totalLeads = insights.reduce(
    (acc, c) => acc + findAction(c.actions, "offsite_conversion.fb_pixel_lead"),
    0
  );
  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const avgCpc = totalClicks > 0 ? totalSpend / totalClicks : 0;
  const cpl = totalLeads > 0 ? totalSpend / totalLeads : 0;
  const sheetCpl = leadStats.yesterday > 0 ? totalSpend / leadStats.yesterday : 0;

  // 3. Build message
  const yesterdayLabel = new Date(Date.now() - 24 * 3600 * 1000).toISOString().slice(0, 10);

  const lines: string[] = [];
  lines.push(`*🌅 Born — Daily Update* · ${yesterdayLabel}`);
  lines.push("");
  lines.push(`*📊 UA Performance (gestern, alle aktiven Campaigns)*`);
  lines.push(
    `• Spend: *${eur(totalSpend)}* · Impressions: *${totalImpressions.toLocaleString("de-DE")}* · Clicks: *${totalClicks.toLocaleString("de-DE")}*`
  );
  lines.push(
    `• CTR: *${pct(avgCtr)}* · CPC: *${eur(avgCpc)}* · Pixel-Leads: *${totalLeads}* (CPL ${cpl > 0 ? eur(cpl) : "—"})`
  );
  lines.push(
    `• Sheet-Leads (gestern): *${leadStats.yesterday}* (echte CPL ${sheetCpl > 0 ? eur(sheetCpl) : "—"})`
  );
  lines.push("");

  // Per-campaign block
  if (bornCold || hearth) {
    lines.push(`*Per Campaign*`);
    for (const c of [bornCold, hearth].filter(Boolean) as CampaignInsight[]) {
      const sp = Number(c.spend || 0);
      const cl = Number(c.clicks || 0);
      const im = Number(c.impressions || 0);
      const leads = findAction(c.actions, "offsite_conversion.fb_pixel_lead");
      const cplCamp = leads > 0 ? sp / leads : 0;
      const ctrCamp = im > 0 ? (cl / im) * 100 : 0;
      lines.push(
        `• *${c.campaign_name}* — ${eur(sp)} · ${pct(ctrCamp)} CTR · ${eur(Number(c.cpm || 0))} CPM · ${leads} Lead${leads === 1 ? "" : "s"}${leads > 0 ? ` (${eur(cplCamp)} CPL)` : ""}`
      );
    }
    lines.push("");
  }

  // Lead pipeline summary
  lines.push(`*📋 Lead Pipeline*`);
  lines.push(`• Total im Sheet: *${leadStats.total}* · Gestern: *${leadStats.yesterday}* · Heute (bisher): *${leadStats.today}*`);
  if (leadStats.recentNames.length > 0) {
    lines.push(`• Namen gestern: ${leadStats.recentNames.join(", ")}`);
  }
  lines.push("");
  lines.push(
    `<https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?gid=0|Lead-Sheet öffnen →>`
  );

  await postSlack(lines.join("\n"));

  return NextResponse.json({
    ok: true,
    yesterday: yesterdayLabel,
    totalSpend,
    totalLeads,
    sheetLeadsYesterday: leadStats.yesterday,
    sheetLeadsTotal: leadStats.total,
  });
}
