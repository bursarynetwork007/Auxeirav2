import { NextResponse } from "next/server";

// Manus is no longer used. Research is handled synchronously by Grok on submission.
// This endpoint is kept to avoid 404s from any in-flight legacy requests.
export async function POST() {
  return NextResponse.json({ received: true });
}
