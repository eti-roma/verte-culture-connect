
import { useLanguage } from './useLanguage';
import { translations, TranslationKey } from './translations';

export const useTranslations = () => {
  const { currentLanguage } = useLanguage();
  
  const t = (key: TranslationKey): string => {
    const langTranslations = translations[currentLanguage] || translations.fr;
    return langTranslations[key] || key;
  };
  
  return { t };
};
