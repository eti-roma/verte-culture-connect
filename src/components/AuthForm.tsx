
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import LocationInput from "./LocationInput";
import ForgotPasswordForm from "./ForgotPasswordForm";

const AuthForm = ({
  isLogin,
  setIsLogin,
  onSuccess
}: {
  isLogin: boolean;
  setIsLogin: (b: boolean) => void;
  onSuccess: () => void;
}) => {
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [locating, setLocating] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const { loading, signUp, signIn } = useAuth();

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
    
    let result;
    if (isLogin) {
      result = await signIn(identity, password);
    } else {
      result = await signUp(identity, password, username, phone, city);
    }
    
    if (result.success) {
      if (isLogin) {
        onSuccess();
      } else {
        // Pour l'inscription, basculer vers la connexion
        setIsLogin(true);
        setIdentity("");
        setPassword("");
        setUsername("");
        setPhone("");
        setCity("");
      }
    }
  };

  if (showForgotPassword) {
    return <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />;
  }

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
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={loading}
            minLength={2}
            maxLength={32}
          />
          
          <LocationInput value={city} locating={locating} />
        </>
      )}
      
      <Button className="w-full" type="submit" disabled={loading}>
        {loading ? "En cours..." : isLogin ? "Se connecter" : "S'inscrire"}
      </Button>
      
      <div className="text-center flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-emerald-700 underline hover:font-semibold"
          disabled={loading}
        >
          {isLogin ? "Créer un compte" : "Déjà inscrit ? Connecte-toi"}
        </button>
        
        {isLogin && (
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-xs text-gray-600 underline hover:text-gray-800"
            disabled={loading}
          >
            Mot de passe oublié ?
          </button>
        )}
      </div>
    </form>
  );
};

export default AuthForm;
