
-- Table pour le profil utilisateur personnalisé
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  phone TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS : seul l’utilisateur peut voir/éditer son profil
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "User can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "User can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
