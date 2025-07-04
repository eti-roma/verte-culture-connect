
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/hooks/useLanguage';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  showLabel?: boolean;
  size?: 'sm' | 'default' | 'lg';
}

export const LanguageSelector = ({ showLabel = true, size = 'default' }: LanguageSelectorProps) => {
  const { currentLanguage, changeLanguage, getCurrentLanguage, supportedLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = getCurrentLanguage();

  return (
    <div className="flex items-center space-x-2">
      {showLabel && (
        <Globe className="w-4 h-4 text-gray-600" />
      )}
      <Select value={currentLanguage} onValueChange={changeLanguage}>
        <SelectTrigger className={`
          ${size === 'sm' ? 'h-8 w-32' : size === 'lg' ? 'h-12 w-48' : 'h-10 w-40'}
          border-gray-300 focus:border-emerald-500
        `}>
          <SelectValue>
            <div className="flex items-center space-x-2">
              <span className="text-lg">{currentLang.flag}</span>
              <span className="text-sm font-medium">{currentLang.nativeName}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-y-auto">
          {supportedLanguages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center space-x-3 py-1">
                <span className="text-lg">{language.flag}</span>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{language.nativeName}</span>
                  <span className="text-xs text-gray-500">{language.name}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
