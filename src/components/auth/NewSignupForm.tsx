import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Mail, Phone } from "lucide-react";
import EmailPhoneInput from "@/components/EmailPhoneInput";
import PhoneInputComponent from "@/components/PhoneInput";
import OTPVerificationForm from "./OTPVerificationForm";

interface NewSignupFormProps {
  onSwitchToLogin: () => void;
  onSuccess: () => void;
}

const NewSignupForm = ({ onSwitchToLogin, onSuccess }: NewSignupFormProps) => {
  const [usePhone, setUsePhone] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otpPhone, setOtpPhone] = useState("");
  const { signUp, loading } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    const identity = usePhone ? phone : email;
    const result = await signUp(identity, password, usePhone);
    
    if (result.success) {
      if (result.requiresVerification && result.phone) {
        setOtpPhone(result.phone);
        setShowOTP(true);
        toast.success(t('auth.otpSent'));
      } else {
        toast.success("Inscription réussie ! Vérifiez votre email.");
        onSuccess();
      }
    } else {
      toast.error(result.error || "Erreur d'inscription");
    }
  };

  const handleOTPSuccess = () => {
    setShowOTP(false);
    toast.success("Inscription réussie !");
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

  const isFormValid = usePhone 
    ? phone && password && confirmPassword && password === confirmPassword
    : email && password && confirmPassword && password === confirmPassword;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            {t('auth.signUp')} avec
          </Label>
          <ToggleGroup 
            type="single" 
            value={usePhone ? "phone" : "email"} 
            onValueChange={(value) => {
              if (value) setUsePhone(value === "phone");
            }}
            className="grid w-full grid-cols-2"
          >
            <ToggleGroupItem value="email" className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>{t('auth.email')}</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="phone" className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>{t('auth.phone')}</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {usePhone ? (
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-foreground">
              {t('auth.phone')}
            </Label>
            <PhoneInputComponent
              value={phone}
              onChange={(value) => setPhone(value)}
              placeholder={t('auth.phone')}
              disabled={loading}
              required
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              {t('auth.email')}
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.email')}
              disabled={loading}
              required
            />
          </div>
        )}
        
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
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
            {t('auth.confirmPassword')}
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t('auth.confirmPassword')}
            disabled={loading}
            required
          />
        </div>
      </div>
      
      <Button 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium" 
        type="submit" 
        disabled={loading || !isFormValid}
        size="lg"
      >
        {loading ? t('auth.loading') : t('auth.signUp')}
      </Button>
      
      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-primary hover:text-primary/80 font-medium underline transition-colors"
          disabled={loading}
        >
          {t('auth.alreadyHaveAccount')}
        </button>
      </div>
    </form>
  );
};

export default NewSignupForm;