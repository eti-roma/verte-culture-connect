
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [city, setCity] = useState("");
  const [locating, setLocating] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpPhone, setOtpPhone] = useState("");
  
  const { loading, signUp, isPhone, isEmail } = useAuth();

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
    
    if (password !== confirmPassword) {
      return;
    }
    
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

  const isPhoneInput = isPhone(identity);
  const isEmailInput = isEmail(identity);
  const passwordsMatch = password === confirmPassword;

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md space-y-6 animate-fade-in border">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Inscription</h1>
        <p className="text-sm text-gray-600 mt-2">
          Rejoignez la communauté Fourrage Pro
        </p>
      </div>
      
      <Input
        required
        type="text"
        placeholder="Email ou numéro de téléphone"
        autoComplete="username"
        value={identity}
        onChange={e => setIdentity(e.target.value)}
        disabled={loading}
        className="text-base"
      />
      
      <Input
        required
        type="password"
        placeholder="Mot de passe (min. 6 caractères)"
        autoComplete="new-password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        disabled={loading}
        minLength={6}
        className="text-base"
      />

      <div className="space-y-1">
        <Input
          required
          type="password"
          placeholder="Confirmer le mot de passe"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          disabled={loading}
          minLength={6}
          className={`text-base ${confirmPassword && !passwordsMatch ? 'border-red-500' : ''}`}
        />
        {confirmPassword && !passwordsMatch && (
          <div className="text-xs text-red-600">
            Les mots de passe ne correspondent pas
          </div>
        )}
      </div>
      
      <Input
        required
        type="text"
        placeholder="Nom d'utilisateur"
        value={username}
        onChange={e => setUsername(e.target.value)}
        disabled={loading}
        minLength={2}
        maxLength={32}
        className="text-base"
      />
      
      <LocationInput 
        value={city} 
        onChange={setCity}
        locating={locating} 
      />
      
      <Button 
        className="w-full bg-emerald-600 hover:bg-emerald-700" 
        type="submit" 
        disabled={loading || !identity || !password || !confirmPassword || !username || !city || !passwordsMatch}
      >
        {loading ? "En cours..." : "S'inscrire"}
      </Button>
      
      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-sm text-emerald-700 underline hover:font-semibold"
          disabled={loading}
        >
          Déjà inscrit ? Connectez-vous
        </button>
      </div>

      {identity && !isEmailInput && !isPhoneInput && (
        <div className="text-xs text-red-600 text-center">
          Veuillez saisir un email valide ou un numéro français (ex: 06 12 34 56 78)
        </div>
      )}

      {isPhoneInput && (
        <div className="text-xs text-blue-600 text-center bg-blue-50 p-2 rounded">
          📱 Un SMS de confirmation sera envoyé à ce numéro
        </div>
      )}

      {isEmailInput && (
        <div className="text-xs text-blue-600 text-center bg-blue-50 p-2 rounded">
          📧 Un email de confirmation sera envoyé à cette adresse
        </div>
      )}
    </form>
  );
};

export default SignupForm;
