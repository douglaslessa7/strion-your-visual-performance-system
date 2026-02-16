-- Create protocol_assignments table
CREATE TABLE public.protocol_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phase TEXT NOT NULL DEFAULT 'foundation',
  week INTEGER NOT NULL DEFAULT 1,
  tasks JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, phase, week)
);

ALTER TABLE public.protocol_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assignments"
  ON public.protocol_assignments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assignments"
  ON public.protocol_assignments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assignments"
  ON public.protocol_assignments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_protocol_assignments_updated_at
  BEFORE UPDATE ON public.protocol_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Create daily_execution table
CREATE TABLE public.daily_execution (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed_tasks JSONB NOT NULL DEFAULT '[]'::jsonb,
  execution_score NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE public.daily_execution ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own execution"
  ON public.daily_execution FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own execution"
  ON public.daily_execution FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own execution"
  ON public.daily_execution FOR UPDATE
  USING (auth.uid() = user_id);