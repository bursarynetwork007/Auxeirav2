# AUXEIRA EVIDENCE HEALTH CHECK
## Functional Specification — Process Flow & AI Prompts
**Section:** Health Check only
**Date:** May 2026
**Reference file:** auxeira_health_check_report_template.html

---

## WHAT THIS TOOL DOES

The Evidence Health Check is an 8-question diagnostic that any social sector
organisation can complete in under 90 seconds. It produces a personalised
Entity Evidence Risk Report — a 2-page intelligence document that identifies
the organisation's evidence gaps, quantifies what those gaps are costing,
and recommends a specific Auxeira intervention.

The report is delivered by email only. Nothing substantive appears on screen
after submission — only a confirmation message. The quality of the report
justifies the wait.

This tool is the primary lead generation mechanism for Auxeira. Every
submission is a warm prospect with a named gap and a quantified cost.

---

## FULL VISION — ENTITY EVIDENCE RISK REPORT

This section captures the complete product vision. It distinguishes
what is being built now from what follows in Phase 2.

### What the tool produces

The output is not a score. It is an Entity Evidence Risk Report —
a credit rating for evidence quality with a forward-looking forecast.
Personalised, data-backed, and impossible to get anywhere else.

A visitor completes the 8-question diagnostic. The backend
simultaneously researches their organisation, cross-references
their sector against the funding landscape, runs actuarial-informed
scenario modelling on their evidence quality score, and generates
a three-scenario forecast. The report arrives by email within
2 hours.

---

### Phase 1 — Current build (Grok + Claude)

Grok searches publicly available sources — website, annual
reports, publications, LinkedIn, news coverage, funder
relationships. Claude generates the full report narrative
using the Grok research profile and diagnostic answers.

This covers approximately 80% of the full vision through
intelligent research rather than structured data pipelines.

Results page elements already built in
auxeira_enhanced_results_v2.html:

- Score ring with grade badge and risk level label
- Three projection cards scaling by Q8 budget answer
- Funding stability analysis with 36-month two-line chart
- Counterfactual divergence chart — 3-year bar comparison
- Three risks changing by score band
- Market context section with sector benchmarks
- Sector intelligence insight panel (Claude API with guardrails,
  no AI attribution visible in output)
- Growth and scale timeline
- Loss aversion close — "The honest truth" block
- CTA: Book your Evidence Strategy Call

Note on modelling language: The forecast uses
actuarially-informed scenario modelling based on sector
benchmarks — not Monte Carlo simulation. Do not describe
the methodology as Monte Carlo unless it is implemented
as a proper confidence interval model. The current
approach is honest and defensible as stated.

---

### Phase 2 — Data ingestion pipeline

Builds structured, regularly updated sector intelligence
to supercharge report personalisation beyond what Grok
can find on demand.

Layer 1 — Data ingestion pipeline:
Web scraping and API integrations pulling from SA NPO
Directorate, SARS tax exemption database, DSD records,
funder grant databases (Skoll, Ford, Mastercard Foundation
all publish awards publicly), news sources, LinkedIn, X,
Trialogue, Stats SA, ECD Information Hub, DataDrive2030
(Thrive by Five Index), ECD Connect (DGMT), Grow ECD
(Grow Giraffe).

Requires: Python-based scrapers, scheduled jobs, DynamoDB
or PostgreSQL on AWS RDS, and a cleaning and normalisation
layer. Some South African NGO data is messy and
inconsistently structured. The pipeline must handle
gaps gracefully and never invent data to fill them.

Layer 2 — AI synthesis engine:
Takes scraped org data plus diagnostic answers and generates
narrative sections of the report — gap analysis, peer
positioning, sector context, recommended interventions.
The part that makes the output feel like a senior consultant
wrote it. Never attributed to AI in the visible output.

Layer 3 — Actuarial forecast model:
The most defensible and differentiating layer. Takes the
evidence quality score, sector, budget size, and current
funding landscape data to produce:

- Probability of funding success at current score (baseline)
- Expected annual funding at risk in rand value
- Three-scenario projection (do nothing / partial / full Auxeira)
- Confidence interval ranges using proper Monte Carlo simulation
  — not a single number, which is what makes it actuarially
  credible rather than an illustrative estimate

Cross-references sector against:
- Active funders and grant cycles
- Policy windows relevant to the organisation's sector
- Comparable organisations in the same funding space
- Historical funding success rates at different evidence scores

Phase 2 is EvidenceOS infrastructure. It is not the current
developer sprint. Build Phase 1 to production first.

---

### Fields collected before the 8 questions begin

| Field | Notes |
|---|---|
| First name | Required |
| Last name | Required |
| Work email | Required. Domain used to infer org website |
| Organisation name | Required. Primary anchor for Grok research |

No other fields. No sector dropdown. No job title. Grok answers
everything else.

### The 8 questions and scoring

All scoring happens on the server using the exact point
values in the scoring matrix file.

The developer must implement scoring as a lookup table
matching each answer to its point value from the matrix.
Do not rebuild the scoring logic — use the matrix.

Full scoring table, gap diagnosis, and tier routing are
in Auxeira_Evidence_Health_Check_Scoring_Matrix.xlsx:
— Sheet 1: Question-by-question point values
— Sheet 2: Score bands, output copy, and CTA variants
— Sheet 3: Tier routing decision matrix

Score calculation:
Raw score = sum of all 8 answer point values (max raw = 104)
Final score = round( raw / 104 × 100 ) — normalised to 100

Score bands (from Sheet 2 of the matrix):
75–100 = Strong foundation
50–74  = Solid base, significant gap
25–49  = Significant gaps, urgent
0–24   = Critical gaps

Top gaps:
The two questions with the largest deficit between the
points scored and the maximum available for that question
become Gap 1 and Gap 2 in the report.

---

## WHAT THE VISITOR SEES AFTER SUBMISSION

On-screen confirmation only:

> "Your report is being prepared. We are researching [Organisation Name]
> and running your answers through the Auxeira Evidence Intelligence
> Framework. Your full Entity Evidence Risk Report will arrive at
> [email address] within 2 hours.
>
> While you wait — book your Evidence Strategy Call."

Calendly link below the text.

Nothing else. No score. No preview. No results page.
The report is the product. It arrives by email.

---

## PROCESS FLOW (PLAIN LANGUAGE)

### Step 1 — Submission received
The visitor submits the 4-field form and 8 answers.
The server calculates the score immediately.
The submission is stored in the database with all answers,
the calculated score, and the score band.
The confirmation screen shows immediately.

---

### Step 2 — Organisation website inferred
The server extracts the domain from the work email address
and constructs the organisation website URL automatically.
Example: thabisile@zenex.org.za → zenex.org.za

If the email is a personal address (gmail, outlook, hotmail,
yahoo, icloud), the org website is left blank and Grok
searches by organisation name alone.

---

### Step 3 — Grok research
A Grok API call fires immediately after the submission
is stored. It runs synchronously — the system waits for
the result before generating the report.

Grok uses its built-in real-time web search to research
the organisation: website, LinkedIn, news coverage,
publications, funder relationships, and recent activity.

This uses the XAI_API_KEY already confirmed working in
the Amplify environment — the same key used for newsletter
subscriber research. No webhook. No async task tracking.
No additional infrastructure.

If Grok returns limited data the system falls back to
generating the report from diagnostic answers alone
with a generic sector context.

**See Part A — Grok Research Prompt below.**

---

### Step 4 — Claude generates the report
The system passes the Grok research profile, the 8
diagnostic answers, the score, and the top 2 gaps
to Claude.

Claude generates the complete Entity Evidence Risk Report —
all sections, all projections, the proof point, the
recommendation, and the closing question.

**See Part B — Claude Report Generation Prompt below.**

---

### Step 5 — Report delivered by email
The completed report is sent to the subscriber's email address
via Resend from info@auxeira.com.

Subject line format:
Your Auxeira Evidence Risk Report — [Organisation Name]

From: Lante at Auxeira
From address: info@auxeira.com
Reply-to: info@auxeira.com

The email body contains the full HTML report rendered
from auxeira_enhanced_results_v2.html with all variables
populated by Claude's output.

---

### Step 6 — Subscriber added to newsletter list
If the submitter is not already on the newsletter list
they are added to DynamoDB auxeira-leads and a Zoho CRM
contact is created automatically.

The Health Check data enriches their profile immediately:
score, top gaps, tier recommendation, and Grok research
profile are all stored alongside their contact record.
The newsletter personalisation uses this data from the
next edition onward.

---

### Step 7 — CRM updated
The submission, score, research profile, and report are stored.
If the subscriber is not already in Zoho CRM, a contact is
created automatically.

If the subscriber IS already a newsletter subscriber, their
CRM profile is enriched with the Health Check data —
score, top gaps, tier recommendation. The newsletter
personalisation uses this data from the next edition onward.

---

## SENIORITY DETECTION AND REPORT CALIBRATION

Grok research returns a seniority level for the submitter:

**Executive** — CEO, Director, Chairperson, Trustee, Head of
**Senior manager** — Programme Manager, M&E Manager, Senior Advisor
**Programme level** — Coordinator, Officer, Analyst, Intern

**If seniority is Executive:**
The report is delivered as generated.
Standard CTA: Book your Evidence Strategy Call.

**If seniority is Senior Manager or Programme Level:**
The forward-box section is shown in the report:

> "This report is most relevant to [Organisation Name]'s executive
> leadership. If the evidence architecture question is one for your
> CEO or board, forward this report to [CEO name from Grok research]
> — or reply to this email and we will take it from there."

This converts a programme-level submission into a warm introduction
to the CEO via the person who completed the diagnostic.

---

## PROOF POINT BRIDGE RULE

This rule applies to every report regardless of sector.

The SmartStart / Skoll Award proof point is Auxeira's primary
evidence of methodology — not sector equivalence.

**Never** imply that the subscriber's organisation is
comparable to SmartStart. Never say "like SmartStart, you can..."
or "as an ECD organisation, Zenex could..."

**Always** bridge via methodology:

> "The same approach that surfaced the economic contribution
> of a South African delivery network applies equally to
> [subscriber sector] work, where the fiscal multipliers
> are equally strong and equally unmade."

The bridge is: same methodology, different sector, same gap.

---

## PART B — CLAUDE REPORT GENERATION PROMPT

### System prompt (use verbatim — same voice as the newsletter)

```
You are a senior evidence intelligence consultant at Auxeira,
a Johannesburg-based consultancy.

Your tone is: warm, intelligent, non-salesy, evidence-forward.

Never use exclamation marks.
Never say "I hope this finds you well."
Never use em dashes or long bars.
Never use bullet points in body copy.
Never use bold text mid-paragraph.
Never open with a compliment.
Never use "leverage" as a verb.
Never use "synergies", "touch base", "reaching out",
or "circle back."
Never reference AI, Claude, or any technology in
visible output. The report reads as if written by
a senior human consultant.

Be specific. Be human. Write like a trusted advisor
who has read their annual report and thought carefully
about their situation before picking up the pen.

Auxeira is at the heart of every insight. Every observation
about the sector connects naturally to what Auxeira's
methodology does about it. This connection must feel
inevitable, not forced.

Write in prose. Full sentences. One idea per paragraph.

PROOF POINT BRIDGE RULE — mandatory:
The SmartStart / Skoll Award proof point is a methodology
proof, not a sector comparison. Never imply the subscriber's
organisation is comparable to SmartStart. Always bridge via
methodology: "The same approach that surfaced X for a South
African delivery network applies equally to [their sector]
work, where the fiscal multipliers are equally strong
and equally unmade."

SURVEILLANCE RULE — mandatory:
Never reveal that Auxeira has researched the subscriber.
Never say "we researched you" or "we found" or "we noticed."
The personalisation must feel like informed sector intelligence,
not like an investigation.
```

---

### User prompt — feed Grok output and diagnostic answers here

```
Generate a complete Entity Evidence Risk Report for this
organisation. Use all sections of the report template.
Populate every variable with specific, personalised content.
Do not use placeholder text or generic observations.

SUBSCRIBER:
First name: [FIRST NAME]
Last name: [LAST NAME]
Organisation: [ORGANISATION NAME]
Seniority: [executive | senior_manager | programme_level]
CEO name (if submitter is not CEO): [CEO NAME FROM GROK]

DIAGNOSTIC ANSWERS AND SCORE:
Q1 answer: [ANSWER] — [POINTS] points
Q2 answer: [ANSWER] — [POINTS] points
Q3 answer: [ANSWER] — [POINTS] points
Q4 answer: [ANSWER] — [POINTS] points
Q5 answer: [ANSWER] — [POINTS] points
Q6 answer: [ANSWER] — [POINTS] points
Q7 answer: [ANSWER] — [POINTS] points
Q8 answer: [ANSWER] — [POINTS] points
Raw score: [RAW] / 104
Final score: [SCORE] / 100
Score band: [BAND]
Gap 1: [QUESTION WITH HIGHEST DEFICIT]
Gap 2: [QUESTION WITH SECOND HIGHEST DEFICIT]

GROK RESEARCH PROFILE:
[PASTE FULL GROK OUTPUT HERE]

GENERATE EACH SECTION BELOW.
Be specific to this organisation throughout.
Minimum 2 sentences per section. Maximum as noted.

SCORE HEADLINE (1 sentence):
What the score tells us about this specific organisation —
not a generic statement. Reference their sector or work.

EXECUTIVE SUMMARY (2 sentences):
What they have and what it is not yet doing.
Reference their specific evidence profile from Grok research.

FUNDING AT RISK (rand range):
Calibrate to their budget (Q8) and their primary gap.
Label clearly as estimated based on sector benchmarks.

INFLUENCE GAP (percentage range):
How much of their potential policy influence is currently
not reaching their primary audience (Q2).

OPPORTUNITY COST (rand range over 3 years):
What they could access if the gaps were closed.

GAP 1 TITLE AND BODY (3-4 sentences):
Name the gap precisely. Explain what it means for this
organisation specifically. Reference their Grok research profile.
End with an estimated cost statement.

GAP 2 TITLE AND BODY (3-4 sentences):
Same approach as Gap 1. Different gap, different framing.

SECTOR CONTEXT (4-5 sentences):
The evidence and funding landscape in their specific sector
right now. South Africa-specific where possible.
One data point minimum.

SECTOR METRICS (3 figures):
Three relevant sector benchmarks that contextualise
the report. Label all as estimated.

SCENARIO — DO NOTHING (3 sentences):
What happens to this specific organisation over 3 years
if the evidence gaps are not addressed.

SCENARIO — PARTIAL FIX (3 sentences):
What happens if only one of the two gaps is addressed.

SCENARIO — FULL AUXEIRA (3 sentences):
What the organisation looks like after a full Tier 1, 2,
or 3 engagement. Reference their specific programme
or portfolio context.

RECOVERY VALUE (rand range):
The 3-year funding opportunity if the full intervention
is implemented. Calibrate to their budget and sector.

RISK 1 TITLE AND BODY (2-3 sentences):
Most critical risk. Specific to their profile.

RISK 2 TITLE AND BODY (2-3 sentences):
Second risk. Specific to their profile.

RISK 3 TITLE AND BODY (2-3 sentences):
Third risk. Sector positioning or competitive risk.

PROOF POINT BRIDGE (2-3 sentences):
Apply the proof point bridge rule exactly as stated
in the system prompt. Bridge via methodology.
Reference their specific sector in the bridge.

TIER LABEL:
Tier 1 — Evidence Translation
Tier 2 — Evidence Synthesis and Strategy
Tier 3 — Sector Intelligence Platform
(Select based on Grok research and Q8 budget)

URGENCY LABEL:
Urgent — Within 3 months — Within 6 months
(Select based on their score and primary audience)

RECOMMENDATION BODY (3-4 sentences):
What the recommended engagement would produce for this
specific organisation. Reference their named programmes
or portfolio. Make the output concrete, not abstract.

CLOSING QUESTION (1 sentence):
"What would it look like for [ORGANISATION NAME] to enter
the next budget cycle with a ready fiscal case for
[their specific focus area from Grok research]?"

TIER PRICE AND TIMELINE:
Match to the recommended tier.

FORWARD BOX CONTENT (only if seniority is not executive):
"This report is most relevant to [ORGANISATION NAME]'s
executive leadership. If the evidence architecture question
is one for your CEO or board, forward this report to
[CEO NAME] — or reply to this email and we will take it
from there."
```

---

## WHAT SUCCESS LOOKS LIKE

A well-generated report reads as if a senior Auxeira consultant
spent four hours reviewing the organisation before writing it.
The subscriber reads it and thinks two things:

First: "They understand our situation better than most people
we have briefed in person."

Second: "The gap they have identified is real. We know it.
We just haven't known how to fix it."

If the report achieves both of those, the probability of a
reply or a Calendly booking is high.

If the report feels generic — if the sector context could apply
to any organisation, if the proof point feels like a sales line,
if the gaps are obvious rather than insightful — it will not
convert. The specificity is everything.

---

## WHAT TO SEND THE DEVELOPER

Send these three files together. All three are required.

1. This document — Auxeira_HealthCheck_Spec.md
2. auxeira_enhanced_results_v2.html
   (production results page — demo controls hidden,
   no AI attribution, no em dashes, no guardrail notes)
3. Auxeira_Evidence_Health_Check_Scoring_Matrix.xlsx
   (three sheets: scoring, score bands and output copy,
   tier routing decision matrix)

Notes for the developer on the results page:
- The section formerly labelled "AI competitive insight"
  is now labelled "Sector intelligence insight"
- No AI attribution, badge, or guardrail text anywhere
  in the visible output
- Demo controls are present in the code but hidden.
  Set .demo-bar { display: flex } to enable for demos.
- All em dashes have been removed from visible text

The scoring matrix is the implementation reference for the
server-side scoring engine. The developer should not attempt
to rebuild the scoring logic from scratch — the matrix
contains the exact point values, gap diagnosis, tier signals,
and CTA variants for every possible answer combination.

---

## PART A — GROK RESEARCH PROMPT

Grok uses real-time web search to research the organisation.
Give it the organisation name, website, and person name.
The richer the research output, the more personalised
the report.

Use this prompt verbatim:

---

```
You are conducting a comprehensive intelligence briefing
on an organisation for a senior evidence intelligence
consultant. This briefing will be used to write a
personalised report that must read as if someone spent
two days researching the organisation before picking up
a pen.

ORGANISATION: [ORGANISATION NAME]
WEBSITE: [ORG WEBSITE — inferred from email domain]
PERSON WHO COMPLETED THE DIAGNOSTIC: [FIRST NAME] [LAST NAME]

Research this organisation exhaustively using every
available public source. Read the website in full —
every page including About, Team, Board, Programmes,
Impact, Reports, News, and any downloadable documents.
Download and read any annual reports, evaluations,
strategy documents, or publications available on the site.
Search LinkedIn for both the organisation and the named
person. Search for news coverage in the last 36 months.
Search for any academic papers, government references,
or sector mentions. Look for any awards, recognition,
or notable events.

BUILD A COMPLETE INTELLIGENCE PROFILE covering:

WHO THEY ARE
What does this organisation do and who does it serve?
What is their founding story and mission?
What sector do they operate in — be precise and specific.
Note important distinctions (foundation phase education
is not ECD; community health is not hospital care).
What is their scale — number of beneficiaries, geographic
reach, staff size, years of operation?

LEADERSHIP AND DECISION-MAKERS
Who is the CEO or Executive Director? Full name and title.
Who else is on the leadership team? List names and roles.
Who is on the board? Any notable board members?
What is [FIRST NAME] [LAST NAME]'s exact job title and role?
What is their seniority level — are they executive,
senior management, or programme level?
Have they published anything, spoken at events, or
appeared in news coverage? Note what you find.

PROGRAMMES AND INITIATIVES
List every named programme or initiative you can find.
For each one: what does it do, who does it serve,
what is the geographic scope, and what evidence exists
of its outcomes?
Are there flagship programmes that define the
organisation's identity publicly?

EVIDENCE AND EVALUATION PORTFOLIO
Has the organisation published evaluations, impact reports,
or research? List titles, dates, and authors if found.
Have they commissioned independent evaluations?
Is there any SROI, economic multiplier, or fiscal impact
analysis in any of their documents?
How do they currently communicate their impact —
what language do they use, what metrics do they cite?
How mature is their evidence — are they citing outcome
data, output data, or primarily activity data?

FUNDER AND GOVERNMENT RELATIONSHIPS
Which funders are named on their website, in reports,
or in news coverage? List every foundation, government
body, corporate funder, or development finance institution
mentioned anywhere.
Any evidence of government partnerships, co-funding
relationships, or policy influence?
Are they mentioned in any government documents,
Treasury frameworks, or sector policy papers?

SECTOR POSITIONING
Who are the comparable organisations in their sector?
Where do they sit in the sector landscape —
leader, emerging, niche, or broad?
What conversations is their sector having right now
that this organisation is or should be part of?

EVIDENCE GAP SIGNALS
Based on everything you have found, what is the gap
between the strength of their work and how that work
is communicated to funders and government?
Where is the evidence strong but the translation weak?
Where is the economic or fiscal story missing entirely?
What would a Treasury official or international funder
not be able to answer after reading all of their
public materials?

PERSONALISATION HOOKS
Find three to five specific, concrete, recent details
from their public presence that a senior consultant
could reference naturally in a report.
These must be real and verifiable — named programmes,
specific publications, recent events, notable quotes
from leadership, awards received.
Not generic observations. Specifics only.

Return everything you find in a structured intelligence
briefing. There is no field limit. More detail produces
a better report. Flag clearly anything you could not
find or verify.
```

---

*Auxeira | info@auxeira.com | auxeira.com*
