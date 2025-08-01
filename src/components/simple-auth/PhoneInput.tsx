import React from 'react';
import PhoneInputComponent from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useTranslation } from 'react-i18next';

interface SimplePhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const SimplePhoneInput = ({ value, onChange, disabled }: SimplePhoneInputProps) => {
  const { countryCode, loading } = useGeolocation();
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <PhoneInputComponent
        country={countryCode || 'cm'}
        value={value}
        onChange={onChange}
        placeholder={t('phone_placeholder')}
        disabled={disabled || loading}
        enableSearch={true}
        disableSearchIcon={false}
        countryCodeEditable={false}
        preferredCountries={['cm', 'fr', 'us', 'ca', 'gb', 'de', 'es']}
        containerClass="w-full phone-input-simple"
        inputClass="w-full h-14 px-4 py-4 text-lg border-2 border-muted bg-background rounded-xl focus:border-primary focus:ring-0 transition-colors"
        buttonClass="border-2 border-muted bg-background hover:bg-accent rounded-l-xl transition-colors h-14"
        dropdownClass="bg-background border border-border shadow-lg rounded-lg"
        searchClass="px-3 py-2 border-b border-border bg-background"
        inputProps={{
          autoComplete: 'tel',
          autoFocus: true,
        }}
      />
      {loading && (
        <p className="text-sm text-muted-foreground mt-2 animate-pulse">
          {t('detecting_location')}
        </p>
      )}
      <style>{`
        .phone-input-simple .react-tel-input .form-control {
          font-size: 1.125rem !important;
          height: 3.5rem !important;
          border-radius: 0.75rem !important;
          border-width: 2px !important;
          padding-left: 3.5rem !important;
        }
        .phone-input-simple .react-tel-input .flag-dropdown {
          border-radius: 0.75rem 0 0 0.75rem !important;
          height: 3.5rem !important;
          border-width: 2px !important;
        }
        .phone-input-simple .react-tel-input .selected-flag {
          height: 3.5rem !important;
          padding: 0 0.75rem !important;
        }
      `}</style>
    </div>
  );
};

export default SimplePhoneInput;