-- Create modules table
CREATE TABLE IF NOT EXISTS public.modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  description TEXT,
  ordre INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create lecons table
CREATE TABLE IF NOT EXISTS public.lecons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  titre TEXT NOT NULL,
  contenu TEXT,
  type TEXT NOT NULL CHECK (type IN ('texte', 'video', 'pdf')),
  ordre INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lecons ENABLE ROW LEVEL SECURITY;

-- Create policies - anyone can read formation content
CREATE POLICY "Anyone can view modules" 
ON public.modules 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view lecons" 
ON public.lecons 
FOR SELECT 
USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_modules_updated_at
  BEFORE UPDATE ON public.modules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lecons_updated_at
  BEFORE UPDATE ON public.lecons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert modules
INSERT INTO public.modules (id, titre, description, ordre) VALUES 
(gen_random_uuid(), 'Introduction au Fourrage Hydroponique', 'Découvrez les bases du fourrage hydroponique et ses avantages', 1),
(gen_random_uuid(), 'Matériel et préparation', 'Apprenez à préparer votre système hydroponique', 2),
(gen_random_uuid(), 'Germination et entretien', 'Maîtrisez les techniques de germination et d''entretien', 3),
(gen_random_uuid(), 'Récolte et alimentation des animaux', 'Optimisez la récolte et l''alimentation de vos animaux', 4);