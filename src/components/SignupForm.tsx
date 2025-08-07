import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import LocationInput from "./LocationInput";
import { LanguageSelector } from "./LanguageSelector";
import { useTranslations } from "@/hooks/useTranslations";
import PasswordInput from "./PasswordInput";
import { User, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SignupFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

const SignupForm = ({ onSuccess, onSwitchToLogin }: SignupFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [city, setCity] = useState("");
  const [locating, setLocating] = useState(false);
  
  const { loading, signUp } = useAuth();
  const { t } = useTranslations();

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
    
    // Validation du mot de passe
    if (password !== confirmPassword) {
      return;
    }
    
    const result = await signUp(email, password, username, email, city);
    
    if (result.success) {
      onSuccess();
    }
  };

  const isFormValid = email && password && confirmPassword && username && city;

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-card shadow-lg rounded-lg p-8 w-full max-w-md space-y-6 animate-fade-in border border-border">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">{t('auth.signup')}</h1>
        <p className="text-sm text-muted-foreground mt-1">Créez votre compte</p>
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">{t('auth.language')}</Label>
        <LanguageSelector showLabel={false} />
      </div>

      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Adresse email *
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              <Mail className="h-4 w-4" />
            </div>
            <Input
              type="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
              required
              autoComplete="email"
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium text-foreground">
            Nom d'utilisateur *
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              <User className="h-4 w-4" />
            </div>
            <Input
              type="text"
              placeholder="Votre nom d'utilisateur"
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={loading}
              required
              minLength={2}
              maxLength={32}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-foreground">
            Mot de passe *
          </Label>
          <PasswordInput
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Minimum 6 caractères"
            disabled={loading}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
            Confirmer le mot de passe *
          </Label>
          <PasswordInput
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Répétez votre mot de passe"
            disabled={loading}
            required
            autoComplete="new-password"
            confirmPassword={true}
          />
          {password && confirmPassword && password !== confirmPassword && (
            <p className="text-xs text-destructive">Les mots de passe ne correspondent pas</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-medium text-foreground">
            Ville *
          </Label>
          <LocationInput 
            value={city} 
            onChange={setCity}
            locating={locating} 
          />
        </div>
      </div>
      
      <Button 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium" 
        type="submit" 
        disabled={loading || !isFormValid || (password !== confirmPassword)}
        size="lg"
      >
        {loading ? "Création du compte..." : t('auth.signUp')}
      </Button>
      
      <div className="text-center">
        <div className="flex items-center justify-center gap-1 text-sm">
          <span className="text-muted-foreground">Déjà un compte ?</span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-primary hover:text-primary/80 font-medium underline transition-colors"
            disabled={loading}
          >
            Se connecter
          </button>
        </div>
      </div>
    </form>
  );
};

export default SignupForm;
