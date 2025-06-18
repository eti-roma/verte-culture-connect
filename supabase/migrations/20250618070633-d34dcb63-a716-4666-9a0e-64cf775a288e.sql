
-- Ajout des politiques RLS manquantes pour sécuriser les données

-- Politiques pour community_posts
CREATE POLICY "Users can view all community posts" ON public.community_posts
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own posts" ON public.community_posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" ON public.community_posts
  FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour comments
CREATE POLICY "Users can view all comments" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour likes
CREATE POLICY "Users can view all likes" ON public.likes
  FOR SELECT USING (true);

-- Politiques pour problem_reports
CREATE POLICY "Users can update their own problem reports" ON public.problem_reports
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own problem reports" ON public.problem_reports
  FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour producers
CREATE POLICY "Users can delete their own producer profile" ON public.producers
  FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour photo_analyses
CREATE POLICY "Users can update their own photo analyses" ON public.photo_analyses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photo analyses" ON public.photo_analyses
  FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour culture_parameters
CREATE POLICY "Users can update their own culture parameters" ON public.culture_parameters
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own culture parameters" ON public.culture_parameters
  FOR DELETE USING (auth.uid() = user_id);
