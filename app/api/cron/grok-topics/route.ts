import { NextRequest, NextResponse } from "next/server";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { dynamo } from "@/lib/dynamodb";
import { discoverWeeklyTopics } from "@/lib/grok";

// Weekly topic discovery — called by Amplify scheduled job or external cron.
// Stores results in DynamoDB topic-bank table for Claude to consume at send time.
//
// Trigger: POST /api/cron/grok-topics
// Auth:    CRON_SECRET header (set in Amplify env vars)
// Schedule: weekly, e.g. every Monday 06:00 SAST

const TOPIC_TABLE = process.env.DYNAMODB_TOPIC_BANK_TABLE ?? "auxeira-topic-bank";

export async function POST(req: NextRequest) {
  // Verify cron secret
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("x-cron-secret") ?? req.headers.get("authorization") ?? "";
    if (!auth.includes(secret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!process.env.GROK_API_KEY) {
    return NextResponse.json({ error: "GROK_API_KEY not configured" }, { status: 503 });
  }

  try {
    console.log("Starting Grok weekly topic discovery...");
    const result = await discoverWeeklyTopics();

    // Store in DynamoDB topic bank
    const id = uuidv4();
    await dynamo.send(
      new PutCommand({
        TableName: TOPIC_TABLE,
        Item: {
          id,
          week: result.generated_at,
          topics: result.topics,
          topicCount: result.topics.length,
          createdAt: new Date().toISOString(),
        },
      })
    );

    console.log(`Stored ${result.topics.length} topics for week of ${result.generated_at}`);

    return NextResponse.json({
      success: true,
      week: result.generated_at,
      topicCount: result.topics.length,
      topTopics: result.topics
        .sort((a, b) => b.relevance_score - a.relevance_score)
        .slice(0, 3)
        .map((t) => `[${t.relevance_score}] ${t.title}`),
    });
  } catch (err) {
    console.error("Grok topic discovery failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
