
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import LocationInput from "./LocationInput";
import OTPVerification from "./OTPVerification";

interface SignupFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

const SignupForm = ({ onSuccess, onSwitchToLogin }: SignupFormProps) => {
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [city, setCity] = useState("");
  const [locating, setLocating] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpPhone, setOtpPhone] = useState("");
  
  const { loading, signUp, isPhone } = useAuth();

  // Détection de la localisation
  useEffect(() => {
    if (city === "" && "geolocation" in navigator) {
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
  }, [city]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await signUp(identity, password, username, identity, city);
    
    if (result.success) {
      if (result.requiresVerification && result.phone) {
        setOtpPhone(result.phone);
        setShowOTP(true);
      } else {
        // Pour l'inscription par email, on reste sur le formulaire mais on peut basculer vers login
        onSwitchToLogin();
      }
    }
  };

  const handleOTPSuccess = () => {
    setShowOTP(false);
    onSuccess();
  };

  if (showOTP) {
    return (
      <OTPVerification
        phone={otpPhone}
        onSuccess={handleOTPSuccess}
        onBack={() => setShowOTP(false)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md space-y-6 animate-fade-in border">
      <h1 className="text-2xl font-bold text-center">Inscription</h1>
      
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
        autoComplete="new-password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        disabled={loading}
        minLength={6}
      />
      
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
      
      <LocationInput 
        value={city} 
        onChange={setCity}
        locating={locating} 
      />
      
      <Button className="w-full" type="submit" disabled={loading || !identity || !password || !username || !city}>
        {loading ? "En cours..." : "S'inscrire"}
      </Button>
      
      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-sm text-emerald-700 underline hover:font-semibold"
          disabled={loading}
        >
          Déjà inscrit ? Connecte-toi
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
