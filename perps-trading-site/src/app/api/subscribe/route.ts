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

  // Sign with private key
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

async function appendToSheet(email: string, name: string, source: string) {
  const accessToken = await getAccessToken();
  const range = "Leads!A:D";
  const timestamp = new Date().toISOString();

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [[email, name, timestamp, source]] }),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    console.error("Sheets API error:", error);
    throw new Error("Failed to append to sheet");
  }
}

async function checkDuplicate(email: string): Promise<boolean> {
  const accessToken = await getAccessToken();

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/Leads!A:A`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) return false;
  const data = await res.json();
  const emails = (data.values || []).flat().map((e: string) => e.toLowerCase());
  return emails.includes(email.toLowerCase());
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, market } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Ungültige E-Mail-Adresse" }, { status: 400 });
    }

    if (!SA_B64 || !GOOGLE_SHEET_ID) {
      console.error("Service account or sheet ID not configured");
      return NextResponse.json({ success: true, message: "Erfolgreich registriert" });
    }

    const isDuplicate = await checkDuplicate(email);
    if (isDuplicate) {
      return NextResponse.json({ success: true, message: "Bereits registriert" });
    }

    await appendToSheet(email, name || "", market || "direct");

    return NextResponse.json({ success: true, message: "Erfolgreich registriert" });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ success: true, message: "Erfolgreich registriert" });
  }
}
