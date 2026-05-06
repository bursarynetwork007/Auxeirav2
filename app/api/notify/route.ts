import { NextRequest, NextResponse } from "next/server";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { dynamo } from "@/lib/dynamodb";
import { subscribeToForm } from "@/lib/convertkit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, source } = body as { email: string; source?: string };

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const id = uuidv4();
    const timestamp = new Date().toISOString();

    // Store in DynamoDB
    try {
      await dynamo.send(
        new PutCommand({
          TableName: process.env.DYNAMODB_LEADS_TABLE ?? "auxeira-leads",
          Item: {
            id,
            timestamp,
            email,
            source: source ?? "notify",
            type: "notify-me",
          },
        })
      );
    } catch (dbErr) {
      console.error("DynamoDB write failed:", dbErr);
    }

    // Subscribe to ConvertKit notify form
    try {
      const formId = process.env.CONVERTKIT_FORM_ID_NOTIFY;
      if (formId && formId !== "placeholder") {
        await subscribeToForm({ formId, email, fields: { source: source ?? "notify" } });
      }
    } catch (ckErr) {
      console.error("ConvertKit subscribe failed:", ckErr);
    }

    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error("Notify API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
