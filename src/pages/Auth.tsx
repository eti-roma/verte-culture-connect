
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Nouveaux champs pour inscription
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Rediriger si déjà connecté
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        // Connexion classique
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({ title: "Connexion réussie" });
        navigate("/");
      } else {
        // Inscription: pas de emailRedirectTo
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        // Récupère l'id utilisateur et crée l'entrée profil
        const userId = data.user?.id;
        if (userId) {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              id: userId,
              username,
              phone,
              location,
            });
          if (profileError) throw profileError;
        }
        toast({ title: "Inscription réussie", description: "Tu peux maintenant te connecter." });
        setIsLogin(true);
        setEmail("");
        setPassword("");
        setUsername("");
        setPhone("");
        setLocation("");
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur d’authentification",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <form onSubmit={handleAuth} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md space-y-6 animate-fade-in border">
        <h1 className="text-2xl font-bold text-center">{isLogin ? "Connexion" : "Inscription"}</h1>
        <Input
          required
          type="email"
          placeholder="Email"
          autoComplete="username"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
        />
        <Input
          required
          type="password"
          placeholder="Mot de passe"
          autoComplete={isLogin ? "current-password" : "new-password"}
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
        />

        {!isLogin && (
          <>
            <Input
              required
              type="text"
              placeholder="Nom d’utilisateur"
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={loading}
              minLength={2}
              maxLength={32}
            />
            <Input
              required
              type="tel"
              placeholder="Numéro de téléphone"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              disabled={loading}
              pattern="^[0-9+\s]{6,20}$"
            />
            <Input
              required
              type="text"
              placeholder="Localisation"
              value={location}
              onChange={e => setLocation(e.target.value)}
              disabled={loading}
              minLength={2}
              maxLength={64}
            />
          </>
        )}

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "En cours..." : isLogin ? "Se connecter" : "S'inscrire"}
        </Button>
        <div className="text-center flex flex-col gap-1">
          <button
            type="button"
            onClick={() => setIsLogin((v) => !v)}
            className="text-sm text-emerald-700 underline hover:font-semibold"
            disabled={loading}
          >
            {isLogin ? "Créer un compte" : "Déjà inscrit ? Connecte-toi"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Auth;
