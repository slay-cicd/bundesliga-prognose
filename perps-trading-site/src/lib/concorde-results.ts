/**
 * Concorde Results aggregator.
 *
 * Reads the live Questionnaire tab from the Concorde Google Sheet, computes
 * aggregated metrics + section breakdowns, and rewrites the Results tab.
 *
 * Triggered:
 *   - automatically by /api/questionnaire after every successful submit
 *   - manually via `npx tsx scripts/rebuild-results.ts`
 */

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID || "";
const SA_B64 = process.env.GOOGLE_SERVICE_ACCOUNT_B64 || "";

interface ServiceAccount {
  client_email: string;
  private_key: string;
  token_uri: string;
}

function getServiceAccount(): ServiceAccount {
  const json = Buffer.from(SA_B64, "base64").toString("utf-8");
  return JSON.parse(json);
}

async function createJWT(sa: ServiceAccount): Promise<string> {
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: sa.token_uri,
    iat: now,
    exp: now + 3600,
  };

  const enc = (obj: unknown) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");

  const unsigned = `${enc(header)}.${enc(payload)}`;

  const crypto = await import("crypto");
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(unsigned);
  const signature = sign.sign(sa.private_key, "base64url");

  return `${unsigned}.${signature}`;
}

async function getAccessToken(): Promise<string> {
  const sa = getServiceAccount();
  const jwt = await createJWT(sa);

  const res = await fetch(sa.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const data = await res.json();
  if (!data.access_token) throw new Error("Failed to get access token");
  return data.access_token;
}

/* ─── Column mapping (matches /api/questionnaire row layout) ─── */
// A Email | B Timestamp | C q1 | D q2 | E q3 | F q4 | G q5 | H q6 |
// I q7 | J q8 | K q9 | L q10 | M q11 | N q12 | O q13 | P q14 |
// Q q16 (Liquidation) | R q15 (Offshore) | S q17 (Dream-Feature)

const COLS = {
  email: 0,
  ts: 1,
  q1: 2,
  q2: 3,
  q3: 4,
  q4: 5,
  q5: 6,
  q6: 7,
  q7: 8,
  q8: 9,
  q9: 10,
  q10: 11,
  q11: 12,
  q12: 13,
  q13: 14,
  q14: 15,
  q16: 16,
  q15: 17,
  q17: 18,
};

const SECTIONS: { col: number; emoji: string; title: string; multi: boolean }[] = [
  { col: COLS.q1, emoji: "📊", title: "Trading-Häufigkeit", multi: false },
  { col: COLS.q2, emoji: "💻", title: "Aktuelle Plattformen", multi: true },
  { col: COLS.q3, emoji: "📚", title: "Derivate-Erfahrung", multi: false },
  { col: COLS.q4, emoji: "⚡", title: "Perps-Erfahrung", multi: false },
  { col: COLS.q5, emoji: "✅", title: "Warum Perps? (nur wer Perps nutzt)", multi: true },
  { col: COLS.q6, emoji: "❌", title: "Warum (noch) keine Perps?", multi: true },
  { col: COLS.q7, emoji: "🎯", title: "Gewünschte Asset-Klassen", multi: true },
  { col: COLS.q8, emoji: "💰", title: "Monatliches Trading-Volumen", multi: false },
  { col: COLS.q9, emoji: "🎚️", title: "Max. genutzter Hebel", multi: false },
  { col: COLS.q10, emoji: "😤", title: "Größter Schmerzpunkt (aktuell)", multi: true },
  { col: COLS.q11, emoji: "⭐", title: "Was ist wichtig? (Plattform-Features)", multi: true },
  { col: COLS.q12, emoji: "💳", title: "Bevorzugte Einzahlungsmethode", multi: false },
  { col: COLS.q13, emoji: "🔧", title: "Fehlende Derivate-Features", multi: true },
  { col: COLS.q14, emoji: "🎓", title: "Selbsteinschätzung", multi: false },
  { col: COLS.q16, emoji: "💥", title: "Liquidation-Erfahrung", multi: false },
  { col: COLS.q15, emoji: "🌍", title: "Offshore-Nutzung", multi: true },
];

function splitMulti(value: string): string[] {
  if (!value) return [];
  // Multi answers are stored joined by ", " — but options can themselves
  // contain ", " inside parentheses (e.g. "Krypto (BTC, ETH, SOL, …)").
  // We split safely by tracking parenthesis depth.
  const out: string[] = [];
  let buf = "";
  let depth = 0;
  for (let i = 0; i < value.length; i++) {
    const c = value[i];
    if (c === "(" || c === "[") depth++;
    else if (c === ")" || c === "]") depth = Math.max(0, depth - 1);
    if (c === "," && depth === 0 && value[i + 1] === " ") {
      out.push(buf.trim());
      buf = "";
      i++; // skip the space
    } else {
      buf += c;
    }
  }
  if (buf.trim()) out.push(buf.trim());
  return out.filter((x) => x.length > 0);
}

interface Row {
  email: string;
  ts: string;
  values: string[];
}

function isInternalTestEmail(email: string): boolean {
  const e = (email || "").toLowerCase();
  return (
    e.includes("@born.com") ||
    e.startsWith("e2e-test") ||
    e.startsWith("pixel-warmup") ||
    e.startsWith("funnel1-test") ||
    e === ""
  );
}

interface Aggregation {
  totalSubmissions: number;
  uniqueResponses: number;
  dateMin: string;
  dateMax: string;
  rowsByEmail: Map<string, Row>; // most recent per email (excluding internal)
  sections: {
    title: string;
    emoji: string;
    multi: boolean;
    counts: { option: string; count: number }[];
    mentions: number;
    avg: number;
  }[];
  keyMetrics: {
    handeltPerps: number;
    nutztHebel: number;
    willMehrHebel: number;
    featureLowFees: number;
    painHighFees: number;
    nutztOffshore: number;
  };
  insights: string[];
  dreamFeatures: { email: string; text: string }[];
}

function aggregate(rawRows: string[][]): Aggregation {
  // rawRows includes header row at index 0 — skip it.
  const dataRows = rawRows.slice(1);

  // Filter test emails, keep most-recent submission per email for "unique"
  // but use ALL non-test rows for the section breakdowns (matches the original
  // Results tab semantics where "Mentions" counts every submission).
  const realRows: Row[] = [];
  const rowsByEmail = new Map<string, Row>();
  for (const r of dataRows) {
    const email = (r[COLS.email] || "").trim();
    const ts = r[COLS.ts] || "";
    if (isInternalTestEmail(email)) continue;
    const row: Row = { email, ts, values: r };
    realRows.push(row);
    const prev = rowsByEmail.get(email.toLowerCase());
    if (!prev || (ts && ts > prev.ts)) {
      rowsByEmail.set(email.toLowerCase(), row);
    }
  }

  const totalSubmissions = realRows.length;
  const uniqueResponses = rowsByEmail.size;

  // Date range from real rows
  const timestamps = realRows.map((r) => r.ts).filter((t) => t).sort();
  const dateMin = timestamps[0]?.slice(0, 10) || "";
  const dateMax = timestamps[timestamps.length - 1]?.slice(0, 10) || "";

  // Build sections — count over UNIQUE (most recent per email) responses,
  // matching the existing Results tab where "% of Respondents" is over 58.
  const uniqueRows = Array.from(rowsByEmail.values());

  const sections = SECTIONS.map((s) => {
    const counts = new Map<string, number>();
    for (const row of uniqueRows) {
      const cell = row.values[s.col] || "";
      if (s.multi) {
        for (const opt of splitMulti(cell)) {
          counts.set(opt, (counts.get(opt) || 0) + 1);
        }
      } else {
        const opt = cell.trim();
        if (!opt) continue;
        counts.set(opt, (counts.get(opt) || 0) + 1);
      }
    }
    const sorted = Array.from(counts.entries())
      .map(([option, count]) => ({ option, count }))
      .sort((a, b) => b.count - a.count);
    const mentions = sorted.reduce((sum, x) => sum + x.count, 0);
    const avg = uniqueResponses > 0 ? mentions / uniqueResponses : 0;
    return { title: s.title, emoji: s.emoji, multi: s.multi, counts: sorted, mentions, avg };
  });

  // Key metrics
  const handeltPerps = uniqueRows.filter((r) => {
    const q4 = r.values[COLS.q4] || "";
    return q4.startsWith("Ja");
  }).length;

  const nutztHebel = uniqueRows.filter((r) => {
    const q9 = (r.values[COLS.q9] || "").trim();
    return q9 && q9 !== "Kein Hebel (Spot)";
  }).length;

  const willMehrHebel = uniqueRows.filter((r) => {
    const q13 = r.values[COLS.q13] || "";
    return splitMulti(q13).includes("Höherer Hebel");
  }).length;

  const featureLowFees = uniqueRows.filter((r) => {
    const q11 = r.values[COLS.q11] || "";
    return splitMulti(q11).includes("Niedrige Gebühren");
  }).length;

  const painHighFees = uniqueRows.filter((r) => {
    const q10 = r.values[COLS.q10] || "";
    return splitMulti(q10).includes("Zu hohe Gebühren / Spreads");
  }).length;

  const nutztOffshore = uniqueRows.filter((r) => {
    const q15 = r.values[COLS.q15] || "";
    const opts = splitMulti(q15);
    return opts.some((o) => o.startsWith("Ja"));
  }).length;

  // Insights — derive top 3 in a few categories
  const krypto = uniqueRows.filter((r) =>
    splitMulti(r.values[COLS.q7] || "").some((o) => o.startsWith("Krypto"))
  ).length;
  const painSection = sections.find((s) => s.title.includes("Schmerzpunkt"));
  const wishSection = sections.find((s) => s.title.includes("Fehlende Derivate-Features"));
  const depositSection = sections.find((s) => s.title.includes("Einzahlungsmethode"));
  const offshoreSection = sections.find((s) => s.title.includes("Offshore-Nutzung"));
  const perpsSection = sections.find((s) => s.title.includes("Perps-Erfahrung"));

  const top3 = (sec: typeof sections[number] | undefined) =>
    (sec?.counts || []).slice(0, 3);

  const sepa = depositSection?.counts.find((c) => c.option.startsWith("SEPA"))?.count || 0;
  const paypal = depositSection?.counts.find((c) => c.option === "PayPal")?.count || 0;
  const krypto_dep =
    depositSection?.counts.find((c) => c.option.startsWith("Krypto"))?.count || 0;

  const onlyDe =
    offshoreSection?.counts.find((c) => c.option.startsWith("Nein"))?.count || 0;
  const offshoreCount =
    (offshoreSection?.counts || [])
      .filter((c) => c.option.startsWith("Ja"))
      .reduce((s, c) => s + c.count, 0);
  const binance =
    offshoreSection?.counts.find((c) => c.option === "Ja, Binance")?.count || 0;
  const bybit =
    offshoreSection?.counts.find((c) => c.option === "Ja, Bybit")?.count || 0;

  const noPerpsAware =
    perpsSection?.counts.find((c) => c.option === "Nein, nie davon gehört")?.count || 0;

  const fmtTop3 = (arr: { option: string; count: number }[]) =>
    arr.map((x) => `${x.option} (${x.count})`).join(", ");

  const insights = [
    `Krypto dominiert Asset-Interesse: ${krypto}/${uniqueResponses} wollen Krypto handeln.`,
    `Top 3 Pain Points: ${fmtTop3(top3(painSection).filter((x) => x.option !== "Keine Probleme")).slice(0)}.`,
    `Top 3 Wünsche: ${fmtTop3(top3(wishSection))}.`,
    `SEPA + PayPal dominieren Einzahlung: ${sepa + paypal}/${uniqueResponses} Nennungen. Krypto-Einzahlung ${krypto_dep}.`,
    `DE-Präferenz vs Offshore: ${onlyDe} wollen nur DE-reguliert, ${offshoreCount} nutzen bereits Offshore (davon Binance ${binance}, Bybit ${bybit}).`,
    `Perps-Awareness: ${noPerpsAware}/${uniqueResponses} haben noch nie von Perps gehört → großes Edukations-Potential.`,
  ];

  // Dream features (q17) — last submission per email if non-empty
  const dreamFeatures: { email: string; text: string }[] = [];
  for (const row of uniqueRows) {
    const text = (row.values[COLS.q17] || "").trim();
    if (text) dreamFeatures.push({ email: row.email, text });
  }
  // Sort by timestamp ascending so first responders are at the top
  dreamFeatures.sort((a, b) => {
    const ra = rowsByEmail.get(a.email.toLowerCase())?.ts || "";
    const rb = rowsByEmail.get(b.email.toLowerCase())?.ts || "";
    return ra.localeCompare(rb);
  });

  return {
    totalSubmissions,
    uniqueResponses,
    dateMin,
    dateMax,
    rowsByEmail,
    sections,
    keyMetrics: {
      handeltPerps,
      nutztHebel,
      willMehrHebel,
      featureLowFees,
      painHighFees,
      nutztOffshore,
    },
    insights,
    dreamFeatures,
  };
}

function bar(pct: number): string {
  // 30-char max bar, scaled relative to the largest value in this section.
  // We pass the *relative* fraction (0..1) — caller normalises.
  const w = Math.round(pct * 30);
  return "█".repeat(Math.max(0, Math.min(30, w)));
}

function pctStr(count: number, total: number): string {
  if (total === 0) return "0.0%";
  return `${((count / total) * 100).toFixed(1)}%`;
}

function buildResultsRows(agg: Aggregation): string[][] {
  const rows: string[][] = [];
  const total = agg.uniqueResponses;
  const generatedAt = new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC";

  // Header
  rows.push(["CONCORDE MARKET — QUESTIONNAIRE RESULTS"]);
  rows.push([
    `Unique Responses: ${agg.uniqueResponses}  ·  Total Submissions: ${agg.totalSubmissions}  ·  Zeitraum: ${agg.dateMin} → ${agg.dateMax}  ·  Last update: ${generatedAt}`,
  ]);
  rows.push([]);

  // Key Metrics
  rows.push(["🔑 KEY METRICS"]);
  rows.push([
    "Handelt bereits Perps",
    "Nutzt Hebel",
    "Will mehr Hebel",
    "Feature: Niedrige Gebühren",
    "Pain: Zu hohe Gebühren",
    "Nutzt Offshore",
  ]);
  rows.push([
    `${agg.keyMetrics.handeltPerps} (${pctStr(agg.keyMetrics.handeltPerps, total).replace(".0", "")})`,
    `${agg.keyMetrics.nutztHebel} (${pctStr(agg.keyMetrics.nutztHebel, total).replace(".0", "")})`,
    `${agg.keyMetrics.willMehrHebel} (${pctStr(agg.keyMetrics.willMehrHebel, total).replace(".0", "")})`,
    `${agg.keyMetrics.featureLowFees} (${pctStr(agg.keyMetrics.featureLowFees, total).replace(".0", "")})`,
    `${agg.keyMetrics.painHighFees} (${pctStr(agg.keyMetrics.painHighFees, total).replace(".0", "")})`,
    `${agg.keyMetrics.nutztOffshore} (${pctStr(agg.keyMetrics.nutztOffshore, total).replace(".0", "")})`,
  ]);
  rows.push([]);

  // Insights
  rows.push(["💡 INSIGHT HIGHLIGHTS"]);
  for (const ins of agg.insights) rows.push([`• ${ins}`]);
  rows.push([]);
  rows.push([]);

  // Sections
  for (const sec of agg.sections) {
    rows.push([`${sec.emoji} ${sec.title}`]);
    rows.push(["Option", "Count", "% of Respondents", "Bar"]);
    const maxCount = sec.counts[0]?.count || 1;
    for (const c of sec.counts) {
      rows.push([
        c.option,
        String(c.count),
        pctStr(c.count, total),
        bar(c.count / maxCount),
      ]);
    }
    if (sec.multi) {
      rows.push(["", `Mentions: ${sec.mentions}`, `Avg ${sec.avg.toFixed(1)}/resp`, ""]);
    }
    rows.push([]);
  }

  // Dream Features
  rows.push(["💭 DREAM FEATURES (Freitext)"]);
  rows.push(["Email", "Dream Feature"]);
  for (const d of agg.dreamFeatures) {
    rows.push([d.email, d.text]);
  }

  return rows;
}

async function readQuestionnaire(accessToken: string): Promise<string[][]> {
  const range = "Questionnaire!A1:T2000";
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${range}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) throw new Error(`Failed to read Questionnaire tab: ${await res.text()}`);
  const data = await res.json();
  return (data.values || []) as string[][];
}

async function clearResults(accessToken: string): Promise<void> {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/Results!A1:Z1000:clear`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  if (!res.ok) throw new Error(`Failed to clear Results tab: ${await res.text()}`);
}

async function writeResults(accessToken: string, rows: string[][]): Promise<void> {
  // Pad each row out to a consistent column count to avoid Sheets weirdness.
  const maxCols = rows.reduce((m, r) => Math.max(m, r.length), 0);
  const padded = rows.map((r) => {
    const out = r.slice();
    while (out.length < maxCols) out.push("");
    return out;
  });

  const range = `Results!A1`;
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${range}?valueInputOption=USER_ENTERED`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: padded }),
    }
  );
  if (!res.ok) throw new Error(`Failed to write Results tab: ${await res.text()}`);
}

/* ─── Public API ─── */

export async function rebuildResults(): Promise<{ ok: true; submissions: number; unique: number }> {
  if (!SA_B64 || !GOOGLE_SHEET_ID) {
    throw new Error("Service account or sheet ID not configured");
  }
  const token = await getAccessToken();
  const rows = await readQuestionnaire(token);
  const agg = aggregate(rows);
  const out = buildResultsRows(agg);
  await clearResults(token);
  await writeResults(token, out);
  return {
    ok: true,
    submissions: agg.totalSubmissions,
    unique: agg.uniqueResponses,
  };
}

/**
 * Fire-and-forget rebuild — never throws, never blocks the caller.
 * Use this from inside hot paths like /api/questionnaire after a successful insert.
 */
export function fireAndForgetRebuild(): void {
  rebuildResults().catch((err) => {
    console.error("Background results rebuild failed:", err);
  });
}
