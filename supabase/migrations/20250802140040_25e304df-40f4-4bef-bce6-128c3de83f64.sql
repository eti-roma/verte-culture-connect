-- Insert lecons for each module
-- Module 1: Introduction au Fourrage Hydroponique
INSERT INTO public.lecons (module_id, titre, contenu, type, ordre) VALUES 
('876e409f-e1ff-4369-a7e6-8b62a8ecb90d', 'Qu''est-ce que le fourrage hydroponique', 'https://www.youtube.com/watch?v=nkm7HUfUDtI', 'video', 1),
('876e409f-e1ff-4369-a7e6-8b62a8ecb90d', 'Avantages pour les éleveurs', 'https://www.agriafrique.org/fourrage_hydroponique.pdf', 'pdf', 2),
('876e409f-e1ff-4369-a7e6-8b62a8ecb90d', 'Différence entre culture classique et hydroponique', 'https://www.youtube.com/watch?v=W4cWgZ9XAJ8', 'video', 3);

-- Module 2: Matériel et préparation  
INSERT INTO public.lecons (module_id, titre, contenu, type, ordre) VALUES 
('4b642716-7bf3-4809-b719-3766692530e1', 'Le matériel nécessaire (paniers, bacs…)', 'https://www.youtube.com/watch?v=52whg1E_JWk', 'video', 1),
('4b642716-7bf3-4809-b719-3766692530e1', 'Fabrication d''un système local', 'https://www.fao.org/3/i1234f/i1234f.pdf', 'pdf', 2),
('4b642716-7bf3-4809-b719-3766692530e1', 'Choisir un bon emplacement', 'https://www.youtube.com/watch?v=d7_GS2vZt5A', 'video', 3);

-- Module 3: Germination et entretien
INSERT INTO public.lecons (module_id, titre, contenu, type, ordre) VALUES 
('bd7cb4bf-bee6-48e8-92d9-e94379a3817a', 'Étapes de germination des graines', 'https://www.youtube.com/watch?v=Y-V7JOGcvPM', 'video', 1),
('bd7cb4bf-bee6-48e8-92d9-e94379a3817a', 'Contrôle de l''humidité et température', 'https://www.agrimag.sn/pdf/hydroponie.pdf', 'pdf', 2),
('bd7cb4bf-bee6-48e8-92d9-e94379a3817a', 'Maladies courantes et solutions', 'https://www.youtube.com/watch?v=HgH0EV5c-1Y', 'video', 3);

-- Module 4: Récolte et alimentation des animaux
INSERT INTO public.lecons (module_id, titre, contenu, type, ordre) VALUES 
('3f0e8d86-45e7-4863-a4ae-a9393f5ce345', 'Comment récolter le fourrage à 7 jours', 'https://www.youtube.com/watch?v=UeZFtVo7MZ0', 'video', 1),
('3f0e8d86-45e7-4863-a4ae-a9393f5ce345', 'Quantité journalière à donner aux ruminants', 'https://elevageafrique.com/quantite-fourrage-hydro', 'texte', 2),
('3f0e8d86-45e7-4863-a4ae-a9393f5ce345', 'Stockage du fourrage et conservation', 'https://www.youtube.com/watch?v=gJf-NDEcY60', 'video', 3);