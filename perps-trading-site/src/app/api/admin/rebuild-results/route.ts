import { NextRequest, NextResponse } from "next/server";
import { rebuildResults } from "@/lib/concorde-results";

/**
 * Admin-only manual rebuild for the Concorde Results tab.
 *
 * Auth: Authorization: Bearer <ADMIN_REBUILD_SECRET>
 *  or:  ?secret=<ADMIN_REBUILD_SECRET>
 *
 * Set ADMIN_REBUILD_SECRET in Vercel project env. Without it the route returns 503.
 */
export async function GET(req: NextRequest) {
  return handle(req);
}
export async function POST(req: NextRequest) {
  return handle(req);
}

async function handle(req: NextRequest) {
  const secret = process.env.ADMIN_REBUILD_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "ADMIN_REBUILD_SECRET not configured" },
      { status: 503 }
    );
  }

  const auth = req.headers.get("authorization") || "";
  const fromHeader = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const fromQuery = req.nextUrl.searchParams.get("secret") || "";
  const provided = fromHeader || fromQuery;

  if (provided !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const t0 = Date.now();
    const r = await rebuildResults();
    const ms = Date.now() - t0;
    return NextResponse.json({ ...r, ms });
  } catch (err) {
    console.error("Manual rebuild failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "rebuild failed" },
      { status: 500 }
    );
  }
}
