-- Add notes column to jobs table
ALTER TABLE public.jobs
ADD COLUMN notes TEXT;
