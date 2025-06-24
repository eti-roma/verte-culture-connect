
import React, { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface OTPVerificationProps {
  phone: string;
  onSuccess: () => void;
  onBack: () => void;
}

const OTPVerification = ({ phone, onSuccess, onBack }: OTPVerificationProps) => {
  const [otp, setOTP] = useState("");
  const { loading, verifyOTP } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) return;
    
    const result = await verifyOTP(phone, otp);
    if (result.success) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md space-y-6 animate-fade-in border">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Vérification SMS</h1>
        <p className="text-sm text-gray-600 mt-2">
          Un code à 6 chiffres a été envoyé au {phone}
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
        className="w-full" 
        type="submit" 
        disabled={loading || otp.length !== 6}
      >
        {loading ? "Vérification..." : "Vérifier"}
      </Button>
      
      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        className="w-full text-emerald-700 hover:text-emerald-800"
        disabled={loading}
      >
        Retour
      </Button>
    </form>
  );
};

export default OTPVerification;
