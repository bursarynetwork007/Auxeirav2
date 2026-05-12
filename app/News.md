# AUXEIRA — DEVELOPER SPECIFICATION
**Date:** May 2026 | **Contact:** info@auxeira.com

---

## PART 1 — CURRENT STACK

| Component | Tool | Status |
|---|---|---|
| Hosting | AWS Amplify | Live |
| CDN | CloudFront | Live |
| Lead storage | DynamoDB — `auxeira-leads` | Live |
| Health check storage | DynamoDB — `auxeira-health-checks` | Live |
| Transactional email | Resend — from `info@auxeira.com` | Live |
| Subscriber org research | Grok API — async, non-blocking | Live |
| CRM | Zoho CRM | To build |
| Newsletter pipeline | Grok + Claude + Resend | To build |
| Deployment | Git-connected, auto-deploy on push | Live |

---

## PART 2 — STANDARDS (APPLY EVERYWHERE)

**Sending address:** `info@auxeira.com` via Resend for all automated sends. `info@auxeira.com` via Zoho Mail for all manual correspondence. No other addresses.

**CRM:** Every subscriber goes into Zoho CRM as a contact with source tag, segment, and research status.

**Subscribe form fields — exactly four required plus one conditional:**

| Field | Type | Required |
|---|---|---|
| First name | Text | Yes |
| Last name | Text | Yes |
| Work email | Email | Yes |
| Organisation name | Text | Yes |
| Organisation website | URL | Conditional — only shown if email domain is personal (gmail / outlook / hotmail / yahoo / icloud) |

No sector dropdown. No job title. No primary interest. Research answers everything else.

**Environment variables — all in AWS Secrets Manager:**

```
CLAUDE_API_KEY
GROK_API_KEY
XAI_API_KEY
RESEND_API_KEY
ZOHO_CRM_CLIENT_ID
ZOHO_CRM_CLIENT_SECRET
ZOHO_CRM_REFRESH_TOKEN
CALENDLY_URL = calendly.com/lante007
```

---

## PART 4 — SUBSCRIBE FLOW (COMPLETE)

This is the full correct flow from form submission to welcome email.

```
Visitor submits subscribe form
        ↓
POST /api/subscribe
        ↓
1. Validate — first name, last name, email, org name required
        ↓
2. Store in DynamoDB auxeira-leads:
   { id, timestamp, firstName, lastName, email,
     orgName, orgWebsite (inferred from email 
     domain or supplied), source, 
     grokResearchStatus: 'pending' }
        ↓
3. Create contact in Zoho CRM
        ↓
4. Fire Grok org research — ASYNC, non-blocking
        ↓
5. Send welcome email via Resend immediately
   From: info@auxeira.com
   To: subscriber email
   (see welcome email copy below)
        ↓
6. Return 200 to client
   On-page confirmation replaces form:
   "You're subscribed. First edition arrives
    on the first Monday of next month."
```

### Welcome email copy

**Standard welcome — fires immediately on subscribe:**
> [First name] — you are subscribed to Auxeira Intelligence. The first edition arrives on the first Monday of [month]. Each edition goes to people doing serious evidence and impact work across Africa's social sector. Expect it to be specific to your world, not generic.

**Subject:** You are subscribed to Auxeira Intelligence  
**From name:** Lante at Auxeira  
**From address:** info@auxeira.com  
**Reply-to:** info@auxeira.com

Do not reference the research in the welcome email. The personalisation shows up in the first newsletter edition — that is the correct moment for the subscriber to experience it. The welcome email confirms the subscription only.

---

## PART 5 — GROK SUBSCRIBER RESEARCH

The Grok research call fires async on subscribe and stores these fields in DynamoDB and Zoho CRM. The updated research prompt is in Part 6. Ensure all six sections return and are stored correctly — missing fields produce generic newsletter output.

---

## PART 6 — NEWSLETTER GENERATION (BUILD NEXT)

### Overview

Monthly autonomous pipeline. No manual input from Lante after initial setup except a 2-minute theme review.

```
WEEKLY (Monday 06:00 SAST — EventBridge cron):
Grok searches 22 sector sources
→ Returns 15 articles with summaries
→ Claude scores each for Auxeira relevance
→ Stored in DynamoDB topic-bank table

MONTHLY — THEME SELECTION (third Monday 08:00 SAST):
Claude analyses 30-day topic bank
→ Avoids last 6 edition themes
→ Selects strongest theme
→ Stored in DynamoDB monthly-theme table
→ Email notification to info@auxeira.com
   (Lante has 24hrs to override via admin endpoint)

MONTHLY — SEND (first Monday 07:00 SAST):
For each active subscriber in Zoho CRM:
  1. Get enriched profile
  2. Get monthly theme
  3. Claude generates personalised email
  4. Validate output
  5. Resend sends individual email
  6. Zoho CRM updated
→ Send summary to info@auxeira.com
```

### Master system prompt — use verbatim in all Claude calls

```python
MASTER_SYSTEM_PROMPT = """
You are a senior evidence intelligence consultant 
at Auxeira, a Johannesburg-based consultancy.

Your tone is: warm, intelligent, non-salesy, 
evidence-forward.

Never use exclamation marks.
Never say "I hope this finds you well."
Never use em dashes or long bars.
Never use bullet points in email body copy.
Never use bold text mid-paragraph.
Never open with a compliment.
Never use "leverage" as a verb.
Never use "synergies", "touch base", 
"reaching out", or "circle back."

Be specific. Be human. Write like a trusted 
advisor who has read their annual report and 
thought carefully about their situation before 
picking up the pen.

Auxeira is at the heart of every insight. 
Every observation about the sector connects 
naturally to what Auxeira's methodology does 
about it. This connection must feel inevitable, 
not forced.

Write in prose. Full sentences. 
One idea per paragraph.
"""
```

### Grok weekly search prompt

```
Search these 22 sources for significant 
articles from the last 7 days relevant to 
evidence, funding decisions, and policy in 
the African social impact sector:

South Africa: Daily Maverick, NGO Pulse, 
Ground Up, BizCommunity Social, PMG
African development: Devex Africa, African 
Arguments, CGAP, African Business, NextBillion
Global: SSIR, Alliance Magazine, 3ie, ODI, 
Impact Alpha
Funders: Skoll Foundation, Mastercard 
Foundation, Ford Foundation, DG Murray Trust, 
Zenex Foundation, ELMA Philanthropies, DBSA

Do not return obvious headlines. Find:
1. The most counterintuitive development
2. The connection between two apparently 
   unrelated things with a shared evidence gap
3. What practitioners are not yet talking 
   about but should be
4. One data point that would stop a senior 
   funder mid-scroll

Return JSON array of up to 15 articles:
[{
  "headline": "exact headline",
  "source": "publication name",
  "url": "article URL",
  "date": "publication date",
  "summary": "100 words — what it says",
  "sectorTags": ["ECD","Health","Economic Dev",
    "Governance","M&E","Funding","Policy"],
  "whyItMatters": "one sentence",
  "auxeiraAngle": "one sentence — how 
    Auxeira's methodology is relevant"
}]
```

### Claude newsletter generation prompt

```python
### Step 1 — Grok subscriber research prompt

Run this first on subscribe. Grok's real-time search is the research layer.

```
You are Grok, assisting Auxeira Intelligence 
with deep subscriber research.

Subscriber inputs:
- First Name: {firstName}
- Surname: {lastName}
- Organisation: {orgName}
- Work Email: {email}

Task: Conduct thorough research using 
LinkedIn, company website, recent news, 
publications, social media (X, LinkedIn), 
Google, and any other public sources.

Return a structured summary with ONLY 
these six sections:

1. Profile Summary: Current job title, 
   seniority, main responsibilities, 
   background (M&E, knowledge management, 
   specific sectors, etc.)

2. Key Work Focus Areas: Specific projects, 
   programmes, or initiatives. 
   List 2-4 most relevant.

3. Recent Activity / Publications: Any 
   recent articles, fellowships, talks, 
   or public contributions by the person 
   or organisation.

4. Provocative Angles: 2-3 counterintuitive 
   or under-discussed challenges or 
   opportunities in their specific domain 
   right now.

5. Personalisation Hooks: 3-4 specific, 
   natural phrases or facts we can reference 
   naturally in an email.

6. BD Signals: Any indications of current 
   priorities, funding partnerships, or 
   pain points.

Be precise, evidence-based, and sharp. 
Prioritise recent and specific details. 
Cite key sources briefly.

If limited data is found, return what 
exists and flag: "LIMITED_DATA"
```

### Step 2 — Claude newsletter generation prompt

Feed the full Grok output into this prompt.

```python
SYSTEM = """
You are a senior evidence intelligence 
consultant at Auxeira, a Johannesburg-based 
consultancy.

Tone rules — all mandatory:
- Warm, intelligent, non-salesy, 
  evidence-forward
- No exclamation marks
- No "I hope this finds you well"
- No em dashes, en dashes, or long bars
- No bullet points or bold in body copy
- One idea per paragraph. Full sentences.
- Write like a trusted advisor who has 
  read their work
- Never reveal that Auxeira has researched 
  the subscriber. The personalisation 
  should feel like informed sector 
  intelligence, not surveillance.
"""

USER = f"""
This is Month 1 — Loss Aversion mechanism.

Subscriber: {firstName} {lastName} at {orgName}

Grok Research:
{full_grok_output}

Monthly theme: {theme_title}
Theme summary: {theme_summary}
Month: {month_year}

Task: Write the complete newsletter edition.

Requirements:
- Total length: 220-280 words maximum
- Opening: Reference their specific work 
  using Grok hooks. Specific and collegial.
- Central insight: Sharp, provocative, 
  uncomfortably accurate about their world
- Strong loss aversion: Show the real 
  current cost of the translation gap
- One relevant proof point (SmartStart / 
  Skoll Award calibrated to their context)
- Projections block: Use the 30-40% 
  government partnership funding estimate, 
  caveated as estimated based on sector 
  benchmarks
- Closing question: "What would it look 
  like for {orgName} to enter the next 
  budget cycle with a ready fiscal case 
  for [their specific focus area]?"
- Final line: "If exploring that question 
  for thirty minutes feels useful, reply 
  to this email."

Sign off exactly:
Lante
Auxeira
info@auxeira.com

At the very end on a new line:
[BS_MECHANISM: loss_aversion]

Prioritise brevity, intellectual tension, 
and commercial sharpness. 
Cut every unnecessary word.
"""
```

### Content benchmark — Thabisile Zuma, Zenex Foundation

Every generated newsletter must meet this standard of sector specificity, fiscal argument, and tone:

---

*Dear Thabisile,*

*Zenex Foundation has produced some of the more rigorous evaluations of foundation phase mathematics and language interventions in South Africa. Yet that body of evidence is still not shaping the budget conversations that determine scale and sustainability.*

*The gap is no longer data. It is translation into the fiscal language National Treasury and DBE decision-makers now require.*

*South Africa's grade progression data shows learning deficits compounding from the foundation phase onward. The downstream costs — remediation programmes, repeated grades, lost earnings, and increased social expenditure — are substantial and largely unquantified in economic terms. Work like ZenLit and Zenex's language-mathematics briefs remains framed for researchers and implementers rather than for those who allocate public resources.*

*A comparable South African ECD network sat on strong implementation data for years. Once translated into an economic contribution narrative — 14,740 women-led micro-enterprises, independently verified 3.3x SROI, measurable fiscal savings — it shifted from invisible to award-winning. The Skoll Foundation's $2 million recognition followed.*

*Organisations with evaluation depth comparable to Zenex's are estimated to secure 30-40% less government partnership funding than peers who can present a credible fiscal case — based on sector benchmarks. In a constrained budget environment, that gap determines which programmes reach more learners and which remain pilots.*

*What would it look like for Zenex Foundation to enter the next budget cycle with a ready fiscal case for foundation phase scaling?*

*If exploring that question for thirty minutes feels useful, reply to this email.*

*Lante*
*Auxeira*
*info@auxeira.com*

*[BS_MECHANISM: loss_aversion]*

---

### Validation — run before every send

```javascript
function validateEmail(emailText) {
  const wordCount = emailText
    .split(/\s+/).length;
  return {
    passes: (
      !emailText.includes('!') &&
      !emailText.toLowerCase().includes(
        'hope this finds'
      ) &&
      !emailText.includes('noted your work') &&
      wordCount >= 220 &&
      wordCount <= 280 &&
      emailText.match(/\d+[-]\d+%/) &&
      emailText.includes('info@auxeira.com') &&
      emailText.includes('BS_MECHANISM')
    ),
    wordCount
  };
}
```

Three generation attempts before fallback. Fallback sends a shorter 3-paragraph version using the same system prompt.

---

## PART 7 — EMAIL TEMPLATE

The HTML email template is in `Auxeira_Email_Template.html` (already delivered).

Template variables to populate per send:

| Variable | Source |
|---|---|
| `{{preheader_text}}` | Claude |
| `{{edition_label}}` | System — e.g. "June 2026" |
| `{{theme_headline}}` | Claude theme selection |
| `{{theme_one_liner}}` | Claude theme selection |
| `{{theme_illustration_url}}` | S3 — generated monthly |
| `{{first_name}}` | Zoho CRM |
| `{{personalised_opening}}` | Claude |
| `{{sector_label}}` | Grok research |
| `{{sector_insight}}` | Claude |
| `{{methodology_insight}}` | Claude |
| `{{proof_point_text}}` | Claude |
| `{{org_name}}` | Zoho CRM |
| `{{projections_block}}` | Claude |
| `{{micro_survey}}` | Claude |
| `{{unsubscribe_url}}` | Resend auto-generated |

**Content benchmark:** The demo widget at `auxeira_newsletter_demo.jsx` shows exactly what the rendered email should look like. Use it as the visual reference.

---

## PART 8 — TRIGGER-BASED EMAILS

Build these after the monthly newsletter pipeline is live and tested.

| Trigger | Action | Priority |
|---|---|---|
| 3 consecutive opens | Hot lead escalation email + Calendly link | High |
| Any reply received | Zoho CRM task + Lante notification + post-reply nurture sequence starts | High |
| 90 days no opens | Re-engagement email | Medium |
| Monthly edition | Micro-survey one-liner above sign-off | Built into monthly template |
| Calendly booking | Subscriber status → Prospect in Zoho CRM, newsletter paused | High |

### Post-reply nurture sequence (3 emails, 14 days)

Fires automatically when any subscriber replies. Runs alongside Lante's personal response.

- Day 3: Value delivery — sector insight relevant to their reply
- Day 7: Proof point calibrated to their reply context  
- Day 14: Soft Calendly invite

Sequence stops if subscriber replies again, books a call, or unsubscribes.

### Hot lead escalation (3 consecutive opens)

> "[First name] — a few months in, if Auxeira Intelligence has been consistently relevant to where [Org Name] is heading, it may be worth a 30-minute conversation about what the evidence gap looks like specifically in your context. No pitch — just a conversation. My calendar is at the link below. If the timing is not right, the next edition arrives on [date]."

CTA: Calendly direct link — `calendly.com/lante007`

### Re-engagement email (90 days no opens)

> "[First name] — it has been a while since Auxeira Intelligence landed in a way that felt relevant to your work. That is on us, not you. If [Org Name]'s evidence priorities have shifted, reply to this email with one line on where the focus is now. We will recalibrate. If you would rather not receive further editions, click below."

Two links: reply prompt | unsubscribe

---

## PART 9 — LINKEDIN POST GENERATION

Every monthly send also generates a LinkedIn post for Lante.

Claude generates alongside the newsletter:
- 150-word post in first person as Lante
- Same theme as the newsletter
- Ends with a question directed at funders, NGO leaders, or government officials
- Links to auxeira.com
- Three comment-starter prompts (Lante selects one or two to post as replies)

Delivered to info@auxeira.com alongside the monthly send summary.

---

## PART 10 — SUBSCRIBER TO CLIENT PIPELINE

| Stage | Definition | System action |
|---|---|---|
| Subscriber | Receives monthly newsletter | Auto |
| Warm | Opened last 3 editions or clicked | Auto-tag in Zoho CRM |
| Hot | Replied or completed Health Check | Auto-tag + notify Lante |
| Prospect | Booked Calendly call | Calendly webhook → Zoho CRM, newsletter paused |
| Active client | Signed engagement | Lante updates manually |
| Dormant | No opens 90 days | Re-engagement email sent |

---

## PART 11 — ZOHO CRM CONTACT FIELDS

Every subscriber syncs to Zoho CRM with these fields:

**From form:** firstName, lastName, email, orgName, orgWebsite, source, subscribeDate

**From Grok research:** sector, jobTitle, orgMission, orgPriorities, evidenceMaturity, personalisationHook, bdOpportunity, nudgeAngle, lossFraming, grokResearchStatus

**System-assigned by Claude:** segment (Funders / Delivery Orgs / Government / Private Sector)

**Engagement tracking:** lastEmailSent, lastOpened, lastClicked, replied, engagementScore, subscriberStage, lastBSMechanism, subscriberChallengeNotes

---

## PART 12 — A/B TESTING

Every edition tests two subject lines.

- 10% of list → Subject A
- 10% of list → Subject B
- Wait 4 hours, measure open rate
- Winner sends to remaining 80%

Track results per edition in DynamoDB. Review quarterly.

---

## PART 13 — DEVELOPER CHECKLIST

### Subscribe flow
- [ ] Form has exactly 4 fields + conditional 5th (org website for personal emails)
- [ ] Form submits → DynamoDB `auxeira-leads` record created
- [ ] Zoho CRM contact created on subscribe
- [ ] Grok research fires async — all 6 research sections returned and stored
- [ ] Resend welcome email fires immediately from `info@auxeira.com`
- [ ] On-page confirmation shows without page reload
- [ ] Unsubscribe updates DynamoDB and Zoho CRM status
- [ ] All environment variables confirmed in AWS Secrets Manager

### Newsletter pipeline (build)
- [ ] DynamoDB topic-bank table created
- [ ] Lambda: weekly_topic_scraper (Grok search → topic bank)
- [ ] EventBridge: Monday 06:00 SAST
- [ ] Lambda: monthly_theme_selector (Claude analyses topic bank)
- [ ] EventBridge: third Monday 08:00 SAST
- [ ] Theme notification email to info@auxeira.com
- [ ] Lambda: monthly_newsletter_sender (Claude generates per subscriber → Resend)
- [ ] EventBridge: first Monday 07:00 SAST
- [ ] Validation function implemented
- [ ] Fallback generation implemented
- [ ] Behavioural mechanism tracker per subscriber in DynamoDB
- [ ] Send summary email to info@auxeira.com after each monthly send
- [ ] HTML email template variables wired

### Trigger emails (build after newsletter pipeline)
- [ ] Lambda: hot_lead_escalation (3 consecutive opens)
- [ ] Lambda: post_reply_nurture (3-email sequence, 14-day window)
- [ ] Lambda: re_engagement (90-day inactive)
- [ ] Zoho CRM: reply handling rule → task + Lante notification
- [ ] Calendly webhook → Zoho CRM prospect status update
- [ ] Lambda: linkedin_post_generator (alongside monthly send)

### Zoho CRM
- [ ] All contact fields created (see Part 11)
- [ ] Subscriber stage pipeline configured
- [ ] Reply-to rule configured
- [ ] Engagement score formula field

### Testing
- [ ] End-to-end subscribe test — confirm DynamoDB + Zoho CRM populated
- [ ] Grok research test — confirm all 6 sections returned and stored
- [ ] Claude newsletter generation test — 3 subscribers, 3 segments
- [ ] Resend delivery test — confirm info@auxeira.com sends and receives
- [ ] Validation function test — confirm guardrails fire correctly
- [ ] A/B split test — confirm 10/10/80 split
- [ ] Calendly webhook test

---

*Auxeira | info@auxeira.com | auxeira.com*  
*Johannesburg — Global from Africa*
