
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import OTPVerification from "./OTPVerification";
import EmailPhoneInput from "./EmailPhoneInput";
import PasswordInput from "./PasswordInput";

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
}

const LoginForm = ({ onSuccess, onSwitchToSignup, onForgotPassword }: LoginFormProps) => {
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otpPhone, setOtpPhone] = useState("");
  const { loading, signIn, isPhone } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await signIn(identity, password);
    if (result.success) {
      if (result.requiresVerification && result.phone) {
        setOtpPhone(result.phone);
        setShowOTP(true);
      } else {
        onSuccess();
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

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-card shadow-lg rounded-lg p-8 w-full max-w-md space-y-6 animate-fade-in border border-border">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Connexion</h1>
        <p className="text-sm text-muted-foreground mt-1">Connectez-vous à votre compte</p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="identity" className="text-sm font-medium text-foreground">
            Email ou numéro de téléphone
          </Label>
          <EmailPhoneInput
            value={identity}
            onChange={e => setIdentity(e.target.value)}
            placeholder="exemple@email.com ou +237 6XX XXX XXX"
            disabled={loading}
            required
          />
        </div>
        
        {!isPhoneInput && (
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Mot de passe
            </Label>
            <PasswordInput
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              disabled={loading}
              required
              autoComplete="current-password"
            />
          </div>
        )}
      </div>
      
      <Button 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium" 
        type="submit" 
        disabled={loading || !identity || (!isPhoneInput && !password)}
        size="lg"
      >
        {loading ? "Connexion en cours..." : isPhoneInput ? "Envoyer le code SMS" : "Se connecter"}
      </Button>
      
      <div className="text-center space-y-3">
        {!isPhoneInput && (
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-muted-foreground hover:text-foreground underline transition-colors"
            disabled={loading}
          >
            Mot de passe oublié ?
          </button>
        )}
        
        <div className="flex items-center justify-center gap-1 text-sm">
          <span className="text-muted-foreground">Pas encore de compte ?</span>
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-primary hover:text-primary/80 font-medium underline transition-colors"
            disabled={loading}
          >
            S'inscrire
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
