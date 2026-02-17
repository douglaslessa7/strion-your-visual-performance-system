# tasks.md — Strion Implementation Source of Truth

---

## Build Order

1. Phase 0 — System Foundations
2. Phase 1 — Authentication
3. Phase 2 — Onboarding Engine
4. Phase 3 — Core Dashboard
5. Phase 4 — Protocol Page
6. Phase 5 — Progress Page
7. Phase 6 — AI Assistant
8. Phase 7 — Recalibration Engine
9. Phase 8 — Stripe Integration (deferred)

---

# Phase 0 — System Foundations

> **Status: ✅ COMPLETE**

## 0.1 Design Tokens & Global Styles
- [x] Set background `#0A0A0F`, surface `#14141C`, accent `#2E6BFF`, positive `#2BB673`
- [x] Configure tailwind.config.ts with semantic HSL tokens
- [x] Define typography scale in index.css
- [x] Enable tabular numerals for metrics

## 0.2 Landing Page
- [x] Hero section with dashboard preview
- [x] Pillars section (Diagnose → Execute → Optimize)
- [x] Index showcase (78.6 display)
- [x] Correction section (optimization, not punishment)
- [x] Pricing section ($14/mo, trial, annual)
- [x] Navbar + Footer

## 0.3 Placeholder Pages
- [x] Dashboard (mock data)
- [x] Protocol (mock phases)
- [x] Progress (mock timeline + chart)
- [x] Login / Signup shells

---

# Phase 1 — Authentication

> **Status: 🔄 IN PROGRESS**

## 1.1 Supabase Auth Setup
- [x] Enable email + password in Supabase Auth
- [x] Create `profiles` table with auto-creation trigger
- [x] Create `user_roles` table (separate from profiles)

### SQL: Profiles Table
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  display_name TEXT,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  current_phase TEXT DEFAULT 'foundation',
  current_week INTEGER DEFAULT 1,
  protocol_start_date DATE,
  max_potential NUMERIC,
  current_index NUMERIC
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Timestamp updater
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
```

### SQL: User Roles Table
```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Auto-assign 'user' role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();
```

## 1.2 Auth UI Implementation
- [x] Wire Login.tsx to `supabase.auth.signInWithPassword()`
- [x] Wire Signup.tsx to `supabase.auth.signUp()` with `emailRedirectTo`
- [x] Add `onAuthStateChange` listener in App.tsx
- [x] Redirect: first-time → `/onboarding`, returning → `/dashboard`
- [x] Add loading states (subtle opacity shift)
- [x] Add error messages (neutral tone, no exclamation marks)
- [x] Create ProtectedRoute wrapper component

### Reference: `src/pages/Login.tsx`, `src/pages/Signup.tsx`, `src/App.tsx`

## 1.3 Session & Route Protection
- [x] Create `AuthProvider` context with session state
- [x] Guard `/dashboard`, `/protocol`, `/progress`, `/assistant`, `/profile` behind auth
- [x] Redirect unauthenticated users to `/login`
- [x] Add logout functionality

---

# Phase 2 — Onboarding Engine

> **Status: ✅ COMPLETE**

## 2.1 Photo Storage Setup
- [x] Create private `user-photos` storage bucket with RLS
- [x] Create `photo_sets` table with RLS
- [x] Storage policies for upload/view/delete own photos

## 2.2 Photo Capture UI
- [x] Create `src/components/onboarding/PhotoCapture.tsx`
- [x] 4 required + 3 optional photo grid
- [x] Squared containers, max 8px radius
- [x] Border glow state after upload (accent color)
- [x] Required counter (e.g., "3/4 required uploaded")
- [x] Upload to `user-photos/{user_id}/day-0/{angle}.ext`
- [x] Cannot proceed until 4 required photos uploaded

## 2.3 Questionnaire UI
- [x] Create `src/components/onboarding/Questionnaire.tsx`
- [x] Single-question-per-screen flow (12 questions)
- [x] Questions: height, weight, training frequency, skin concerns, beard, self-perception slider, primary goal, sleep hours, water intake, grooming frequency, hair concerns, body fat estimate
- [x] Top progress bar
- [x] Store responses in `questionnaire_responses` table

## 2.4 Diagnostic Engine (Edge Function)
- [x] Create `supabase/functions/compute-diagnostic/index.ts`
- [x] Send photo signed URLs to Lovable AI Gateway (google/gemini-2.5-pro for vision)
- [x] Extract structured JSON via tool calling: index, potential, opportunities
- [x] Compute initial Strion Index from questionnaire + AI analysis
- [x] Calculate personalized max potential range
- [x] Store results in `index_history` table
- [x] Update `profiles.current_index` and `profiles.max_potential`

## 2.5 Diagnostic Results UI
- [x] Create `src/components/onboarding/DiagnosticResults.tsx`
- [x] Large Strion Index number display
- [x] Projected 90-day range
- [x] Top 3 structural opportunities list
- [x] CTA: "Begin Foundation Phase"
- [x] Set `profiles.onboarding_completed = true`
- [x] Set `profiles.protocol_start_date = CURRENT_DATE`
- [x] Redirect to Dashboard

---

# Phase 3 — Core Dashboard

> **Status: ✅ COMPLETE**

## 3.1 Strion Index Component (Real Data)
- [x] Fetch `current_index` from profiles
- [x] Fetch recent `index_history` for sparkline
- [x] Compute weekly trend delta from index_history
- [x] Large numeric display with trend arrow
- [x] "Execution variance detected" when trend is negative

## 3.2 Daily Missions Engine

### SQL: Protocol Assignments & Daily Execution
- [x] Created `protocol_assignments` table with RLS and UNIQUE(user_id, phase, week)
- [x] Created `daily_execution` table with RLS and UNIQUE(user_id, date)

- [x] Create `supabase/functions/generate-protocol/index.ts`
  - Hybrid approach: predefined task templates + AI selection/customization
  - Uses diagnostic results to assign relevant tasks
  - Generates all 12 weeks of protocol
- [x] Fetch today's tasks from protocol_assignments
- [x] Toggle completion state → update daily_execution
- [x] Subtle compression animation (200–250ms, scale 0.98→1)
- [x] Small decimal tick on index (max +0.1 per task)
- [x] Update execution_score server-side

## 3.3 Phase Indicator (Real Data)
- [x] Compute current phase/week from `protocol_start_date`
- [x] Phase 1 (days 1–28), Phase 2 (days 29–56), Phase 3 (days 57–84)
- [x] Thin progress bar

## 3.4 Checkpoint Countdown
- [x] Calculate days to next checkpoint (14, 21, 30, 60, 90)
- [x] Minimal circular indicator
- [ ] Trigger recalibration flow when reached (Phase 7)

---

# Phase 4 — Protocol Page (Real Data)

> **Status: ✅ COMPLETE**

- [x] Fetch protocol_assignments for all phases/weeks
- [x] 3 phase sections, collapsible weeks
- [x] Display only assigned tasks (view-only)
- [x] Highlight current week
- [x] Disable editing (user executes, system calibrates)

---

# Phase 5 — Progress Page (Real Data)

> **Status: ✅ COMPLETE**

## 5.1 Timeline
- [x] Fetch photo_sets for all checkpoints
- [x] Horizontal scroll: Day 0 → 14 → 30 → 60 → 90
- [x] Photo thumbnails from private storage (signed URLs)

## 5.2 Side-by-Side Comparison
- [x] Two dropdown selectors for checkpoint dates
- [x] Fixed split layout, dark background
- [x] No flashy slider

## 5.3 Index Evolution Chart
- [x] Fetch index_history
- [x] Line chart: Composite, Execution, Visual components
- [x] Muted accent, clear grid, readable at mobile width

---

# Phase 6 — AI Assistant

> **Status: ✅ COMPLETE**

## 6.1 Edge Function
- [x] Create `supabase/functions/ai-assistant/index.ts`
- [x] Uses Lovable AI Gateway (google/gemini-3-flash-preview)
- [x] System prompt enforces analytical tone, no emojis, no motivation
- [x] 3 modes: Protocol, Recalibration, Visual Review
- [x] Streaming SSE response
- [x] Rate limit handling (429/402)

### SQL: Conversations Table
- [x] Created `assistant_conversations` table with RLS

## 6.2 Assistant UI
- [x] Create `src/pages/Assistant.tsx`
- [x] Add route `/assistant` in App.tsx
- [x] Mode selector (Protocol / Recalibration / Visual Review)
- [x] Chat interface with streaming token display
- [ ] Photo upload for Visual Review mode (deferred to Phase 7)
- [x] No typing animation theatrics — simple fade-in
- [x] Added to bottom navigation (already wired)

---

# Phase 7 — Recalibration Engine

> **Status: ✅ COMPLETE**

## 7.1 Checkpoint Detection
- [x] On dashboard load, check if checkpoint day reached
- [x] Show recalibration banner with CTA
- [x] Navigate to `/recalibration?day=X` route

## 7.2 Recalibration Edge Function
- [x] Create `supabase/functions/recalibrate/index.ts`
- [x] Run vision analysis on new photos via Lovable AI Gateway (google/gemini-2.5-pro)
- [x] Compare structural deltas with previous checkpoint photos
- [x] Recalculate Strion Index composite
- [x] Store checkpoint record in `checkpoints` table
- [x] Store new `index_history` record
- [x] Update `profiles.current_index`

### SQL: Checkpoints Table
- [x] Created `checkpoints` table with RLS (user_id FK to auth.users with ON DELETE CASCADE)
- [x] UNIQUE(user_id, checkpoint_day)
- [x] SELECT, INSERT, UPDATE policies for owner access

## 7.3 Recalibration UI
- [x] Checkpoint notification banner on dashboard
- [x] Photo re-upload flow (reuses photo grid pattern from onboarding)
- [x] Processing state with spinner
- [x] Recalibration results screen with index delta display
- [x] Structural observations list
- [x] Return to dashboard CTA

---

# Phase 8 — Stripe Integration (Deferred)

> **Status: ⬜ DEFERRED**

- [ ] Enable Stripe connector
- [ ] Create products: trial, monthly ($14), annual
- [ ] Webhook edge function for subscription events
- [ ] Gate dashboard behind active subscription
- [ ] Trial expiration handling
- [ ] Profile page: subscription management

---

# Phase 9 — Profile Page

> **Status: ⬜ NOT STARTED**

- [ ] Create `src/pages/Profile.tsx`
- [ ] Add route `/profile` in App.tsx
- [ ] Subscription status display
- [ ] Potential range visibility
- [ ] Data & photo privacy controls
- [ ] Account deletion (with confirmation)
- [ ] Logout button
- [ ] No vanity statistics

---

# Cross-Cutting Concerns

## Performance
- [ ] Route-based code splitting (React.lazy)
- [ ] Lazy load charts (recharts)
- [ ] Debounce AI calls
- [ ] Initial load < 3s
- [ ] Lighthouse > 90

## SEO (Landing Page Only)
- [ ] Title tag < 60 chars
- [ ] Meta description < 160 chars
- [ ] Single H1
- [ ] Semantic HTML
- [ ] JSON-LD for product

## Accessibility
- [ ] WCAG AA+ contrast (≥ 4.5:1)
- [ ] Focus states (2px accent outline)
- [ ] ARIA roles for charts, nav, modals
- [ ] Color never sole indicator (arrows + text for trends)

---

# Implementation Notes

- **AI Provider**: Lovable AI Gateway (LOVABLE_API_KEY already provisioned)
  - Vision: `google/gemini-2.5-pro` (photo diagnostics)
  - Assistant: `google/gemini-3-flash-preview` (chat)
- **Protocol**: Hybrid — predefined templates + AI selection/customization
- **Diagnostics**: Photos uploaded + stored from day one; index uses both questionnaire + AI vision analysis
- **Stripe**: Deferred until core loop complete
- **All index computation**: Server-side only (edge functions)
- **Photos**: Private bucket, signed URLs, never publicly accessible
