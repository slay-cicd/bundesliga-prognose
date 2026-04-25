#!/usr/bin/env tsx
/**
 * Manually rebuild the Concorde Results tab from current Questionnaire data.
 * Reads GOOGLE_SHEET_ID + GOOGLE_SERVICE_ACCOUNT_B64 from env.
 *
 * Usage:
 *   GOOGLE_SHEET_ID=... GOOGLE_SERVICE_ACCOUNT_B64=... npx tsx scripts/rebuild-results.ts
 */

import { rebuildResults } from "../src/lib/concorde-results";

(async () => {
  try {
    const t0 = Date.now();
    const r = await rebuildResults();
    const ms = Date.now() - t0;
    console.log(
      `✅ Results rebuilt in ${ms}ms — ${r.submissions} submissions, ${r.unique} unique respondents.`
    );
    process.exit(0);
  } catch (err) {
    console.error("❌ Rebuild failed:", err);
    process.exit(1);
  }
})();
