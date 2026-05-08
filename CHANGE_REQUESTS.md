# AUXEIRA — DEVELOPER CHANGE REQUESTS & BUILD SPECIFICATION
**Document status:** Production  
**Last updated:** May 2026  
**Site:** https://main.d8eu8vgyh9rba.amplifyapp.com/  
**Production domain:** auxeira.com  
**Contact:** info@auxeira.com

> This document supersedes all verbal and chat-based instructions. Work through items in priority order. 


---

### 1.1 Headshot — Replace LL Placeholder
**Status:** 🔴 Blocking  
**Locations:** Two instances — Founder section and Team section  
**Action:** Replace both `LL` grey circle placeholders with Lante's professional photo 
**Team section also add the LinkedIn icon/link
**File:** Lante to supply   
**Notes:** Both instances must show the same image. 

---

### 1.3 SDG Pipeline Cards — Replace Numbers with Sector Names
**Status:** 🔴 Confirmed — cards showing `SDG 1`, `SDG 2` etc. with no sector names  
**Action:** Replace all pipeline card headings with full sector names

| SDG Number | Replace With |
|---|---|
| SDG 1 | No Poverty |
| SDG 2 | Zero Hunger |
| SDG 5 | Gender Equality |
| SDG 6 | Clean Water & Sanitation |
| SDG 7 | Affordable Clean Energy |
| SDG 9 | Industry, Innovation & Infrastructure |
| SDG 10 | Reduced Inequalities |
| SDG 11 | Sustainable Cities & Communities |
| SDG 12 | Responsible Consumption |
| SDG 14 | Life Below Water |
| SDG 15 | Life on Land |
| SDG 17 | Partnerships for Goals |

**Pipeline card copy (same for all):**  
`Sector intelligence engine under development. Register your sector interest.`

---

### 1.4 Economic Development Sector Link — Fix Wrong URL
**Status:** 🔴 Confirmed broken  
**Issue:** Economic Development card linking to `/sectors/health` instead of its own page  
**Fix:** Change href to `/sectors/economic-development`  
**Note:** Ensure `/sectors/economic-development` exists as a holding page — see Item 2.3

---

## PRIORITY 2 — THIS WEEK

---



---

### 2.1 Tagline — Move to Nav
**Status:** 🟡 Enhancement  
**Current position:** Footer only  
**Action:** Add `"Bringing a billion data points online that the world doesn't know exist."` as a persistent sub-line beneath the Auxeira wordmark in the navigation bar  
**Behaviour:** Visible on all scroll positions. Does not animate. Gold colour `#C9A84C`. Font size: 11px.

---

### 2.3 Sector Holding Pages — Build or Fix
**Status:** 🟡 Required  
**Pages needed:**

| URL | Status | Action |
|---|---|---|
| `/sectors/education` | Live — keep as is | No change |
| `/sectors/health` | Exists | Verify content is correct |
| `/sectors/economic-development` | 404 | Build holding page — see template below |
| `/sectors/climate` | Not linked | Build when needed |
| `/sectors/governance` | Not linked | Build when needed |

**Holding page template for Economic Development:**
```
Badge: BUILDING
Heading: Economic Development
Copy: From microenterprise to national fiscal policy, 
we translate economic evidence into the language of 
growth and scale. Our Economic Development sector 
intelligence engine is under development.
CTA: Register your interest → [email capture]
```

---

### 2.4 Calendly — Connect All CTA Links
**Status:** 🔴 All "Book a Call" CTAs link to `#`  
**Action:** Replace all `href="#"` on booking CTAs with Auxeira Calendly URL  
**Lante to supply:** Calendly link — set up at calendly.com using lante007@gmail.com 
**Locations to update:**
- Hero CTA: `Start a Conversation`
- Multi-point CTA section: `Book a Call →`
- Evidence Health Check results page: `Book your Evidence Strategy Call`
- Footer contact area

---

### 2.5 Capability Overview PDF — Connect Download
**Status:** 🔴 `Download Now →` links to nothing  
**Action:** Once Lante supplies the 2-page Capability Overview PDF:
1. Upload to S3 bucket
2. Generate CloudFront signed URL or public URL
3. Connect `Download Now →` CTA to that URL
4. Trigger email capture before download — Name + Email fields → store in `auxeira-leads` DynamoDB table with `source: capability_overview`

**PDF not yet produced:** Lante to create — see Pre-Launch Checklist


---

### 2.6 Images — Add Strategic Photography
**Status:** 🟡 Enhancement — currently no images except LL placeholder  
**This is not by design — it is a gap. Add in this priority order:**

**Image 1 — Lante headshot (Item 1.1 above)**

**Image 2 — Evidence architecture diagram (developer to build as SVG)**  
Location: Methodology section  
Content: Clean visual of the Extract → Synthesise → Move flow  
Style: Navy background, gold connectors, white labels. No stock photography.


**Image 3 — Abstract data visualisation (hero background element)**  
Location: Hero section — subtle background  
Style: Abstract map or data point scatter. Generative/designed. Not stock. Reinforces "billion data points" tagline visually.  
Instructions: Must not obscure headline text. Opacity 0.08–0.12 maximum.

---

## PRIORITY 3 — EVIDENCE HEALTH CHECK ENHANCEMENTS

---

### 3.1 Enhanced Results Page — Replace Existing
**Status:** 🟡 Enhancement — working prototype supplied  
**Action:** Replace the current diagnostic results screen with the enhanced version  
**File supplied:** `auxeira_enhanced_results_v2.html`  

**What the enhanced version adds:**
- Score ring with grade badge and risk level label
- Three projection cards scaling by Q8 budget answer
- Funding survival curve (Chart.js — 36-month, two lines)
- Counterfactual divergence chart (Chart.js — 3-year bar comparison)
- Three risks changing by score band
- Market context section with sector benchmarks
- AI competitive insight panel (Claude API with guardrails)
- Growth & scale timeline
- Loss aversion close — "The honest truth" block
- Renamed CTA: `Book your Evidence Strategy Call`

**Chart.js CDN:** Already on allowlist — `https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js`

---

### 3.2 AI Competitive Insight — System Prompt & Guardrails
**Status:** 🟡 Replace existing AI prompt with guardrailed version  

**System prompt (replace verbatim):**
```
You are Auxeira's Evidence Risk Analyst. Auxeira is a 
Johannesburg-based evidence intelligence consultancy 
that translates complex programme data into economic 
narratives that move funders, government, and boards 
to act.

Generate a structured competitive landscape insight 
using EXACTLY this format — three labelled sentences, 
nothing more:

LANDSCAPE: [One sentence on what is happening in this 
organisation's sector funding environment — specific 
to South Africa.]

RISK: [One sentence on what organisations with this 
evidence score typically lose — funding, policy 
influence, or funder priority — based on sector 
benchmarks.]

OPPORTUNITY: [One sentence on what closing this 
evidence gap with expert support typically unlocks — 
framed as an estimated range, tied to Auxeira's 
methodology.]

HARD RULES — return ONLY "USE_FALLBACK" if you 
cannot follow every rule:
1. Use ranges not point estimates
2. Every claim labelled "estimated" or "based on 
   sector benchmarks"
3. No legal or financial advice
4. No named competitor organisations
5. No claims about Auxeira's dataset size
6. LANDSCAPE must reference South Africa specifically
7. OPPORTUNITY must reference Auxeira by name
8. Exactly 3 sentences. No preamble. No sign-off.

Temperature: 0.3 | Max tokens: 150
```

**Fallback template (use when AI output fails validation or API call fails):**
```
LANDSCAPE: South Africa's social impact funding 
environment is tightening — funders are increasingly 
requiring economic framing and fiscal impact evidence, 
not just programme outcome data.

RISK: Organisations with similar evidence scores 
typically secure an estimated 30–40% less funding 
than sector leaders, based on ECD and health sector 
funding benchmarks across South Africa.

OPPORTUNITY: Closing this evidence gap through 
Auxeira's synthesis and translation methodology is 
estimated to unlock 2–3× more decision-maker 
engagement within 24 months — positioning your 
organisation competitively for the next major 
funding cycle.
```

**Validation function (replace existing):**
```javascript
function validateAIOutput(text) {
  const hasLandscape = text.includes('LANDSCAPE:');
  const hasRisk = text.includes('RISK:');
  const hasOpportunity = text.includes('OPPORTUNITY:');
  const hasRange = /\d+[–\-]\d+/.test(text);
  const hasEstimated = text.toLowerCase().includes('estimated') || 
                       text.toLowerCase().includes('based on');
  const hasAuxeira = text.includes('Auxeira');
  const hasSA = text.toLowerCase().includes('south africa') || 
                text.toLowerCase().includes('african');

  return hasLandscape && hasRisk && hasOpportunity 
      && hasRange && hasEstimated 
      && hasAuxeira && hasSA;
}
```

---

### 3.3 Results Page — Projections Scaling by Budget
**Status:** 🟡 Wire Q8 answer to projection values  
**Logic:** Q8 budget answer (1–4) drives all rand projections

| Q8 Answer | Funding at risk | Influence gap | Opportunity cost |
|---|---|---|---|
| Under R5M | R500K–R2M | 25–40% | R1–3M over 3 years |
| R5M–R20M | R2M–R8M | 30–45% | R5–15M over 3 years |
| R20M–R100M | R8M–R25M | 35–50% | R15–40M over 3 years |
| Over R100M | R25M–R80M | 40–60% | R50M+ over 3 years |

---

### 3.4 Manus Integration — Fallback Chain
**Status:** 🟡 Architecture requirement  
**Build API-first. Do not build diagnostic as static front-end only.**

**Fallback chain — do not modify:**
```
Level 0: Manus API research agent
         → if fails: Level 1
Level 1: Claude API with web_search tool
         → if fails: Level 2  
Level 2: Claude API diagnostic answers only
         → if fails: Level 3
Level 3: Static template with score/gaps inserted
```

**Placeholders to replace:**
- `CLAUDE_API_KEY_PLACEHOLDER` → Claude API key
- `MANUS_API_KEY_PLACEHOLDER` → Manus API key
- `MANUS_API_ENDPOINT_PLACEHOLDER` → Manus endpoint URL
- `CALENDLY_URL_PLACEHOLDER` → Calendly booking link

---

## PRIORITY 4 — CONTENT & POSITIONING

---

### 4.1 Proprietary Framework — Name and Brand
**Status:** 🟡 Copy update  
**Action:** Rename the Extract → Synthesise → Move methodology throughout the site to:

**"The Auxeira Evidence Intelligence Framework"**

Sub-names:
- Extract → **"The Longitudinal Evidence Audit"**
- Synthesise → **"The Decision-Ready Synthesis Engine"**
- Move → **"Knowledge Products That Move"**

**Locations to update:** How We Work section headings, any PDFs referencing the methodology

---

### 4.2 Thought Leadership Articles — Build Stub Pages
**Status:** 🟡 Three article stubs currently linking to `#insights`  
**Action:** Build three article stub pages with full title, author, and teaser — no full content required yet  

| Title | URL | Status |
|---|---|---|
| The Translation Gap: Why Strong Evidence Doesn't Drive Strong Decisions | `/insights/translation-gap` | Build stub |
| ECD as Economic Infrastructure: The Unmade Case for Treasury | `/insights/ecd-economic-infrastructure` | Build stub |
| What the Skoll Award Tells Us About Evidence Communication in Africa | `/insights/skoll-award-evidence` | Build stub |

**Stub page template:**
```
Title: [Article title]
Author: Lante Emmanuel Luthuli, Founder & CEO, Auxeira
Status: Coming soon
Teaser: [First paragraph — supplied by Lante]
CTA: Subscribe to Auxeira Intelligence to be 
     notified when this publishes → [email capture]
```

---

---

## PRIORITY 5 — PHASE 2 ASSETS (HOLD UNTIL SmartStart PUBLISHES)

---

> ⚠️ **Do not deploy any of the following until Lante confirms SmartStart has officially published the 10-Year Impact Report and gives explicit go-ahead.**

### 5.1 SmartStart Logo
**Action:** Add to Trust Builders section  
**Condition:** Written permission from Thabo / Grace Matlhape required before publishing

### 5.2 SmartStart Testimonial
**Current placeholder:** `"Case study testimonial, available following SmartStart's official release."`  
**Action:** Replace with approved quote when received  
**Condition:** Explicit written approval required — do not publish without it

### 5.3 SmartStart Case Study PDF — 4 Pages
**Current:** `Notify Me →` email capture placeholder  
**Action:** Replace placeholder CTA with `Explore the Full Case Study →` linking to PDF download  
**Condition:** Hold until SmartStart publishes officially  
**When live:** Upload PDF to S3, connect CloudFront URL, trigger notification email to all `notify_me` leads in DynamoDB

---

## INFRASTRUCTURE & TECHNICAL REQUIREMENTS

---

### 6.1 AWS Stack — Confirm Before Any Changes
**Hosting:** AWS Amplify — existing setup, do not migrate  
**CDN:** CloudFront — already configured  
**Database:** DynamoDB — two tables already live:
- `auxeira-leads` — newsletter, PDF download, notify-me submissions
- `auxeira-health-checks` — all diagnostic tool submissions

**Email:** Zoho Mail — existing setup  
**Email provider for marketing/newsletter:** Zoho Campaigns  
**Transactional email:** Zoho Transactional Email or Zoho SMTP via SES  
**DNS:** Route 53 — do not modify without Lante approval  
**Region:** Confirm DynamoDB tables and Amplify app are in same region

---

### 6.2 Email — Silent No-Ops Until Zoho Connected
**Current status:** All email calls are silent no-ops — no errors, no sends  
**Action when ready:** Connect Zoho Campaigns API for newsletter  
**Lists to create in Zoho Campaigns:**
- `auxeira-intelligence` — newsletter subscribers
- `diagnostic-leads` — health check submissions
- `capability-downloads` — PDF download requests
- `notify-me` — case study notification list

**Each capture point must pass a tag** so Lante knows the lead source.

---

### 6.3 Accessibility — WCAG 2.1 AA Minimum
- Keyboard-navigable — all CTAs, modals, expandable sections
- Screen reader compatible — proper heading hierarchy H1–H6
- Minimum contrast: 4.5:1 for body text, 3:1 for large text
- Gold `#C9A84C` on navy `#0A1628` — test with WCAG checker. Use off-white `#F5F0E8` for body text on navy. Reserve gold for headlines and accents only.
- Alt text on all images

---

### 6.4 Analytics — Google Tag Manager
**Events to track:**
- Scroll depth: 25%, 50%, 75%, 100%
- CTA clicks: `See Our Proof`, `Start a Conversation`, `Book a Call`, `Download`, `Subscribe`, `Notify Me`
- Form submissions: all capture points
- Health check: opened, each question answered (Q1–Q8), email submitted, results viewed, CTA clicked (record score and tier at click)
- Sector card clicks: which sector, which badge
- Which service tier (1, 2, 3) visitors click through to

**Heatmap:** Microsoft Clarity or Hotjar — install script on all pages

---

### 6.5 Performance
- Page load under 2 seconds on 4G — test on South African network
- Test on mid-range Android: Samsung A-series, Huawei, Tecno
- Hero animation: simplified or static on mobile — no layout shift
- All four stats animate from zero on scroll entry — desktop only
- Progress indicator: thin gold line at top of viewport fills on scroll — **required, not optional**

---

### 6.6 Contact Mechanism
- `Book a Call` → Calendly direct link or embed — no contact form friction
- `Download Capability Overview` → email capture → S3 PDF via auto-responder
- `Subscribe` → Zoho Campaigns list add
- `Notify Me` → `auxeira-leads` DynamoDB with `source: notify_me`
- All forms: GDPR/Privacy Policy checkbox
- All submissions: lead notification to info@auxeira.com with source tag

---

## PRE-LAUNCH CHECKLIST

| Item | Owner | Status |
|---|---|---|
| Professional headshot supplied | Lante | ⬜ |
| Calendly account set up — link supplied to developer | Lante | ⬜ |
| Capability Overview PDF produced (2 pages) | Lante | ⬜ |
| Zoho Campaigns account active and connected | Lante | ⬜ |
| Gold-on-navy contrast tested — WCAG checker | Developer | ⬜ |
| Mobile test — Samsung A-series or equivalent | Developer | ⬜ |
| Page load test — under 2 seconds on 4G South Africa | Developer | ⬜ |
| Progress indicator (gold line) implemented | Developer | ⬜ |
| All CTAs connected (Calendly, email capture, PDF) | Developer | ⬜ |
| Privacy Policy page live | Developer | ⬜ |
| Google Tag Manager installed | Developer | ⬜ |
| Heatmap script installed (Clarity or Hotjar) | Developer | ⬜ |
| Stats counter working — 49, 207, 3.3×, $2M | Developer | ⬜ |
| SDG pipeline cards showing sector names | Developer | ⬜ |
| Economic Development link fixed | Developer | ⬜ |
| Dissolving subheadlines cycling on desktop | Developer | ⬜ |
| DynamoDB tables confirmed same region as Amplify | Developer | ⬜ |
| Zoho email no-ops replaced with live sends | Developer | ⬜ |
| Enhanced results page deployed | Developer | ⬜ |
| AI insight guardrails and fallback deployed | Developer | ⬜ |

---

## PHASE 2 CHECKLIST (AFTER SmartStart PUBLISHES)

| Item | Owner | Status |
|---|---|---|
| SmartStart logo added — written permission confirmed | Lante | ⬜ |
| SmartStart testimonial added — written approval confirmed | Lante | ⬜ |
| Case study PDF uploaded to S3 | Developer | ⬜ |
| Notify Me leads notified via Zoho | Developer | ⬜ |
| `Explore the Full Case Study →` CTA live | Developer | ⬜ |
| Fieldwork photography added to Proof section | Lante + Developer | ⬜ |

---

## QUICK REFERENCE — BRAND TOKENS

| Token | Value |
|---|---|
| Primary navy | `#0A1628` |
| Gold | `#C9A84C` |
| Off-white | `#F5F0E8` |
| Charcoal | `#1A1A2A` |
| Light gold | `#F0E6C8` |
| Dark gold | `#8B6914` |
| Success green | `#1D9E75` |
| Warning amber | `#EF9F27` |
| Risk red | `#E24B4A` |
| Headline font | Cormorant Garamond or Playfair Display |
| Body font | DM Sans or Outfit |

---

*Document prepared by Auxeira. All items to be confirmed complete before domain cutover from staging to production.*  
*Questions: info@auxeira.com*
