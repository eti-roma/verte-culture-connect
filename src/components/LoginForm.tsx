
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import OTPVerification from "./OTPVerification";

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
}

const LoginForm = ({ onSuccess, onSwitchToSignup, onForgotPassword }: LoginFormProps) => {
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [useOTPMode, setUseOTPMode] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpPhone, setOtpPhone] = useState("");
  const { loading, signIn, signInWithOTP, isPhone, isEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (useOTPMode && isPhone(identity)) {
      const result = await signInWithOTP(identity);
      if (result.success && result.phone) {
        setOtpPhone(result.phone);
        setShowOTP(true);
      }
    } else {
      const result = await signIn(identity, password);
      if (result.success) {
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
  const isEmailInput = isEmail(identity);

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md space-y-6 animate-fade-in border">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Connexion</h1>
        <p className="text-sm text-gray-600 mt-2">
          Connectez-vous à votre compte Fourrage Pro
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
      
      {isPhoneInput && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="password-mode"
              name="auth-mode"
              checked={!useOTPMode}
              onChange={() => setUseOTPMode(false)}
              className="text-emerald-600"
            />
            <label htmlFor="password-mode" className="text-sm">
              Connexion avec mot de passe
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="otp-mode"
              name="auth-mode"
              checked={useOTPMode}
              onChange={() => setUseOTPMode(true)}
              className="text-emerald-600"
            />
            <label htmlFor="otp-mode" className="text-sm">
              Recevoir un code par SMS
            </label>
          </div>
        </div>
      )}
      
      {(!isPhoneInput || !useOTPMode) && (
        <Input
          required
          type="password"
          placeholder="Mot de passe"
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
          className="text-base"
        />
      )}
      
      <Button 
        className="w-full bg-emerald-600 hover:bg-emerald-700" 
        type="submit" 
        disabled={loading || !identity || (!useOTPMode && !password)}
      >
        {loading ? "En cours..." : 
         useOTPMode && isPhoneInput ? "Envoyer le code SMS" : 
         "Se connecter"}
      </Button>
      
      <div className="text-center flex flex-col gap-2">
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-sm text-emerald-700 underline hover:font-semibold"
          disabled={loading}
        >
          Créer un compte
        </button>
        
        {isEmailInput && (
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs text-gray-600 underline hover:text-gray-800"
            disabled={loading}
          >
            Mot de passe oublié ?
          </button>
        )}
      </div>

      {identity && !isEmailInput && !isPhoneInput && (
        <div className="text-xs text-red-600 text-center">
          Veuillez saisir un email valide ou un numéro français (ex: 06 12 34 56 78)
        </div>
      )}
    </form>
  );
};

export default LoginForm;
