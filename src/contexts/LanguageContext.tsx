import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, SUPPORTED_LANGUAGES } from '@/hooks/useLanguage';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (langCode: string) => void;
  getCurrentLanguage: () => Language;
  supportedLanguages: Language[];
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Simple translations for now - can be extended
const translations: Record<string, Record<string, string>> = {
  fr: {
    'auth.signup': 'Inscription',
    'auth.login': 'Connexion',
    'auth.email': 'Email',
    'auth.phone': 'Téléphone',
    'auth.password': 'Mot de passe',
    'auth.confirmPassword': 'Confirmer le mot de passe',
    'auth.alreadyHaveAccount': 'Déjà un compte ? Se connecter',
    'auth.dontHaveAccount': 'Pas encore de compte ? S\'inscrire',
    'auth.signUp': 'S\'inscrire',
    'auth.signIn': 'Se connecter',
    'auth.loading': 'Chargement...',
    'auth.forgotPassword': 'Mot de passe oublié ?',
    'auth.resetPassword': 'Réinitialiser le mot de passe',
    'auth.backToLogin': 'Retour à la connexion',
    'auth.sendResetEmail': 'Envoyer l\'email de réinitialisation',
    'auth.checkEmail': 'Vérifiez votre email pour réinitialiser votre mot de passe',
    'auth.otpVerification': 'Vérification SMS',
    'auth.otpSent': 'Un code à 6 chiffres a été envoyé',
    'auth.verify': 'Vérifier',
    'auth.back': 'Retour',
    'auth.enterOTP': 'Entrez le code de vérification',
    'auth.welcomeBack': 'Connectez-vous à votre compte',
    'auth.createAccount': 'Créez votre compte',
    'auth.emailOrPhone': 'Email ou téléphone',
    'common.welcome': 'Bienvenue',
    'common.logout': 'Déconnexion',
    'common.loading': 'Chargement de l\'application...',
    'common.appStarted': 'Application démarrée avec succès !',
    'common.appDescription': 'Votre système d\'authentification est maintenant configuré.'
  },
  en: {
    'auth.signup': 'Sign Up',
    'auth.login': 'Login',
    'auth.email': 'Email',
    'auth.phone': 'Phone',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.alreadyHaveAccount': 'Already have an account? Sign in',
    'auth.dontHaveAccount': 'Don\'t have an account? Sign up',
    'auth.signUp': 'Sign Up',
    'auth.signIn': 'Sign In',
    'auth.loading': 'Loading...',
    'auth.forgotPassword': 'Forgot password?',
    'auth.resetPassword': 'Reset Password',
    'auth.backToLogin': 'Back to login',
    'auth.sendResetEmail': 'Send reset email',
    'auth.checkEmail': 'Check your email to reset your password',
    'auth.otpVerification': 'SMS Verification',
    'auth.otpSent': 'A 6-digit code has been sent',
    'auth.verify': 'Verify',
    'auth.back': 'Back',
    'auth.enterOTP': 'Enter verification code',
    'auth.welcomeBack': 'Sign in to your account',
    'auth.createAccount': 'Create your account',
    'auth.emailOrPhone': 'Email or phone',
    'common.welcome': 'Welcome',
    'common.logout': 'Logout',
    'common.loading': 'Loading application...',
    'common.appStarted': 'Application started successfully!',
    'common.appDescription': 'Your authentication system is now configured.'
  },
  es: {
    'auth.signup': 'Registrarse',
    'auth.login': 'Iniciar Sesión',
    'auth.email': 'Email',
    'auth.phone': 'Teléfono',
    'auth.password': 'Contraseña',
    'auth.confirmPassword': 'Confirmar Contraseña',
    'auth.alreadyHaveAccount': '¿Ya tienes cuenta? Inicia sesión',
    'auth.dontHaveAccount': '¿No tienes cuenta? Regístrate',
    'auth.signUp': 'Registrarse',
    'auth.signIn': 'Iniciar Sesión',
    'auth.loading': 'Cargando...',
    'auth.forgotPassword': '¿Olvidaste tu contraseña?',
    'auth.resetPassword': 'Restablecer Contraseña',
    'auth.backToLogin': 'Volver al inicio de sesión',
    'auth.sendResetEmail': 'Enviar email de restablecimiento',
    'auth.checkEmail': 'Revisa tu email para restablecer tu contraseña',
    'auth.otpVerification': 'Verificación SMS',
    'auth.otpSent': 'Se ha enviado un código de 6 dígitos',
    'auth.verify': 'Verificar',
    'auth.back': 'Atrás',
    'auth.enterOTP': 'Ingresa el código de verificación',
    'auth.welcomeBack': 'Inicia sesión en tu cuenta',
    'auth.createAccount': 'Crea tu cuenta',
    'auth.emailOrPhone': 'Email o teléfono',
    'common.welcome': 'Bienvenido',
    'common.logout': 'Cerrar Sesión',
    'common.loading': 'Cargando aplicación...',
    'common.appStarted': '¡Aplicación iniciada con éxito!',
    'common.appDescription': 'Tu sistema de autenticación está ahora configurado.'
  }
};

const detectBrowserLanguage = (): string => {
  const browserLang = navigator.language.split('-')[0];
  const supportedCodes = SUPPORTED_LANGUAGES.map(lang => lang.code);
  return supportedCodes.includes(browserLang) ? browserLang : 'fr';
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    const saved = localStorage.getItem('app-language');
    return saved || detectBrowserLanguage();
  });

  useEffect(() => {
    if (!localStorage.getItem('app-language')) {
      const detected = detectBrowserLanguage();
      setCurrentLanguage(detected);
      localStorage.setItem('app-language', detected);
    }
  }, []);

  const changeLanguage = (langCode: string) => {
    setCurrentLanguage(langCode);
    localStorage.setItem('app-language', langCode);
  };

  const getCurrentLanguage = () => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage) || SUPPORTED_LANGUAGES[0];
  };

  const t = (key: string): string => {
    const langTranslations = translations[currentLanguage] || translations.fr;
    return langTranslations[key] || key;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    getCurrentLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
    t
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};