import React, { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface OTPVerificationFormProps {
  phone: string;
  onSuccess: () => void;
  onBack: () => void;
}

const OTPVerificationForm = ({ phone, onSuccess, onBack }: OTPVerificationFormProps) => {
  const [otp, setOTP] = useState("");
  const { verifyOTP, loading } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) return;
    
    const result = await verifyOTP(phone, otp);
    if (result.success) {
      onSuccess();
    } else {
      toast.error(result.error || "Code incorrect");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {t('auth.otpVerification')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t('auth.otpSent')} au {phone}
        </p>
      </div>
      
      <div className="flex justify-center">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={setOTP}
          disabled={loading}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      
      <Button 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium" 
        type="submit" 
        disabled={loading || otp.length !== 6}
        size="lg"
      >
        {loading ? t('auth.loading') : t('auth.verify')}
      </Button>
      
      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        className="w-full text-primary hover:text-primary/80"
        disabled={loading}
      >
        {t('auth.back')}
      </Button>
    </form>
  );
};

export default OTPVerificationForm;