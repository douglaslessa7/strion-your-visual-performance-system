## design-guidelines.md

---

# Emotional Thesis

**Feels like reviewing elite performance metrics inside a private training facility — controlled, precise, quietly powerful.**

Inspired by restraint, not hype.
Kindness through structure — never softness. 

---

# Emotional Translation

Strion should feel:

* Athletic, not aggressive
* Analytical, not robotic
* Premium, not flashy
* Controlled, not gamified
* Calm under pressure

No dopamine theatrics.
No confetti.
No motivational warmth.

Kindness appears as:

* Forgiveness in regression
* Clarity in explanation
* Restraint in motion 

---

# Visual System

---

## Typography

**Primary Font Style:**
Clean geometric sans (Inter-style)

Tone mapping:

* Geometric sans = clarity and modern precision 

### Typographic Hierarchy

| Element           | Size    | Weight | Notes                            |
| ----------------- | ------- | ------ | -------------------------------- |
| H1 (Strion Index) | 44–56px | 700    | Tight tracking, tabular numerals |
| H2                | 22–24px | 600    | Section headers                  |
| H3                | 16–18px | 600    | Subsections                      |
| Body              | 15–16px | 400    | 1.6 line height                  |
| Caption           | 12–13px | 500    | Uppercase small caps             |

Rules:

* ≥ 1.5 line-height minimum
* Tabular numerals for all metrics
* No decorative typography
* No italics for emphasis — use weight only

---

## Color System

### Core Palette

Background:
`#0A0A0F` (RGB 10,10,15)

Surface:
`#14141C` (RGB 20,20,28)

Primary Accent:
`#2E6BFF` (RGB 46,107,255)

Positive Trend:
`#2BB673` (RGB 43,182,115)

Muted Negative Trend:
`#C77D3A` (RGB 199,125,58)

### System Logic

* Accent used only for:

  * Active elements
  * Key metrics
  * Selected navigation

* Green only for positive delta

* Amber only for projected regression

* No pure red

Contrast:

* WCAG AA+ minimum (≥ 4.5:1)
* White text slightly softened (not pure #FFFFFF)

Mood:

* Cool, restrained, analytical
* Slightly desaturated to avoid aggression

---

## Spacing & Layout

System: 8pt grid

### Spacing Rules

* Section padding: 24–32px
* Card padding: 16–20px
* Metric-to-label spacing: 4–8px
* Vertical rhythm consistent across pages

### Layout Logic

Mobile-first only.

* Single-column
* Max content width: ~420px
* Dominant element above fold (Strion Index)
* No multi-column complexity

Whitespace is structural.
Not decorative.

---

## Motion & Interaction

Kindness in motion means acknowledgment without spectacle. 

### Duration

* 200–250ms
* Ease-in-out
* No bounce
* No spring exaggeration

### Microinteractions

Task completion:

* Slight compression (scale 0.98 → 1)
* Subtle opacity shift
* Decimal tick change

Regression:

* No shake animations
* Trend arrow fades gently

Modals:

* Slide upward softly
* Background dim to 70% opacity

AI Assistant:

* Response fade-in
* No typing theatrics

---

## Voice & Tone

Emotional Keywords:

* Analytical
* Controlled
* Precise
* Structured
* Quietly aware

Never:

* Motivational
* Hype-driven
* Playful
* Judgmental

### Microcopy Examples

Onboarding:

> Accuracy determines diagnostic precision.

Success (Task Complete):

> Execution recorded.

Regression:

> Execution variance detected.

Checkpoint:

> Recalibration available.

No exclamation marks.
No emojis.

---

## System Consistency

Visual anchors:

* Data density similar to Linear
* Component discipline from shadcn/ui
* Hierarchical restraint inspired by Apple system interfaces 

Recurring patterns:

* Uppercase micro-label above metrics
* Dominant numeric centerpiece
* Collapsible structured lists
* Circular checkpoint indicator

No ornamental dividers.
Spacing replaces lines.

---

## Accessibility

* WCAG AA+ contrast enforced
* All metrics readable in grayscale
* Focus states visible (2px accent outline)
* Keyboard accessible
* Semantic headings (H1–H4 structured)
* ARIA roles for:

  * Chart components
  * Navigation
  * Modal dialogs

Color never sole indicator:

* Arrows + text reinforce trend direction

---

# Emotional Audit Checklist

For every release:

* Does this feel controlled?
* Does regression feel diagnostic?
* Is any motion distracting?
* Does AI feel analytical, not emotional?
* Would a stressed user feel judged?

If yes → revise.

---

# Technical QA Checklist

* Typography scale aligned to 8pt grid
* Contrast ≥ 4.5:1
* Motion ≤ 250ms
* Tabular numerals active
* Interactive states clearly distinguishable
* No color overuse

---

# Adaptive System Memory

Future Strion expansions must:

* Maintain dark foundation
* Keep index as gravitational center
* Avoid adding decorative gradients
* Resist feature creep that reduces clarity

If future products are built under Strion brand:
Retain the restrained palette and uppercase micro-label pattern.

---

# Design Snapshot

## Color Palette Preview

```
Background: #0A0A0F
Surface: #14141C
Accent: #2E6BFF
Positive: #2BB673
Muted Negative: #C77D3A
```

---

## Typographic Scale Summary

| Element | Size    | Weight |
| ------- | ------- | ------ |
| H1      | 44–56px | 700    |
| H2      | 22–24px | 600    |
| H3      | 16–18px | 600    |
| Body    | 15–16px | 400    |
| Caption | 12–13px | 500    |

---

## Spacing System

* 8pt base grid
* 16–20px internal padding
* 24–32px section spacing
* Single-column layout
* Max width ~420px

---

## One-Sentence Emotional Thesis

Strion feels like a controlled performance lab — data-forward, disciplined, and quietly powerful.

---

# Design Integrity Review

Strion successfully balances emotional restraint with analytical clarity. Motion acknowledges effort without spectacle. The Strion Index remains visually dominant, reinforcing system credibility.

One improvement opportunity:

Further refine the negative trend color to ensure it signals caution without implying failure — maintain diagnostic tone over emotional reaction.
