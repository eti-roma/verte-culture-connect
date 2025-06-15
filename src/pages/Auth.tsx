
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
  const [locating, setLocating] = useState(false);

  // Rediriger si déjà connecté
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/");
      }
    });
  }, [navigate]);

  // Détection automatique de la localisation à l'inscription
  useEffect(() => {
    if (!isLogin && !location && "geolocation" in navigator) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
          try {
            // Utilisation de l'API OpenStreetMap Nominatim
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=fr`
            );
            const data = await response.json();
            // Extraction ville/région
            const city = data.address?.city || data.address?.town || data.address?.village || "";
            const region = data.address?.state || data.address?.county || "";
            // Format
            const locResult = [city, region].filter(Boolean).join(", ");
            setLocation(locResult);
          } catch {
            // Erreur silencieuse, ne rien faire
          }
          setLocating(false);
        },
        () => setLocating(false),
        { enableHighAccuracy: true, timeout: 7000 }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin]);

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
            <div className="relative">
              <Input
                required
                type="text"
                placeholder="Localisation"
                value={location}
                onChange={e => setLocation(e.target.value)}
                disabled={loading || locating}
                minLength={2}
                maxLength={64}
              />
              {/* Affichage de la détection en cours */}
              {locating && (
                <span className="absolute right-3 top-2.5 text-xs text-emerald-700 animate-pulse">
                  Localisation…
                </span>
              )}
            </div>
            {(!("geolocation" in navigator)) && (
              <div className="text-xs text-orange-500 pl-1">La détection automatique n’est pas possible sur ce navigateur.</div>
            )}
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
