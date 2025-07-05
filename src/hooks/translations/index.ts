
import { TranslationKey } from './types';
import { frTranslations } from './fr';
import { enTranslations } from './en';
import { esTranslations } from './es';
import { deTranslations } from './de';
import { zhTranslations } from './zh';
import { jaTranslations } from './ja';
import { arTranslations } from './ar';

export const translations: Record<string, Record<TranslationKey, string>> = {
  fr: frTranslations,
  en: enTranslations,
  es: esTranslations,
  de: deTranslations,
  zh: zhTranslations,
  ja: jaTranslations,
  ar: arTranslations
};

export { TranslationKey };
