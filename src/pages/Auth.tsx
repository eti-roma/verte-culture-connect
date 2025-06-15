
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
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({ title: "Connexion réussie" });
        navigate("/");
      } else {
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectUrl }
        });
        if (error) throw error;
        toast({ title: "Inscription réussie", description: "Vérifie ta boîte mail pour confirmer ton compte." });
        setIsLogin(true);
        setEmail(""); setPassword("");
      }
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message || "Erreur d’authentification", variant: "destructive" });
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
