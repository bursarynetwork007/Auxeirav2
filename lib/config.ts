// Runtime config loader for Amplify SSR.
// Amplify Gen 1 SSR Lambdas do not inherit build-time env vars.
// This module reads from SSM Parameter Store at runtime with a
// module-level cache so each Lambda instance only calls SSM once.

import { SSMClient, GetParametersCommand } from "@aws-sdk/client-ssm";

const SSM_REGION = "us-east-1";
const SSM_PREFIX = "/auxeira/";

const PARAM_NAMES = [
  "ZEPTOMAIL_TOKEN",
  "ANTHROPIC_API_KEY",
  "XAI_API_KEY",
  "MANUS_API_KEY",
  "MANUS_API_ENDPOINT",
  "DYNAMODB_LEADS_TABLE",
  "DYNAMODB_HEALTH_CHECK_TABLE",
  "DYNAMODB_TOPIC_BANK_TABLE",
  "LEAD_NOTIFICATION_EMAIL",
  "CAPABILITY_PDF_URL",
  "NEXT_PUBLIC_CALENDLY_URL",
  "NEXT_PUBLIC_SITE_URL",
] as const;

type ConfigKey = typeof PARAM_NAMES[number];

let cache: Partial<Record<ConfigKey, string>> | null = null;

async function loadFromSSM(): Promise<Partial<Record<ConfigKey, string>>> {
  const client = new SSMClient({ region: SSM_REGION });
  const names = PARAM_NAMES.map((n) => `${SSM_PREFIX}${n}`);

  const result: Partial<Record<ConfigKey, string>> = {};

  // SSM GetParameters accepts max 10 at a time
  for (let i = 0; i < names.length; i += 10) {
    const batch = names.slice(i, i + 10);
    const { Parameters = [] } = await client.send(
      new GetParametersCommand({ Names: batch, WithDecryption: true })
    );
    for (const p of Parameters) {
      if (p.Name && p.Value) {
        const key = p.Name.replace(SSM_PREFIX, "") as ConfigKey;
        result[key] = p.Value;
      }
    }
  }

  return result;
}

export async function getConfig(): Promise<Partial<Record<ConfigKey, string>>> {
  // In local dev, process.env is always populated — skip SSM
  if (process.env.ZEPTOMAIL_TOKEN || process.env.NODE_ENV === "development") {
    return {};
  }

  // Try reading from bundled secrets file first (written by amplify.yml at build time)
  if (!cache) {
    const candidates = [
      `${process.cwd()}/lib/secrets.json`,
      `${__dirname}/secrets.json`,
      "/var/task/lib/secrets.json",
    ];
    for (const p of candidates) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const bundled = require(p) as Partial<Record<ConfigKey, string>>;
        if (bundled && Object.keys(bundled).length > 0) {
          cache = bundled;
          console.log("[config] Loaded from", p, ":", Object.keys(cache).join(", "));
          return cache;
        }
      } catch {
        // try next path
      }
    }
    console.log("[config] secrets.json not found at any candidate path — falling back to SSM");
  }

  if (!cache) {
    try {
      cache = await loadFromSSM();
      console.log("[config] Loaded from SSM:", Object.keys(cache).join(", "));
    } catch (err) {
      console.error("[config] SSM load failed:", err);
      cache = {};
    }
  }

  return cache;
}

// Convenience: get a single value, falling back to process.env
export async function getEnv(key: ConfigKey): Promise<string | undefined> {
  const envVal = process.env[key];
  if (envVal) return envVal;
  const config = await getConfig();
  return config[key];
}
