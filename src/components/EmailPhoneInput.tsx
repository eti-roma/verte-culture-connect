import React from 'react';
import { Input } from '@/components/ui/input';
import { Mail, Phone } from 'lucide-react';

interface EmailPhoneInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  isPhone?: boolean;
}

const EmailPhoneInput = ({ 
  value, 
  onChange, 
  placeholder = "Email ou numéro de téléphone",
  disabled = false,
  required = false,
  isPhone = false
}: EmailPhoneInputProps) => {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isPhoneNumber = /^(\+|0)[0-9]/.test(value.replace(/\s/g, ""));

  const getIcon = () => {
    if (isEmail) return <Mail className="h-4 w-4" />;
    if (isPhoneNumber || isPhone) return <Phone className="h-4 w-4" />;
    return <Mail className="h-4 w-4" />;
  };

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
        {getIcon()}
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        autoComplete="username"
        className="pl-10"
      />
    </div>
  );
};

export default EmailPhoneInput;