## implementation-plan.md

---

## Build Philosophy

Ship structure first.
Refine intelligence second.
Polish emotion continuously.

Mobile-first.
One dominant metric per screen.
No feature sprawl.

---

# Phase 0 — System Foundations (Week 1–2)

## 1. Project Initialization

* Create Lovable project
* Set global design tokens:

  * Background: `#0A0A0F`
  * Surface: `#14141C`
  * Accent: `#2E6BFF`
  * Positive: `#2BB673`
* Define typography scale
* Enable tabular numerals

Checkpoint:

* Dark theme consistent
* One mobile breakpoint only
* No visual noise

---

## 2. Supabase Setup

* Create project
* Enable Row-Level Security
* Configure private storage bucket (photos)
* Create base tables:

  * users
  * photo_sets
  * strion_index_records
  * protocols
  * tasks
  * checkpoints

Checkpoint:

* RLS verified with test user isolation
* Photo bucket not publicly accessible

---

## 3. Stripe Setup

* Create:

  * 7-day free trial plan
  * Monthly plan
  * Annual discounted plan
* Connect webhook to Supabase
* Gate dashboard behind subscription

Checkpoint:

* Expired subscription blocks access
* Trial transitions properly

---

# Phase 1 — Authentication (Week 2)

## Build Sequence

1. Create minimal login screen
2. Email + password via Supabase Auth
3. Disable all distractions
4. Redirect to onboarding if first login
5. Redirect to dashboard if returning user

Micro-Tasks:

* Add form validation
* Add loading state (subtle opacity shift)
* Add error message (neutral tone)

Checkpoint:

* Sign up → clean onboarding entry
* Logout → secure session clear

---

# Phase 2 — Onboarding Engine (Week 3–4)

---

## Step 1: Photo Capture

Micro Build Order:

1. Create square upload containers
2. Add required counter (e.g., 3/4)
3. Enable glow state after upload
4. Store images in private bucket
5. Save metadata record

Checkpoint:

* Cannot proceed until required photos uploaded
* Images retrievable only by owner

---

## Step 2: Questionnaire

Micro Build Order:

1. Single-question per screen
2. Top progress bar
3. Height/weight numeric inputs
4. Slider component
5. Primary goal selector

Checkpoint:

* Completion stored incrementally
* User can resume mid-flow

---

## Step 3: Diagnostic Engine

Build Order:

1. Create Supabase Edge Function
2. Send photo set to OpenAI Vision
3. Extract structured analysis JSON
4. Calculate:

   * Structural Indicators
   * Initial Execution Baseline
   * Initial Visual Trend Baseline
5. Compute Strion Index

Strion Index Formula:

* 50% Execution Integrity
* 30% Visual Trend
* 20% Structural Indicators

Checkpoint:

* Index generated server-side only
* No client exposure of formula logic

---

# Phase 3 — Core Dashboard (Week 5–6)

This is the gravitational center.

---

## 1. Strion Index Component

Build in order:

1. Large numeric display
2. Small caps label
3. Weekly trend line
4. Sparkline
5. Projected delta logic

Regression Logic:

If tasks incomplete for 3–5 days:

* Maintain composite score
* Adjust trend projection
* Show “Execution variance detected.”

Checkpoint:

* Score never drops immediately
* Trend indicator changes only

---

## 2. Daily Missions Engine

Build:

1. Fetch tasks from protocol
2. Toggle completion state
3. On completion:

   * Subtle compression animation (200–250ms)
   * Increment decimal if threshold met
4. Update execution score server-side

Checkpoint:

* No dopamine animations
* No confetti
* No streak counters

---

## 3. Phase Indicator

* Show:

  * Current Phase
  * Week of phase
* Add thin progress bar
* Compute based on Day 0 timestamp

---

## 4. Checkpoint Countdown

* Circular minimal indicator
* Auto-calculate days remaining
* Trigger recalibration flow when reached

---

# Phase 4 — Protocol Page (Week 6–7)

Build:

1. 3 phase sections
2. Collapsible weeks
3. Display only assigned tasks
4. Disable editing

Checkpoint:

* No browsing outside assignment
* Clear phase progression

---

# Phase 5 — Progress Page (Week 7–8)

---

## Timeline

* Horizontal scroll
* Day 0 → 14 → 30 → 60 → 90
* Photo thumbnails from each checkpoint

---

## Side-by-Side Comparison

Build:

1. Two dropdown selectors
2. Fixed split layout
3. Lock orientation

No flashy slider.

---

## Index Evolution Chart

Display:

* Composite
* Execution
* Visual

Muted accent.
Clear grid.
Readable at mobile width.

Checkpoint:

* Data readable in under 3 seconds
* No decorative chart effects

---

# Phase 6 — AI Assistant (Week 8–9)

Modes:

1. Protocol Mode
2. Recalibration Mode
3. Visual Review Mode

Build Steps:

1. Structured prompt templates
2. Strict tone rules (analytical)
3. No emojis
4. Store conversations in database
5. Add photo re-upload for visual review

Checkpoint:

* Responses never motivational
* Tone consistent across sessions

---

# Phase 7 — Recalibration Engine (Week 9–10)

When checkpoint reached:

1. Lock current phase
2. Request new photo set
3. Run Vision analysis
4. Compare structural deltas
5. Recalculate composite
6. Generate updated protocol

Checkpoint:

* Index change happens only here
* Visible recalibration explanation

---

# Timeline Summary

Weeks 1–2 → Infrastructure
Weeks 3–4 → Onboarding + Diagnostic
Weeks 5–6 → Dashboard Core
Weeks 6–7 → Protocol
Weeks 7–8 → Progress
Weeks 8–9 → AI Assistant
Weeks 9–10 → Recalibration

Total MVP Timeline: ~10 weeks

---

# Team Roles

**Product Lead**

* Owns Strion Index logic
* Controls tone consistency

**Frontend Engineer**

* Mobile-first UI
* Motion control
* Chart clarity

**Backend Engineer**

* Supabase schema
* Edge Functions
* RLS enforcement

**AI Systems Designer**

* Vision prompts
* Assistant tone guardrails
* Recalibration logic

---

# Recommended Rituals

* Bi-weekly 30-min usability test (3 users)
* Log top 3 confusions
* Remove one friction point per sprint
* Monthly emotional audit:

  * Does it feel punitive?
  * Does it feel hype?
  * Does it feel controlled?

---

# Optional Integrations (Post-MVP)

* Posture wearable integration
* Barber / stylist API layer
* Apple Health (hydration tracking)
* Stripe upgrade flow inside app

---

# Stretch Goals

* Predictive performance plateau modeling
* Adaptive velocity decay algorithm
* Maintenance Mode (post-90 days)
* Performance Lab (advanced metrics view)

---

Strion must feel engineered.

Not built.
