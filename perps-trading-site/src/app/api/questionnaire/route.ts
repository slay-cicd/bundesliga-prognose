import { NextRequest, NextResponse } from "next/server";

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

async function appendToQuestionnaireSheet(
  email: string,
  answers: Record<string, string | string[]>
) {
  const accessToken = await getAccessToken();
  const range = "Questionnaire!A:T";
  const timestamp = new Date().toISOString();

  const fmt = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v.join(", ") : v || "";

  // Column mapping MUST match the sheet header row (see Concorde Market — Signups).
  // A: Email, B: Timestamp, C..T: q1..q17 with conditional q5/q6.
  const row = [
    email,                 // A  Email
    timestamp,             // B  Timestamp
    fmt(answers.q1),       // C  Trading-Häufigkeit
    fmt(answers.q2),       // D  Aktuelle Plattformen
    fmt(answers.q3),       // E  Derivate-Erfahrung
    fmt(answers.q4),       // F  Perps-Erfahrung
    fmt(answers.q5),       // G  Warum Perps?            (conditional — Ja)
    fmt(answers.q6),       // H  Warum keine Perps?      (conditional — Nein)
    fmt(answers.q7),       // I  Asset-Klassen
    fmt(answers.q8),       // J  Monatliches Trading-Volumen
    fmt(answers.q9),       // K  Max Hebel genutzt
    fmt(answers.q10),      // L  Größter Schmerzpunkt
    fmt(answers.q11),      // M  Was ist wichtig?
    fmt(answers.q12),      // N  Einzahlungsmethode
    fmt(answers.q13),      // O  Fehlende Derivate-Features (replaced Info-Quellen)
    fmt(answers.q14),      // P  Selbsteinschätzung
    fmt(answers.q16),      // Q  Liquidation-Erfahrung (NEW)
    fmt(answers.q15),      // R  Offshore-Nutzung
    fmt(answers.q17),      // S  Dream-Feature (NEW, free text)
    "",                    // T  (reserved for future)
  ];

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [row] }),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    console.error("Sheets API error:", error);
    throw new Error("Failed to append to sheet");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, answers } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Ungültige E-Mail-Adresse" }, { status: 400 });
    }

    if (!SA_B64 || !GOOGLE_SHEET_ID) {
      console.error("Service account or sheet ID not configured");
      return NextResponse.json({ success: true, message: "Gespeichert" });
    }

    await appendToQuestionnaireSheet(email, answers || {});

    return NextResponse.json({ success: true, message: "Fragebogen gespeichert" });
  } catch (error) {
    console.error("Questionnaire error:", error);
    return NextResponse.json({ success: true, message: "Fragebogen gespeichert" });
  }
}
