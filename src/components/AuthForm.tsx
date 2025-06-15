
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import LocationInput from "./LocationInput";

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function isPhone(value: string) {
  // Formats : +33 6 12 34 56 78 ou 0612345678
  return /^((\+?\d{1,3})?\s?\d{6,20})$/.test(value.replace(/\s/g, ""));
}

const AuthForm = ({
  isLogin,
  setIsLogin,
  onSuccess
}: {
  isLogin: boolean;
  setIsLogin: (b: boolean) => void;
  onSuccess: () => void;
}) => {
  const [identity, setIdentity] = useState(""); // Email ou téléphone
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [secondaryEmail, setSecondaryEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [locating, setLocating] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Détection de la localisation seulement pour inscription
  useEffect(() => {
    if (!isLogin && city === "" && "geolocation" in navigator) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=fr`
            );
            const data = await response.json();
            const cityFetched = data.address?.city || data.address?.town || data.address?.village || "";
            setCity(cityFetched);
          } catch {
            // Erreur silencieuse
          }
          setLocating(false);
        },
        () => setLocating(false),
        { enableHighAccuracy: true, timeout: 7000 }
      );
    }
  }, [isLogin, city]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        // CONNEXION
        if (isEmail(identity)) {
          const { error } = await supabase.auth.signInWithPassword({
            email: identity,
            password,
          });
          if (error) throw error;
          toast({ title: "Connexion réussie" });
          onSuccess();
        } else if (isPhone(identity)) {
          const { data, error } = await supabase.auth.signInWithOtp({
            phone: identity.replace(/\s/g, "")
          });
          if (error) throw error;
          toast({
            title: "Vérification requise",
            description: "Un code a été envoyé par SMS. (Vérification via OTP à ajouter si besoin)",
          });
        } else {
          throw new Error("Veuillez entrer un email ou numéro valide");
        }
      } else {
        // INSCRIPTION
        if (isEmail(identity)) {
          const { data, error } = await supabase.auth.signUp({
            email: identity,
            password,
          });
          if (error) throw error;
          const userId = data.user?.id;
          if (userId) {
            const { error: profileError } = await supabase
              .from("profiles")
              .insert({
                id: userId,
                username,
                phone,
                location: city,
                email: secondaryEmail ? secondaryEmail : null,
              });
            if (profileError) throw profileError;
          }
          toast({ title: "Inscription réussie", description: "Tu peux maintenant te connecter." });
          setIsLogin(true);
          setIdentity("");
          setPassword("");
          setUsername("");
          setPhone("");
          setCity("");
          setSecondaryEmail("");
        } else if (isPhone(identity)) {
          const phoneNorm = identity.replace(/\s/g, "");
          const { data, error } = await supabase.auth.signUp({
            phone: phoneNorm,
            password,
          });
          if (error) throw error;
          const userId = data.user?.id;
          if (userId) {
            const { error: profileError } = await supabase
              .from("profiles")
              .insert({
                id: userId,
                username,
                phone: phoneNorm,
                location: city,
                email: secondaryEmail ? secondaryEmail : null,
              });
            if (profileError) throw profileError;
          }
          toast({
            title: "Vérification requise",
            description: "Un code a été envoyé par SMS. (Vérification via OTP à ajouter si besoin)",
          });
          setIsLogin(true);
          setIdentity("");
          setPassword("");
          setUsername("");
          setPhone("");
          setCity("");
          setSecondaryEmail("");
        } else {
          throw new Error("Veuillez entrer un email ou numéro valide");
        }
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
    <form onSubmit={handleAuth} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md space-y-6 animate-fade-in border">
      <h1 className="text-2xl font-bold text-center">{isLogin ? "Connexion" : "Inscription"}</h1>
      <Input
        required
        type="text"
        placeholder="Numéro de téléphone ou Email"
        autoComplete="username"
        value={identity}
        onChange={e => setIdentity(e.target.value)}
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
          {/* Email secondaire */}
          <Input
            type="email"
            placeholder="Email secondaire (optionnel)"
            value={secondaryEmail}
            onChange={e => setSecondaryEmail(e.target.value)}
            disabled={loading}
            autoComplete="email"
          />
          {/* Ville présentée readonly */}
          <LocationInput value={city} locating={locating} />
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
  );
};

export default AuthForm;
