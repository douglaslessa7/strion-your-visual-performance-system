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
- [ ] Redirect: first-time → `/onboarding`, returning → `/dashboard`
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

> **Status: ⬜ NOT STARTED**

## 2.1 Photo Storage Setup

### SQL: Storage Bucket
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-photos', 'user-photos', false);

CREATE POLICY "Users can upload own photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'user-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'user-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'user-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

### SQL: Photo Sets Table
```sql
CREATE TABLE public.photo_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checkpoint_day INTEGER NOT NULL DEFAULT 0,
  selfie_front_url TEXT,
  selfie_side_url TEXT,
  body_front_url TEXT,
  body_side_url TEXT,
  body_back_url TEXT,
  selfie_side_alt_url TEXT,
  body_side_alt_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.photo_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own photos"
  ON public.photo_sets FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own photos"
  ON public.photo_sets FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own photos"
  ON public.photo_sets FOR UPDATE USING (auth.uid() = user_id);
```

## 2.2 Photo Capture UI
- [ ] Create `src/pages/Onboarding.tsx` with step management
- [ ] Step 1: Photo upload grid (4 required + 3 optional)
- [ ] Squared containers, max 8px radius
- [ ] Border glow state after upload (accent color)
- [ ] Required counter (e.g., "3/4 required uploaded")
- [ ] Upload to `user-photos/{user_id}/day-{checkpoint}/{angle}.jpg`
- [ ] Cannot proceed until 4 required photos uploaded

## 2.3 Questionnaire UI
- [ ] Step 2: Single-question-per-screen flow
- [ ] Questions: height, weight, training frequency, skin concerns, beard (y/n), self-perception slider, primary goal, sleep hours, water intake, grooming frequency, hair concerns, body fat estimate
- [ ] Top progress bar
- [ ] Measured pacing (no overwhelming forms)
- [ ] Store responses in `profiles.settings` JSONB or dedicated table

### SQL: Questionnaire Responses
```sql
CREATE TABLE public.questionnaire_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checkpoint_day INTEGER NOT NULL DEFAULT 0,
  responses JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, checkpoint_day)
);

ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own responses"
  ON public.questionnaire_responses FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own responses"
  ON public.questionnaire_responses FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own responses"
  ON public.questionnaire_responses FOR UPDATE USING (auth.uid() = user_id);
```

## 2.4 Diagnostic Engine (Edge Function)
- [ ] Create `supabase/functions/compute-diagnostic/index.ts`
- [ ] Send photo URLs to Lovable AI Gateway (google/gemini-2.5-pro for vision)
- [ ] Extract structured JSON: posture, symmetry, grooming, skin, structure
- [ ] Compute initial Strion Index from questionnaire + AI analysis
- [ ] Calculate personalized max potential range (85–90 typical)
- [ ] Store results in `index_history` table
- [ ] Update `profiles.current_index` and `profiles.max_potential`

### SQL: Index History Table
```sql
CREATE TABLE public.index_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  index_value NUMERIC NOT NULL,
  execution_component NUMERIC NOT NULL DEFAULT 0,
  visual_component NUMERIC NOT NULL DEFAULT 0,
  structural_component NUMERIC NOT NULL DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.index_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own index history"
  ON public.index_history FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own index history"
  ON public.index_history FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## 2.5 Diagnostic Results UI
- [ ] Step 3: Full-screen results display
- [ ] Large Strion Index number (e.g., 63.4)
- [ ] Projected 90-day range (e.g., 78.0 – 82.5)
- [ ] Top 3 structural opportunities list
- [ ] CTA: "Begin Foundation Phase"
- [ ] Set `profiles.onboarding_completed = true`
- [ ] Set `profiles.protocol_start_date = CURRENT_DATE`
- [ ] Redirect to Dashboard

---

# Phase 3 — Core Dashboard

> **Status: ⬜ NOT STARTED** (mock exists, needs real data)

## 3.1 Strion Index Component (Real Data)
- [ ] Fetch `current_index` from profiles
- [ ] Fetch recent `index_history` for sparkline
- [ ] Compute weekly trend delta from index_history
- [ ] Large numeric display with trend arrow
- [ ] "Execution variance detected" when trend is negative

## 3.2 Daily Missions Engine

### SQL: Protocol Assignments & Daily Execution
```sql
CREATE TABLE public.protocol_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phase TEXT NOT NULL,
  week INTEGER NOT NULL,
  tasks JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, phase, week)
);

ALTER TABLE public.protocol_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assignments"
  ON public.protocol_assignments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assignments"
  ON public.protocol_assignments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.daily_execution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed_tasks JSONB NOT NULL DEFAULT '[]',
  execution_score NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE public.daily_execution ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own execution"
  ON public.daily_execution FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own execution"
  ON public.daily_execution FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own execution"
  ON public.daily_execution FOR UPDATE USING (auth.uid() = user_id);
```

- [ ] Create `supabase/functions/generate-protocol/index.ts`
  - Hybrid approach: predefined task templates + AI selection/customization
  - Uses diagnostic results to assign relevant tasks
  - Generates all 12 weeks of protocol
- [ ] Fetch today's tasks from protocol_assignments
- [ ] Toggle completion state → update daily_execution
- [ ] Subtle compression animation (200–250ms, scale 0.98→1)
- [ ] Small decimal tick on index (max +0.1 per task)
- [ ] Update execution_score server-side

## 3.3 Phase Indicator (Real Data)
- [ ] Compute current phase/week from `protocol_start_date`
- [ ] Phase 1 (days 1–28), Phase 2 (days 29–56), Phase 3 (days 57–84)
- [ ] Thin progress bar

## 3.4 Checkpoint Countdown
- [ ] Calculate days to next checkpoint (14, 21, 30, 60, 90)
- [ ] Minimal circular indicator
- [ ] Trigger recalibration flow when reached

---

# Phase 4 — Protocol Page (Real Data)

> **Status: ⬜ NOT STARTED** (mock exists)

- [ ] Fetch protocol_assignments for all phases/weeks
- [ ] 3 phase sections, collapsible weeks
- [ ] Display only assigned tasks (view-only)
- [ ] Highlight current week
- [ ] Disable editing (user executes, system calibrates)

---

# Phase 5 — Progress Page (Real Data)

> **Status: ⬜ NOT STARTED** (mock exists)

## 5.1 Timeline
- [ ] Fetch photo_sets for all checkpoints
- [ ] Horizontal scroll: Day 0 → 14 → 30 → 60 → 90
- [ ] Photo thumbnails from private storage (signed URLs)

## 5.2 Side-by-Side Comparison
- [ ] Two dropdown selectors for checkpoint dates
- [ ] Fixed split layout, dark background
- [ ] No flashy slider

## 5.3 Index Evolution Chart
- [ ] Fetch index_history
- [ ] Line chart: Composite, Execution, Visual components
- [ ] Muted accent, clear grid, readable at mobile width

---

# Phase 6 — AI Assistant

> **Status: ⬜ NOT STARTED**

## 6.1 Edge Function
- [ ] Create `supabase/functions/ai-assistant/index.ts`
- [ ] Uses Lovable AI Gateway (google/gemini-3-flash-preview)
- [ ] System prompt enforces analytical tone, no emojis, no motivation
- [ ] 3 modes: Protocol, Recalibration, Visual Review
- [ ] Streaming SSE response
- [ ] Rate limit handling (429/402)

### SQL: Conversations Table
```sql
CREATE TABLE public.assistant_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL DEFAULT 'protocol',
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.assistant_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations"
  ON public.assistant_conversations FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON public.assistant_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON public.assistant_conversations FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.assistant_conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
```

## 6.2 Assistant UI
- [ ] Create `src/pages/Assistant.tsx`
- [ ] Add route `/assistant` in App.tsx
- [ ] Mode selector (Protocol / Recalibration / Visual Review)
- [ ] Chat interface with streaming token display
- [ ] Photo upload for Visual Review mode
- [ ] No typing animation theatrics — simple fade-in
- [ ] Add to bottom navigation

---

# Phase 7 — Recalibration Engine

> **Status: ⬜ NOT STARTED**

## 7.1 Checkpoint Detection
- [ ] On dashboard load, check if checkpoint day reached
- [ ] Lock current phase tasks
- [ ] Prompt for new photo set upload

## 7.2 Recalibration Edge Function
- [ ] Create `supabase/functions/recalibrate/index.ts`
- [ ] Run vision analysis on new photos
- [ ] Compare structural deltas with previous checkpoint
- [ ] Recalculate Strion Index composite
- [ ] Generate updated protocol for next phase
- [ ] Store new index_history record

### SQL: Checkpoints Table
```sql
CREATE TABLE public.checkpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checkpoint_day INTEGER NOT NULL,
  photo_set_id UUID REFERENCES public.photo_sets(id),
  previous_index NUMERIC,
  new_index NUMERIC,
  recalibration_notes JSONB DEFAULT '{}',
  protocol_updates JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, checkpoint_day)
);

ALTER TABLE public.checkpoints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own checkpoints"
  ON public.checkpoints FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checkpoints"
  ON public.checkpoints FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## 7.3 Recalibration UI
- [ ] Checkpoint notification on dashboard
- [ ] Photo re-upload flow (reuse onboarding photo grid)
- [ ] Recalibration results screen
- [ ] Visible explanation of index change
- [ ] Updated protocol display

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
