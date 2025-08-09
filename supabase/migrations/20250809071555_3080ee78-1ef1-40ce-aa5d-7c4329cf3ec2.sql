-- Create training system tables for course tracking

-- Training modules table
CREATE TABLE IF NOT EXISTS public.training_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Training sections table (lessons within modules)
CREATE TABLE IF NOT EXISTS public.training_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES public.training_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  order_index INTEGER DEFAULT 0,
  duration_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Training resources table (additional materials)
CREATE TABLE IF NOT EXISTS public.training_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID NOT NULL REFERENCES public.training_sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  resource_type TEXT DEFAULT 'link' CHECK (resource_type IN ('link', 'pdf', 'video', 'document')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User training progress table
CREATE TABLE IF NOT EXISTS public.training_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  module_id UUID NOT NULL REFERENCES public.training_modules(id) ON DELETE CASCADE,
  section_id UUID REFERENCES public.training_sections(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id, section_id)
);

-- Enable Row Level Security
ALTER TABLE public.training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for training_modules (public read)
CREATE POLICY "Training modules are viewable by everyone" 
ON public.training_modules 
FOR SELECT 
USING (status = 'active');

-- RLS Policies for training_sections (public read)
CREATE POLICY "Training sections are viewable by everyone" 
ON public.training_sections 
FOR SELECT 
USING (true);

-- RLS Policies for training_resources (public read)
CREATE POLICY "Training resources are viewable by everyone" 
ON public.training_resources 
FOR SELECT 
USING (true);

-- RLS Policies for training_progress (user-specific)
CREATE POLICY "Users can view their own training progress" 
ON public.training_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own training progress" 
ON public.training_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own training progress" 
ON public.training_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_training_modules_updated_at
BEFORE UPDATE ON public.training_modules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_training_sections_updated_at
BEFORE UPDATE ON public.training_sections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_training_progress_updated_at
BEFORE UPDATE ON public.training_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample training modules
INSERT INTO public.training_modules (title, description, duration_minutes, order_index) VALUES
('Fondamentaux du Fourrage Hydroponique', 'Découvrez les principes de base de la culture hydroponique', 45, 1),
('Installation et Configuration', 'Apprenez à installer votre système de production', 60, 2),
('Cycle de Production Complet', 'Maîtrisez tous les aspects de la production', 90, 3),
('Résolution de Problèmes', 'Identifiez et résolvez les problèmes courants', 30, 4);

-- Insert sample sections for first module
INSERT INTO public.training_sections (module_id, title, content, order_index, duration_minutes) 
SELECT 
  tm.id,
  unnest(ARRAY['Introduction à l''hydroponie', 'Choix des graines et variétés', 'Équipement nécessaire', 'Conditions environnementales']),
  unnest(ARRAY['Comprendre les bases de la culture sans sol', 'Sélectionner les bonnes variétés pour votre production', 'Liste complète du matériel requis', 'Optimiser température, humidité et éclairage']),
  generate_series(1, 4),
  unnest(ARRAY[10, 12, 15, 8])
FROM public.training_modules tm 
WHERE tm.title = 'Fondamentaux du Fourrage Hydroponique';