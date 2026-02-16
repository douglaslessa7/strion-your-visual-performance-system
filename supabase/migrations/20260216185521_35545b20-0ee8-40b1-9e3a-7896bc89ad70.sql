
-- =============================================
-- Phase 2: Onboarding Engine — Storage & Tables
-- =============================================

-- 1. Storage bucket for user photos (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-photos', 'user-photos', false);

-- Storage RLS policies
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

-- 2. Photo sets table
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

CREATE POLICY "Users can view own photo sets"
  ON public.photo_sets FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own photo sets"
  ON public.photo_sets FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own photo sets"
  ON public.photo_sets FOR UPDATE USING (auth.uid() = user_id);

-- 3. Questionnaire responses table
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

-- 4. Index history table
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
