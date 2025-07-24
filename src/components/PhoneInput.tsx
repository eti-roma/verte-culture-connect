import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface PhoneInputComponentProps {
  value: string;
  onChange: (value: string, data: any) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

const PhoneInputComponent = ({ 
  value, 
  onChange, 
  placeholder = "Numéro de téléphone",
  disabled = false,
  required = false
}: PhoneInputComponentProps) => {
  return (
    <div className="phone-input-container">
      <PhoneInput
        country={'cm'} // Default to Cameroon
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        enableSearch={true}
        disableSearchIcon={false}
        countryCodeEditable={false}
        preferredCountries={['cm', 'fr', 'us', 'ca']}
        excludeCountries={[]}
        containerClass="w-full"
        inputClass="w-full h-10 px-3 py-2 text-sm border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        buttonClass="border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        dropdownClass="bg-background border border-input shadow-md"
        searchClass="px-3 py-2 border-b border-input bg-background text-foreground placeholder:text-muted-foreground"
        inputProps={{
          required: required,
          autoComplete: 'tel'
        }}
      />
    </div>
  );
};

export default PhoneInputComponent;