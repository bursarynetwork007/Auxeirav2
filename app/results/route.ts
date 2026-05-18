// GET /results — serves the assembled browser results page for internal demos.
// Reads auxeira_enhanced_results_v2.html and inserts the market loss and
// value identity HTML fragments after the Top 3 risks card, per the spec.
//
// In production this page is not linked from the public site — the confirmation
// screen is the only thing shown after submission. This route exists for
// internal demos and Phase 2 development.

import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

function readFile(name: string): string {
  const candidates = [
    join(process.cwd(), name),
    join(process.cwd(), "public", name),
  ];
  for (const p of candidates) {
    try { return readFileSync(p, "utf-8"); } catch { /* try next */ }
  }
  return "";
}

export async function GET(): Promise<NextResponse> {
  let base        = readFile("auxeira_enhanced_results_v2.html");
  const marketLoss    = readFile("health_check_market_loss_section.html");
  const valueIdentity = readFile("health_check_value_identity_module.html");

  if (!base) {
    return new NextResponse("Results page template not found.", { status: 404 });
  }

  // Extract just the body content from each insert file (strip DOCTYPE/html/head/body wrappers)
  function extractBody(html: string): string {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) return bodyMatch[1].trim();
    // If no body tag, return as-is (already a fragment)
    return html;
  }

  // The insert comment in the market loss file says:
  // "Place it between the 'Top 3 risks' card and the 'Market context' section"
  // In auxeira_enhanced_results_v2.html the Top 3 risks card ends with </div>
  // followed immediately by the navy Market context div.
  // We insert after the closing </div> of the risks card.
  //
  // Marker: the risks card is followed by a <div class="navy"> for market context.
  const insertMarker = `<div class="navy">`;
  const insertIdx = base.indexOf(insertMarker);

  if (insertIdx !== -1 && (marketLoss || valueIdentity)) {
    const inserts = [
      marketLoss ? extractBody(marketLoss) : "",
      valueIdentity ? extractBody(valueIdentity) : "",
    ].filter(Boolean).join("\n\n");

    base = base.slice(0, insertIdx) + inserts + "\n\n" + base.slice(insertIdx);
  }

  return new NextResponse(base, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex",
    },
  });
}
