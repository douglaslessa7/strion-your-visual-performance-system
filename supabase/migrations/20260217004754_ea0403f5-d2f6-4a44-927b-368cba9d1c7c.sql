
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
  ON public.checkpoints FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checkpoints"
  ON public.checkpoints FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own checkpoints"
  ON public.checkpoints FOR UPDATE
  USING (auth.uid() = user_id);
