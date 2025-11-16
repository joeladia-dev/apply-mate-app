-- Optimize RLS performance by replacing auth.uid() with subquery
-- This prevents re-evaluation for each row at scale

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own jobs" ON public.jobs;
DROP POLICY IF EXISTS "Users can create their own jobs" ON public.jobs;
DROP POLICY IF EXISTS "Users can update their own jobs" ON public.jobs;
DROP POLICY IF EXISTS "Users can delete their own jobs" ON public.jobs;

-- Recreate policies with optimized auth.uid() usage
CREATE POLICY "Users can view their own jobs"
  ON public.jobs
  FOR SELECT
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create their own jobs"
  ON public.jobs
  FOR INSERT
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own jobs"
  ON public.jobs
  FOR UPDATE
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete their own jobs"
  ON public.jobs
  FOR DELETE
  USING (user_id = (select auth.uid()));
