-- Fix the training modules table by adding missing columns
ALTER TABLE public.training_modules 
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 0;

-- Add foreign key constraint for training_sections if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'training_sections_module_id_fkey'
    ) THEN
        ALTER TABLE public.training_sections 
        ADD CONSTRAINT training_sections_module_id_fkey 
        FOREIGN KEY (module_id) REFERENCES public.training_modules(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Update training_progress table to have proper foreign key constraints
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'training_progress_module_id_fkey'
    ) THEN
        ALTER TABLE public.training_progress 
        ADD CONSTRAINT training_progress_module_id_fkey 
        FOREIGN KEY (module_id) REFERENCES public.training_modules(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'training_progress_section_id_fkey'
    ) THEN
        ALTER TABLE public.training_progress 
        ADD CONSTRAINT training_progress_section_id_fkey 
        FOREIGN KEY (section_id) REFERENCES public.training_sections(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'training_progress_user_module_section_unique'
    ) THEN
        ALTER TABLE public.training_progress 
        ADD CONSTRAINT training_progress_user_module_section_unique 
        UNIQUE(user_id, module_id, section_id);
    END IF;
END $$;

-- Update existing training modules
UPDATE public.training_modules SET
  duration_minutes = CASE 
    WHEN title = 'Fondamentaux du Fourrage Hydroponique' THEN 45
    WHEN title = 'Installation et Configuration' THEN 60
    WHEN title = 'Cycle de Production Complet' THEN 90
    WHEN title = 'Résolution de Problèmes' THEN 30
    ELSE 30
  END
WHERE duration_minutes = 0 OR duration_minutes IS NULL;

-- Insert sample sections for remaining modules if they don't exist
INSERT INTO public.training_sections (module_id, title, content, order_index) 
SELECT 
  tm.id,
  unnest(ARRAY['Préparation de l''espace', 'Installation du système d''irrigation', 'Configuration de l''éclairage', 'Mise en place du contrôle climatique']),
  unnest(ARRAY['Choisir et préparer l''espace de culture', 'Installer et configurer le système d''arrosage', 'Régler l''éclairage pour optimiser la croissance', 'Contrôler température et humidité']),
  generate_series(1, 4)
FROM public.training_modules tm 
WHERE tm.title = 'Installation et Configuration'
AND NOT EXISTS (
  SELECT 1 FROM public.training_sections ts 
  WHERE ts.module_id = tm.id
);

INSERT INTO public.training_sections (module_id, title, content, order_index) 
SELECT 
  tm.id,
  unnest(ARRAY['Semis et germination', 'Gestion des nutriments', 'Suivi quotidien', 'Récolte et post-récolte']),
  unnest(ARRAY['Techniques de semis et conditions de germination', 'Préparer et ajuster les solutions nutritives', 'Surveiller et optimiser la croissance', 'Récolter au bon moment et conserver']),
  generate_series(1, 4)
FROM public.training_modules tm 
WHERE tm.title = 'Cycle de Production Complet'
AND NOT EXISTS (
  SELECT 1 FROM public.training_sections ts 
  WHERE ts.module_id = tm.id
);

INSERT INTO public.training_sections (module_id, title, content, order_index) 
SELECT 
  tm.id,
  unnest(ARRAY['Maladies et parasites', 'Problèmes nutritionnels', 'Défaillances techniques']),
  unnest(ARRAY['Identifier et traiter les maladies courantes', 'Diagnostiquer et corriger les carences', 'Résoudre les pannes d''équipement']),
  generate_series(1, 3)
FROM public.training_modules tm 
WHERE tm.title = 'Résolution de Problèmes'
AND NOT EXISTS (
  SELECT 1 FROM public.training_sections ts 
  WHERE ts.module_id = tm.id
);