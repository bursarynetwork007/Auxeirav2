# Auxeira

**Evidence intelligence for Africa's social sector.**

Auxeira translates complex programme data into economic narratives that move funders, government, and boards to act. This repository is the production codebase for [auxeira.com](https://auxeira.com).

---

## What this is

A Next.js 16 application deployed on AWS Amplify. It serves the Auxeira marketing site and the Evidence Health Check — an 8-question diagnostic that produces a personalised Entity Evidence Risk Report delivered by email.

---

## Architecture

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Hosting | AWS Amplify |
| Database | AWS DynamoDB |
| Email | ZeptoMail via Nodemailer |
| CRM | ConvertKit |
| Org research | xAI Grok (real-time web search) |
| Report generation | Anthropic Claude |
| Secrets | AWS SSM Parameter Store |

---

## Evidence Health Check — how it works

1. Visitor completes 8-question diagnostic and submits name, email, and organisation
2. Server scores the submission using the weighted matrix (`lib/healthCheckScoring.ts`)
3. Grok researches the organisation in real time using web search
4. Claude generates a personalised Entity Evidence Risk Report from the Grok profile and diagnostic answers
5. Report is delivered by email within minutes
6. Submission stored in DynamoDB; subscriber added to ConvertKit

Score normalisation: `round(raw / 104 × 100)` where 104 is the maximum possible raw score across all 8 questions.

---

## Project structure

```
app/
  api/
    health-check/       # Evidence Health Check submission and report generation
    ai-insight/         # Sector intelligence endpoint
    cron/grok-topics/   # Weekly topic bank via Grok
    notify/             # Lead notification
    subscribe/          # Newsletter subscribe
    webhooks/manus/     # Legacy no-op (Manus replaced by Grok)
  Evidence_Risk_Report.html         # Report template reference (browser demo)
  EVIDENCE_HEALTH_CHECK.md          # Full functional specification
  Auxeira_Capability_Overview.pdf   # Capability document

components/
  sections/             # Page sections (Hero, EvidenceHealthCheck, etc.)
  ui/                   # Shared UI components

lib/
  healthCheckScoring.ts # Scoring matrix, score bands, tier routing
  grok.ts               # xAI Grok client (org research + topic discovery)
  projections.ts        # Budget-scaled projection figures
  dynamodb.ts           # DynamoDB client
  mailer.ts             # Email via ZeptoMail
  convertkit.ts         # ConvertKit subscribe
  ses.ts                # AWS SES (fallback)
  config.ts             # SSM secret loader

docs/
  amplify-iam-policy.json   # IAM policy for Amplify service role

amplify.yml             # Amplify build config — pulls secrets from SSM at build time
```

---

## Local development

```bash
cp .env.local.example .env.local
# Fill in required values (see .env.local.example)

npm install
npm run dev
```

The app runs at `http://localhost:3000`.

---

## Environment variables

All secrets are stored in AWS SSM Parameter Store under `/auxeira/{KEY}` and injected at build time via `amplify.yml`. For local development, copy `.env.local.example` to `.env.local` and supply values directly.

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Claude report generation |
| `XAI_API_KEY` | Grok org research and topic discovery |
| `ZEPTOMAIL_TOKEN` | Transactional email |
| `DYNAMODB_HEALTH_CHECK_TABLE` | Health check submissions |
| `DYNAMODB_LEADS_TABLE` | Newsletter leads |
| `DYNAMODB_TOPIC_BANK_TABLE` | Weekly topic bank |
| `LEAD_NOTIFICATION_EMAIL` | Internal lead alert recipient |
| `NEXT_PUBLIC_CALENDLY_URL` | Calendly booking link |
| `NEXT_PUBLIC_SITE_URL` | Production URL |

---

## Scoring reference

Full scoring matrix, score bands, and tier routing logic are in `Auxeira_Evidence_Health_Check_Scoring_Matrix.xlsx` (three sheets). The functional specification is in `app/EVIDENCE_HEALTH_CHECK.md`.

---

## Deployment

Pushes to `main` trigger an automatic Amplify build and deploy. Build time is approximately 3-4 minutes.

---

*Auxeira · info@auxeira.com · Johannesburg — Global from Africa*
