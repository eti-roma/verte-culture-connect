import React from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const OTPInput = ({ value, onChange, disabled }: OTPInputProps) => {
  return (
    <div className="flex justify-center">
      <InputOTP
        maxLength={6}
        value={value}
        onChange={onChange}
        disabled={disabled}
        containerClassName="gap-3"
      >
        <InputOTPGroup className="gap-3">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <InputOTPSlot
              key={index}
              index={index}
              className="w-12 h-12 text-2xl font-bold border-2 border-muted rounded-xl bg-background focus:border-primary transition-colors"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
};

export default OTPInput;