
-- Create formation table for storing training courses
CREATE TABLE public.formation (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  module TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.formation ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view formation courses (public content)
CREATE POLICY "Anyone can view formation courses" 
  ON public.formation 
  FOR SELECT 
  USING (true);

-- Insert the formation data
INSERT INTO formation (title, description, url, module)
VALUES
('Physiologie végétale appliquée', 'Cours complet sur la physiologie des plantes fourragères.', 'https://campus-numerique.univ-lorraine.fr/course/view.php?id=1805', 'Physiologie'),
('Croissance et développement des plantes', 'Document INRAE sur la croissance et le développement des plantes.', 'https://hal.inrae.fr/hal-01801332/document', 'Physiologie'),
('Guide de production du fourrage hydroponique', 'FAO, PDF complet, germination et techniques de culture.', 'https://www.fao.org/3/i8169f/i8169f.pdf', 'Germination'),
('Germination en hydroponie', 'Explications sur la germination hydroponique.', 'https://www.hydroponique.fr/germination-en-hydroponie/', 'Germination'),
('Nutrition minérale des plantes', 'Support de cours AgroSup Dijon.', 'https://www.supagro.fr/coursenligne/ressources/U_2015_16/UE_RU_DIAT_Nutrition_minerale.pdf', 'Nutrition'),
('Fertilisation en hydroponie', 'Guide du ministère de l''Agriculture.', 'https://agriculture.gouv.fr/fertilisation-en-hydroponie-guide-technique', 'Nutrition'),
('Maîtrise du climat sous abri et serres', 'INRAE, gestion du climat pour hydroponie.', 'https://hal.inrae.fr/hal-03327414/document', 'Environnement'),
('Contrôle climatique en hydroponie', 'Guide pratique sur le contrôle du climat.', 'https://www.maximumyield.com/how-to-monitor-and-maintain-your-hydroponic-system/2/1947', 'Environnement'),
('Lutte intégrée en hydroponie', 'Guide INRAE sur la gestion intégrée.', 'https://hal.inrae.fr/hal-03196239/document', 'Maladies'),
('Gestion sanitaire cultures hors-sol', 'Fiches pratiques sur la gestion sanitaire.', 'https://hal.inrae.fr/hal-01562244/document', 'Maladies');
