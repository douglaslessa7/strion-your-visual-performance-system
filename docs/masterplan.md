## masterplan.md

---

## 30-Second Elevator Pitch

Strion is a mobile-first visual performance monitoring system for men 18–30.

It analyzes appearance through AI photo diagnostics, assigns a structured 90-day protocol, and tracks daily execution through a proprietary Strion Index.

No hype. No streak addiction.

Just controlled, measurable optimization.

---

## Problem & Mission

### The Problem

* Young men consume endless appearance advice.
* No unified system measures visual performance objectively.
* Most tools are motivational, not structural.
* Progress feels subjective and inconsistent.

### The Mission

Give users control through structure.

Strion replaces guesswork with:

* Diagnostic clarity
* Measurable execution
* Scheduled recalibration
* Long-term optimization

Strion diagnoses. It does not punish.

---

## Target Audience

**Primary User**

* Men 18–30 (U.S.)
* Appearance-conscious
* Digitally native
* Performance-driven
* Skeptical of influencer energy

**Psychographic Traits**

* Tracks fitness metrics
* Values structure
* Wants control, not validation
* Prefers calm precision over hype

---

## Core Features

### 1. AI Photo Diagnostic

* Multi-angle uploads
* Vision analysis (posture, symmetry, grooming)
* Structural opportunity detection
* Personalized performance range

### 2. Strion Index (Primary Metric)

* Weighted composite score
* Slow, controlled change
* Trend-based regression model
* No streak penalties

### 3. 90-Day Protocol

* 3 structured phases:

  * Foundation (Weeks 1–4)
  * Structure (Weeks 5–8)
  * Refinement (Weeks 9–12)
* Personalized task assignment
* No open content library

### 4. Daily Missions

* 4–6 execution tasks
* Subtle index movement
* No gamified theatrics

### 5. Checkpoints (14 / 21 / 30 / 60 / 90)

* Structured recalibration only
* Photo re-analysis
* Protocol adjustments

### 6. AI Assistant

* Analytical tone
* 3 modes:

  * Protocol Mode
  * Recalibration Mode
  * Visual Review Mode
* No motivational coaching

### 7. Progress System

* Timeline view
* Side-by-side comparison
* Index evolution chart

---

## High-Level Tech Stack

### Frontend

Lovable (React + Tailwind + shadcn/ui)

Why:

* Fast iteration
* Controlled component system
* Consistent design language

### Backend

Supabase (PostgreSQL)

* Auth
* Storage (private photo buckets)
* Row-Level Security
* Edge Functions for scoring engine

Why:

* Secure data separation
* Clean subscription + AI integration
* Scales with structured growth

### AI

OpenAI API (Vision + GPT-4)

Why:

* Photo diagnostics
* Structured textual analysis
* Analytical assistant responses

### Payments

Stripe subscriptions

Why:

* Clean recurring billing
* 7-day trial handling
* Mobile subscription control

### Deployment

Lovable Cloud

Why:

* Tight integration
* Controlled environment

---

## Conceptual Data Model (ERD in Words)

**User**

* id
* email
* subscription_status
* potential_range_min
* potential_range_max

**Photo_Set**

* user_id
* checkpoint_tag (Day 0, 14, 30…)
* image_urls
* structural_metrics_json

**Strion_Index_Record**

* user_id
* date
* execution_score
* visual_score
* structural_score
* composite_score

**Protocol**

* user_id
* phase
* week
* assigned_tasks

**Task**

* protocol_id
* task_name
* completion_status
* timestamp

**Checkpoint**

* user_id
* checkpoint_date
* recalibration_notes
* updated_protocol

---

## UI Design Principles (Krug-Aligned)

### Don’t Make Me Think

* One dominant metric per screen
* Uppercase micro-labels for clarity
* No decorative noise
* No motivational copy

### Self-Evident System

If regression occurs:
“Execution variance detected.”
Clear cause. No ambiguity.

### Three Mindless Clicks Rule

Example:
Upload photo → Confirm angle → Done.

Never:
Upload → Crop → Tag → Confirm → Rate lighting → Confirm.

---

## Security & Compliance Notes

* Private photo storage (Supabase buckets)
* Row-Level Security enabled
* Server-side Strion Index calculation
* No client-side scoring exposure
* Encrypted transmission (HTTPS)
* Clear consent for AI photo analysis
* No resale of biometric data

Future:

* SOC2 readiness
* Data deletion control per user request

---

## Phased Roadmap

### MVP (0–3 Months)

* Auth
* Onboarding diagnostic
* Basic Strion Index
* 90-day protocol generation
* Daily missions
* Manual checkpoints
* Stripe billing

### V1

* AI-powered visual trend refinement
* Side-by-side comparison tool
* Enhanced regression modeling
* Improved sparkline analytics

### V2

* Advanced structural modeling
* Adaptive protocol auto-adjustments
* Maintenance mode transition
* Personal max potential modeling refinement

---

## Risks & Mitigations

### Risk: Users Expect Rapid Score Growth

Mitigation:

* Communicate velocity slowdown near potential ceiling.
* Reinforce structural recalibration logic.

### Risk: Perceived Punishment

Mitigation:

* Trend-based soft regression.
* No immediate index drops.

### Risk: Privacy Concerns

Mitigation:

* Clear storage messaging.
* Explicit AI processing explanation.

### Risk: AI Overreach Tone

Mitigation:

* Strict analytical voice framework.
* No emotional coaching language.

---

## Future Expansion Ideas

* Wearable integration (posture tracking)
* Barber / grooming professional portal
* In-person checkpoint partnerships
* Maintenance subscription tier
* Performance lab analytics mode
* Advanced male aesthetic modeling dataset refinement

---

Strion is not an app.

It is a structured control system.
