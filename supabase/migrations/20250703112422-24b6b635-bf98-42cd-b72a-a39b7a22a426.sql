
-- Créer les tables manquantes pour le contenu de formation
CREATE TABLE IF NOT EXISTS public.training_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  module_id UUID REFERENCES training_modules(id) NOT NULL,
  section_id UUID REFERENCES training_sections(id),
  progress_percentage INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id, section_id)
);

-- Créer table pour les quiz
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES training_modules(id) NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer table pour les réponses aux quiz
CREATE TABLE IF NOT EXISTS public.quiz_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  question_id UUID REFERENCES quiz_questions(id) NOT NULL,
  selected_answer INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer table pour les notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insérer du contenu de formation réel
INSERT INTO public.training_modules (title, description, order_index) VALUES
('Les Bases de l''Hydroponie', 'Comprendre les principes fondamentaux de la culture hydroponique', 1),
('Gestion du pH et de la Nutrition', 'Optimiser les paramètres nutritionnels pour une croissance optimale', 2),
('Éclairage et Photopériode', 'Maîtriser l''éclairage artificiel et les cycles lumineux', 3),
('Maladies et Prévention', 'Identifier, traiter et prévenir les problèmes de culture', 4);

-- Insérer les sections de formation
INSERT INTO public.training_sections (module_id, title, content, order_index) 
SELECT m.id, s.title, s.content, s.order_index
FROM training_modules m
CROSS JOIN (VALUES
  ('Introduction à l''hydroponie', 'L''hydroponie est une méthode de culture sans sol qui utilise une solution nutritive pour nourrir les plantes. Cette technique permet un contrôle précis des nutriments et un rendement supérieur.', 1),
  ('Types de systèmes hydroponiques', 'Il existe plusieurs systèmes : NFT (Nutrient Film Technique), DWC (Deep Water Culture), Ebb and Flow, et Drip Systems. Chaque système a ses avantages selon le type de culture.', 2),
  ('Équipements nécessaires', 'Pour débuter : bacs de culture, pompes, tuyaux, substrats (laine de roche, perlite), pH-mètre, EC-mètre, et éclairage LED.', 3)
) s(title, content, order_index)
WHERE m.title = 'Les Bases de l''Hydroponie';

-- Insérer des questions de quiz
INSERT INTO public.quiz_questions (module_id, question, options, correct_answer, explanation)
SELECT m.id, q.question, q.options, q.correct_answer, q.explanation
FROM training_modules m
CROSS JOIN (VALUES
  ('Quel est le pH optimal pour la plupart des cultures hydroponiques ?', '["4.0 - 5.0", "5.5 - 6.5", "7.0 - 8.0", "8.0 - 9.0"]', 1, 'Un pH entre 5.5 et 6.5 permet une absorption optimale des nutriments par les racines.'),
  ('Que signifie l''acronyme NFT ?', '["New Farming Technology", "Nutrient Film Technique", "Natural Food Treatment", "No Fertilizer Technology"]', 1, 'NFT (Nutrient Film Technique) est un système où les racines baignent dans un film nutritif continu.'),
  ('Quelle est la principale cause de jaunissement des feuilles ?', '["Excès d''eau", "Carence en azote", "Trop de lumière", "pH trop bas"]', 1, 'Le jaunissement des feuilles est souvent dû à une carence en azote, élément essentiel pour la chlorophylle.')
) q(question, options, correct_answer, explanation)
WHERE m.title = 'Les Bases de l''Hydroponie';

-- Insérer des données de producteurs avec coordonnées réelles
INSERT INTO public.producers (name, email, city, region, latitude, longitude, speciality, experience_years, rating, description, equipment) VALUES
('Ferme Hydroponique Martin', 'martin@hydrofarm.fr', 'Lyon', 'Auvergne-Rhône-Alpes', 45.7640, 4.8357, 'Légumes feuilles', 8, 4.5, 'Spécialisé dans la production de salades et herbes aromatiques en NFT', '["Systèmes NFT", "Éclairage LED", "Contrôle climatique"]'),
('BioHydro Solutions', 'contact@biohydro.fr', 'Nantes', 'Pays de la Loire', 47.2184, -1.5536, 'Micro-pousses', 5, 4.8, 'Production artisanale de micro-pousses pour restaurants gastronomiques', '["Systèmes DWC", "Chambre de germination", "Séchoir"]'),
('Cultures Urbaines 21', 'info@cultures21.fr', 'Bordeaux', 'Nouvelle-Aquitaine', 44.8378, -0.5792, 'Fourrage hydro', 12, 4.2, 'Pionnier du fourrage hydroponique pour l''élevage local', '["Systèmes automatisés", "Contrôle nutritionnel", "Surveillance IoT"]'),
('GreenTech Provence', 'hello@greentech-provence.fr', 'Marseille', 'Provence-Alpes-Côte d''Azur', 43.2965, 5.3698, 'Tomates cerises', 6, 4.6, 'Culture de tomates cerises premium en système Dutch Bucket', '["Dutch Bucket", "Système goutte-à-goutte", "Serre bioclimatique"]');

-- Insérer des maladies et ravageurs avec solutions
INSERT INTO public.diseases_pests (name, type, description, symptoms, causes, treatments, prevention_tips, severity_level) VALUES
('Pourriture des racines', 'maladie', 'Infection fongique qui attaque le système racinaire des plantes hydroponiques', '["Racines brunes ou noires", "Odeur nauséabonde", "Flétrissement", "Croissance ralentie"]', '["Température eau trop élevée", "Manque d''oxygénation", "pH inadéquat", "Surpopulation"]', '["Changer la solution nutritive", "Traiter avec peroxyde d''hydrogène", "Améliorer l''aération", "Ajuster la température"]', '["Maintenir T° eau < 22°C", "Assurer bonne oxygénation", "Contrôler le pH régulièrement", "Nettoyer le système"]', 8),
('Pucerons verts', 'ravageur', 'Petits insectes qui se nourrissent de la sève des plantes', '["Feuilles collantes", "Présence d''insectes verts", "Déformation des feuilles", "Croissance ralentie"]', '["Air sec", "Manque de prédateurs naturels", "Plantes affaiblies", "Contamination externe"]', '["Pulvérisation eau savonneuse", "Huile de neem", "Prédateurs naturels", "Insecticide biologique"]', '["Maintenir humidité adéquate", "Inspection régulière", "Quarantaine nouvelles plantes", "Favoriser biodiversité"]', 5),
('Carence en fer', 'carence', 'Manque de fer assimilable par la plante', '["Jaunissement entre nervures", "Nervures restent vertes", "Feuilles jeunes affectées", "Croissance réduite"]', '["pH trop élevé", "Excès de phosphore", "Solution nutritive déséquilibrée", "Température inadéquate"]', '["Ajuster pH à 5.5-6.5", "Chélate de fer", "Renouveler solution nutritive", "Vérifier EC"]', '["Contrôler pH quotidiennement", "Équilibrer les nutriments", "Utiliser fer chélaté", "Surveillance régulière"]', 4);

-- Insérer des posts communautaires d'exemple
INSERT INTO public.community_posts (user_id, title, content, tags) VALUES
((SELECT id FROM auth.users LIMIT 1), 'Première récolte de laitue NFT', 'Très content de ma première récolte ! 45 jours de la graine à l''assiette. Le système NFT fonctionne parfaitement.', '["NFT", "laitue", "débutant", "récolte"]'),
((SELECT id FROM auth.users LIMIT 1), 'Problème de pH instable', 'J''ai des fluctuations de pH importantes. Quelqu''un a-t-il des conseils pour stabiliser ?', '["pH", "problème", "conseil", "débutant"]'),
((SELECT id FROM auth.users LIMIT 1), 'Nouveau système automatisé', 'Installation terminée de mon système automatisé avec contrôle IoT. Très satisfait des premiers résultats !', '["automatisation", "IoT", "technologie", "innovation"]');

-- Activer RLS sur toutes les nouvelles tables
ALTER TABLE public.training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS
CREATE POLICY "Users can view their own training progress" ON public.training_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own training progress" ON public.training_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own training progress" ON public.training_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view quiz questions" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "Users can view their own quiz responses" ON public.quiz_responses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own quiz responses" ON public.quiz_responses FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
