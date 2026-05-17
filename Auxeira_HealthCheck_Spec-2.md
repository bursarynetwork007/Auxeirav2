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
via ZeptoMail from info@auxeira.com.

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

LANGUAGE REGISTER BY ORG TYPE — mandatory:
Read the org type from Q1 and the Grok research profile.
Apply the correct register throughout the entire report.

Delivery orgs (NGOs, social enterprises, government depts):
Use standard framing. "Gap" is appropriate. "Evidence gap"
is accurate and non-threatening. Loss aversion language
works directly.

Foundation and funder orgs:
Never use "gap" or "problem" as primary framing.
Never use "intervention" — use "partnership."
Never use "fix" — use "unlock."
Never use "what you are losing" — use "what remains
unmeasured" or "what is not yet visible."
Replace "the evidence gap is costing you" with
"the portfolio contribution that remains unmeasured."
The ERC-A signal must be honoured — these organisations
have strong evidence. Frame the report as surfacing
hidden value, not diagnosing failure.

Consultant and evaluator orgs:
Frame around client impact, not internal evidence.
"Your clients are leaving funding on the table" is
more resonant than "your evidence is weak."

LEADING QUESTION PLACEMENT — mandatory:
Loss aversion sections (Market Loss — Section 8, and
Value Identity — Section 9): place the leading question
at the START of the section, before the data.
This sets the reader's frame before the evidence lands.

Recommendation section (Section 13): place the leading
question at the END. The reader must arrive at the
question having been persuaded — not be led to it
before they have read the case.

All other sections: leading question at the end.
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
Org type: [delivery | foundation_funder | consultant]

PROGRAMME NAME (from Grok research):
Identify the single most prominent named programme,
initiative, or flagship product from the Grok profile.
This name is used in the forward box, the closing question,
and wherever a specific reference to their work appears.
Example: ZenLit, ZenMaths, ReadRight, Thrive, etc.
If no named programme is found, use the organisation's
primary focus area as a noun phrase.
Example: "foundation phase literacy programme"
Record as: [PROGRAMME NAME]

SECTOR AVERAGE:
Calculate the estimated sector average evidence score
for this organisation's specific sector.
Use these benchmarks:
  ECD / Early learning:        52
  Foundation phase education:  52
  Health:                      55
  Economic development:        50
  Foundation / Funder:         58
  Policy advocacy:             54
  Government:                  48
  Other:                       52
Record as: [SECTOR_AVG]
Also calculate: is the organisation ABOVE or BELOW average,
and by how many points?
Record as: [SCORE_VS_AVG] and [ABOVE_BELOW]

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

MARKET LOSS — SECTION 8 (NEW):
Generate numeric values for the market loss projection.
Calibrate all figures to the organisation's sector,
budget band, and current evidence score.

LEVERAGE NOW:
The organisation's current evidence leverage index.
Use their final score (0-100). Example: 66

LEVERAGE AT MONTH 48 (no action):
Project where their relative leverage lands if the
sector continues improving at current rates and they
do not act. Conservative estimate.
Calibrate: ERC-B typically declines to 25-35 range
by Month 48 as sector average rises.

TIPPING MONTH:
The estimated month at which the sector average
crosses above their current score. For ERC-B
organisations this is typically Month 18-26.

CUMULATIVE LOSS (rand range):
Total estimated funding attrition over 4 years
shifted to better-evidenced peers.
Calibrate to Q8 budget band:
Under R5M: R5M-R15M
R5M-R20M: R15M-R30M
R20M-R100M: R30M-R60M
Over R100M: R60M-R120M+

SECTOR POSITION NOW AND AT MONTH 48:
Express as percentile. ERC-B today is typically
top 30-45%. At Month 48 without action, typically
bottom 30-40%. Be specific to their sector.

ANNUAL LOSS BREAKDOWN (4 figures — Years 1-4):
Split each year's loss across three sources:
- Funder diversification loss
- Government co-funding missed
- Policy window misses
Year 1 is lowest; Years 2-4 grow as sector gap widens.

VALUE IDENTITY — SECTION 9 (NEW):
Select the organisation's top 2 value identity metrics
using the mapping table below. Generate specific
numeric projections for each.

VALUE IDENTITY MAPPING — mandatory:
Claude must select the two metrics that match this
organisation's PRIMARY self-identity from Grok research.
Do not default to generic financial metrics.

  ECD delivery orgs:
    Value 1: Children served (annual reach count)
    Value 2: Women worker economic contribution (rand)

  Education foundations / knowledge orgs:
    Value 1: Evidence influence (policy decisions
             informed by their research annually)
    Value 2: Knowledge reach (practitioners actively
             using their findings or learning products)

  Health NGOs:
    Value 1: Lives improved (DALYs prevented annually)
    Value 2: Cost-per-outcome (rand per beneficiary)

  Economic development orgs:
    Value 1: Enterprises or jobs created (annual count)
    Value 2: Household income change (rand uplift)

  Foundations and funders:
    Value 1: Portfolio economic contribution (rand,
             aggregate across grantees)
    Value 2: Grantee evidence quality (avg ERC score
             or maturity level across portfolio)

  Policy advocacy orgs:
    Value 1: Policy wins (legislative or budget
             changes influenced annually)
    Value 2: Stakeholder reach (decision-makers
             actively engaging their evidence)

  Government departments:
    Value 1: Service delivery metric (units delivered)
    Value 2: Budget efficiency (rand per outcome)

VALUE 1 — LABEL, METRIC, NOW, AT MONTH 48:
Name the value identity metric precisely.
State the unit of measurement.
Give a current estimated annual figure (from Grok
research where available, sector benchmark if not).
Project the Month 48 figure assuming no action and
sector improvement continuing at current rates.
Calculate percentage decline.

VALUE 2 — same structure as Value 1.

POLICY INFLUENCE — GENERATE:
List the relevant policy windows for this organisation's
specific sector over a 24-month period.
Name each window, the issuing body, and frequency.
Assign P(influence | ERC-B) and P(influence | ERC-A)
for each window using these actuarial benchmarks:

  P(influence | ERC-A): 0.55-0.78 depending on window type
  P(influence | ERC-B): 0.18-0.55 depending on window type
  Government budget windows: lower end of range
  Funder programme reviews: higher end of range

Calculate expected influence events at each ERC level.
State the foregone events gap.
Calculate value range: foregone events x estimated
value per event for their budget band.

COMPOUND PROBABILITY:
Calculate P(three consecutive successes) at ERC-B
versus ERC-A for their highest-relevance window.
Show the gap (e.g. 3% vs 31%).

STAKEHOLDER DECAY:
From Grok research, identify 4-6 key stakeholder
categories for this organisation. For each:
- Name and role description
- Current engagement probability (%)
- Projected engagement at Month 48 without action (%)

Use these decay benchmarks by stakeholder type:
Government budget officials: 60% → 15% (high decay)
Funder programme officers: 80% → 35% (medium decay)
Provincial government: 45% → 12% (high decay)
Co-funders and partners: 75% → 42% (medium decay)
Parliamentary committees: 30% → 8% (high decay)

State aggregate: current % and Month 48 %.

SECTOR INTELLIGENCE INSIGHT:
One paragraph. Three labelled sentences:
LANDSCAPE (South Africa-specific sector context).
RISK (what organisations at this score typically lose).
OPPORTUNITY (what Auxeira engagement typically unlocks).
Apply all voice rules. No AI attribution. No em dashes.
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
Must name the specific programme from Grok research
and reference the most relevant upcoming cycle or window.
Format: "What would it look like for [PROGRAMME NAME]
to enter the [NEXT SPECIFIC CYCLE — e.g. next MTEF
submission / next MCF education cycle / next board meeting]
with a ready [fiscal case / economic argument / portfolio
brief] for [SPECIFIC OUTCOME relevant to their work]?"
Do not use generic phrases like "the next budget cycle"
or "foundation phase scaling." Be specific to their
named work and their named audience.

TIER PRICE AND TIMELINE:
Match to the recommended tier.

PILOT DIAGNOSTIC OPTION (foundation and funder orgs only):
If Q1 identifies a foundation or funder org type, add
this entry option at the end of the recommendation section:
"Entry option: a 3-week Portfolio Evidence Diagnostic
at R85,000 – R150,000 provides the evidence base for
the full partnership conversation, with no obligation
to proceed to the full engagement."
Do not include this for delivery orgs.

FORWARD BOX CONTENT (only if seniority is not executive):
Include both the CEO name and the specific programme name.
Format: "This report is most relevant to [ORG NAME]'s
executive leadership. The evidence architecture gaps
identified here directly affect [PROGRAMME NAME]'s
[PRIMARY DECISION-MAKER AUDIENCE — e.g. Treasury / DBE /
MCF / portfolio] positioning. Forward this report to
[CEO NAME] — or reply to this email and we will take
it from there."

POLICY WINDOW DEADLINES:
For each policy window listed in the policy influence
section, include a specific deadline or timing signal
where available from Grok research or sector knowledge.
Format per window:
  Window name | Issuing body | Frequency | Deadline signal
Examples:
  MTEF submission | National Treasury | Annual | Closes Oct
  MCF education cycle | MCF | Biannual | Opens in 34 days
  DBE Annual Performance Plan | DBE | 2x year | Q2 next window
If a specific date is not available from Grok research,
use the most accurate estimate from sector knowledge
and label it "(estimated)."
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

Send these five files together. All five are required.

1. This document — Auxeira_HealthCheck_Spec.md
2. auxeira_health_check_email_template.html
   (complete email report — all 18 sections, no JavaScript,
   email-client compatible, all template variables marked)
3. auxeira_enhanced_results_v2.html
   (browser results page shown immediately after submission —
   demo controls hidden, Chart.js charts, no AI attribution)
4. health_check_market_loss_section.html
   (insert into browser results page after Top 3 risks)
5. Auxeira_Evidence_Health_Check_Scoring_Matrix.xlsx
   (three sheets: scoring, score bands, tier routing)

REPORT SECTION ORDER — both email and browser page:
  1.  Header
  2.  Score + ERC rating
  3.  Key projections (3 cards)
  4.  Top 2 gaps
  5.  Sector context
  6.  Three scenarios
  7.  Top 3 risks
  8.  Market loss projection        [NEW — market loss file]
  9.  Value identity + policy       [NEW — value identity file]
  10. Market context benchmarks
  11. Sector intelligence insight
  12. Proof point
  13. Recommendation
  14. Forward box (conditional)
  15. Honest truth
  16. CTAs
  17. Scoring breakdown
  18. Footer

BROWSER RESULTS PAGE (auxeira_enhanced_results_v2.html):
Insert health_check_market_loss_section.html and
health_check_value_identity_module.html immediately
after the closing div of the Top 3 risks card,
before the existing Market context navy section.
Both files insert in order: market loss first,
value identity second.

EMAIL TEMPLATE (auxeira_health_check_email_template.html):
Self-contained. All sections already included in
correct order. No additional insertion needed.
Populate all {{double_brace}} variables from Claude
output before sending via ZeptoMail.

Notes for the developer:
- Email template uses no JavaScript — email-safe HTML only
- Static progress bars replace Chart.js in email
- Browser page retains Chart.js for interactive charts
- Demo controls in browser page: set .demo-bar to
  display:flex to enable for internal demos
- No AI attribution anywhere in visible output
- No em dashes in any visible text

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

FLAGSHIP PROGRAMME NAME
Identify the single most prominent named programme,
initiative, or flagship product. This will be used
throughout the report wherever a specific reference
to their work appears. If multiple programmes exist,
name the one most central to their public identity
and most relevant to the evidence framing challenge.
State it clearly: "Flagship programme: [NAME]"
If no single programme dominates, state the primary
focus area as a descriptive noun phrase.

Return everything you find in a structured intelligence
briefing. There is no field limit. More detail produces
a better report. Flag clearly anything you could not
find or verify.
```

---

*Auxeira | info@auxeira.com | auxeira.com*
