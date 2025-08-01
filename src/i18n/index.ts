import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import en from './locales/en.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import de from './locales/de.json';
import ar from './locales/ar.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es },
      de: { translation: de },
      ar: { translation: ar },
    },
    fallbackLng: 'fr',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['navigator', 'localStorage', 'cookie'],
      caches: ['localStorage'],
    },
  });

export default i18n;