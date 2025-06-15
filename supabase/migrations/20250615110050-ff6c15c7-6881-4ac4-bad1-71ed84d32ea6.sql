
-- Table pour les modules de formation
CREATE TABLE public.training_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les sections de formation
CREATE TABLE public.training_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES public.training_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les ressources de formation (vidéos, PDFs, etc.)
CREATE TABLE public.training_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID REFERENCES public.training_sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('video', 'pdf', 'image', 'text')),
  url TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les producteurs
CREATE TABLE public.producers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  region TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  speciality TEXT,
  experience_years INTEGER,
  description TEXT,
  equipment TEXT[],
  rating DECIMAL(3, 2) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les analyses IA de photos
CREATE TABLE public.photo_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  image_url TEXT NOT NULL,
  analysis_result JSONB,
  health_score INTEGER CHECK (health_score >= 0 AND health_score <= 100),
  recommendations TEXT[],
  issues_detected TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les posts de la communauté
CREATE TABLE public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  title TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  tags TEXT[],
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les commentaires
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les likes
CREATE TABLE public.likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Table pour les paramètres de culture
CREATE TABLE public.culture_parameters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  culture_name TEXT NOT NULL,
  temperature DECIMAL(5, 2),
  humidity DECIMAL(5, 2),
  light_intensity DECIMAL(8, 2),
  ph_level DECIMAL(4, 2),
  conductivity DECIMAL(8, 2),
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les maladies et ravageurs
CREATE TABLE public.diseases_pests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('disease', 'pest')),
  description TEXT,
  symptoms TEXT[],
  causes TEXT[],
  treatments TEXT[],
  prevention_tips TEXT[],
  image_url TEXT,
  severity_level INTEGER CHECK (severity_level >= 1 AND severity_level <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les signalements de problèmes
CREATE TABLE public.problem_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  disease_pest_id UUID REFERENCES public.diseases_pests(id),
  description TEXT NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'resolved')),
  expert_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ajout des politiques RLS
ALTER TABLE public.training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.producers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.culture_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diseases_pests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_reports ENABLE ROW LEVEL SECURITY;

-- Politiques pour les modules de formation (lecture publique)
CREATE POLICY "Anyone can view training modules" ON public.training_modules FOR SELECT USING (true);
CREATE POLICY "Anyone can view training sections" ON public.training_sections FOR SELECT USING (true);
CREATE POLICY "Anyone can view training resources" ON public.training_resources FOR SELECT USING (true);

-- Politiques pour les producteurs (lecture publique, modification par propriétaire)
CREATE POLICY "Anyone can view producers" ON public.producers FOR SELECT USING (true);
CREATE POLICY "Users can insert their producer profile" ON public.producers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their producer profile" ON public.producers FOR UPDATE USING (auth.uid() = user_id);

-- Politiques pour les analyses photos (utilisateur propriétaire uniquement)
CREATE POLICY "Users can view their photo analyses" ON public.photo_analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create photo analyses" ON public.photo_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques pour la communauté (lecture publique, modification par propriétaire)
CREATE POLICY "Anyone can view community posts" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their posts" ON public.community_posts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view likes" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like posts" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their likes" ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour les paramètres de culture (utilisateur propriétaire uniquement)
CREATE POLICY "Users can view their culture parameters" ON public.culture_parameters FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create culture parameters" ON public.culture_parameters FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques pour les maladies et ravageurs (lecture publique)
CREATE POLICY "Anyone can view diseases and pests" ON public.diseases_pests FOR SELECT USING (true);

-- Politiques pour les signalements (utilisateur propriétaire uniquement)
CREATE POLICY "Users can view their problem reports" ON public.problem_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create problem reports" ON public.problem_reports FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insertion de données de base pour la formation
INSERT INTO public.training_modules (title, description, order_index) VALUES
('Physiologie des plantes', 'Comprendre le fonctionnement des plantes en hydroponie', 1),
('Formulation des solutions nutritives', 'Apprendre à préparer les solutions nutritives optimales', 2),
('Gestion de l''environnement', 'Maîtriser lumière, température et humidité', 3),
('Prévention et lutte contre les maladies', 'Identifier et traiter les problèmes sanitaires', 4),
('De la germination à la récolte', 'Suivre tout le cycle de production', 5);

-- Insertion de données de base pour les maladies et ravageurs
INSERT INTO public.diseases_pests (name, type, description, symptoms, causes, treatments, prevention_tips, severity_level) VALUES
('Pourriture des racines', 'disease', 'Maladie fongique affectant le système racinaire', ARRAY['Racines brunes', 'Croissance ralentie', 'Flétrissement'], ARRAY['Excès d''humidité', 'Mauvaise aération', 'Température élevée'], ARRAY['Réduire l''arrosage', 'Améliorer la ventilation', 'Traitement fongicide'], ARRAY['Contrôler l''humidité', 'Assurer une bonne aération', 'Surveiller la température'], 4),
('Pucerons', 'pest', 'Petits insectes suceurs de sève', ARRAY['Feuilles jaunies', 'Croissance déformée', 'Miellat collant'], ARRAY['Conditions chaudes et humides', 'Plantes stressées'], ARRAY['Savon insecticide', 'Huile de neem', 'Auxiliaires biologiques'], ARRAY['Surveiller régulièrement', 'Maintenir l''hygiène', 'Éviter l''excès d''azote'], 3),
('Mildiou', 'disease', 'Maladie cryptogamique des feuilles', ARRAY['Taches jaunes sur feuilles', 'Duvet blanchâtre', 'Défoliation'], ARRAY['Humidité élevée', 'Mauvaise circulation d''air'], ARRAY['Fongicides cupriques', 'Améliorer la ventilation'], ARRAY['Réduire l''humidité', 'Espacer les plants', 'Ventiler'], 4);
