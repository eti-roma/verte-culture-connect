-- Create training progress table
CREATE TABLE IF NOT EXISTS public.training_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  module_id UUID REFERENCES public.training_modules(id) ON DELETE CASCADE,
  section_id UUID REFERENCES public.training_sections(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, module_id, section_id)
);

-- Enable RLS
ALTER TABLE public.training_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own training progress" 
ON public.training_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own training progress" 
ON public.training_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own training progress" 
ON public.training_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own training progress" 
ON public.training_progress 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_training_progress_updated_at
BEFORE UPDATE ON public.training_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();