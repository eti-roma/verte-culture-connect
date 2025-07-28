import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import EmailPhoneInput from "@/components/EmailPhoneInput";
import OTPVerificationForm from "./OTPVerificationForm";

interface NewLoginFormProps {
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
  onSuccess: () => void;
}

const NewLoginForm = ({ onSwitchToSignup, onForgotPassword, onSuccess }: NewLoginFormProps) => {
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otpPhone, setOtpPhone] = useState("");
  const { signIn, loading } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await signIn(identity, password);
    
    if (result.success) {
      if (result.requiresVerification && result.phone) {
        setOtpPhone(result.phone);
        setShowOTP(true);
        toast.success(t('auth.otpSent'));
      } else {
        toast.success("Connexion réussie !");
        onSuccess();
      }
    } else {
      toast.error(result.error || "Erreur de connexion");
    }
  };

  const handleOTPSuccess = () => {
    setShowOTP(false);
    toast.success("Connexion réussie !");
    onSuccess();
  };

  if (showOTP) {
    return (
      <OTPVerificationForm
        phone={otpPhone}
        onSuccess={handleOTPSuccess}
        onBack={() => setShowOTP(false)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="identity" className="text-sm font-medium text-foreground">
            {t('auth.emailOrPhone')}
          </Label>
          <EmailPhoneInput
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
            placeholder={t('auth.emailOrPhone')}
            disabled={loading}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-foreground">
            {t('auth.password')}
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('auth.password')}
            disabled={loading}
            required
          />
        </div>
      </div>
      
      <Button 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium" 
        type="submit" 
        disabled={loading || !identity || !password}
        size="lg"
      >
        {loading ? t('auth.loading') : t('auth.signIn')}
      </Button>
      
      <div className="space-y-2 text-center">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-primary hover:text-primary/80 font-medium underline transition-colors text-sm"
          disabled={loading}
        >
          {t('auth.forgotPassword')}
        </button>
        
        <div>
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-primary hover:text-primary/80 font-medium underline transition-colors"
            disabled={loading}
          >
            {t('auth.dontHaveAccount')}
          </button>
        </div>
      </div>
    </form>
  );
};

export default NewLoginForm;