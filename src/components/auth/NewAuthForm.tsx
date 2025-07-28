import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import NewLoginForm from "./NewLoginForm";
import NewSignupForm from "./NewSignupForm";
import NewForgotPasswordForm from "./NewForgotPasswordForm";
import AuthLayout from "./AuthLayout";

interface NewAuthFormProps {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
  onSuccess: () => void;
}

const NewAuthForm = ({ isLogin, setIsLogin, onSuccess }: NewAuthFormProps) => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { t } = useLanguage();

  if (showForgotPassword) {
    return (
      <AuthLayout
        title={t('auth.resetPassword')}
        subtitle="Entrez votre email pour réinitialiser votre mot de passe"
      >
        <NewForgotPasswordForm
          onBack={() => setShowForgotPassword(false)}
        />
      </AuthLayout>
    );
  }

  if (isLogin) {
    return (
      <AuthLayout
        title={t('auth.login')}
        subtitle={t('auth.welcomeBack')}
      >
        <NewLoginForm
          onSuccess={onSuccess}
          onSwitchToSignup={() => setIsLogin(false)}
          onForgotPassword={() => setShowForgotPassword(true)}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={t('auth.signup')}
      subtitle={t('auth.createAccount')}
    >
      <NewSignupForm
        onSuccess={onSuccess}
        onSwitchToLogin={() => setIsLogin(true)}
      />
    </AuthLayout>
  );
};

export default NewAuthForm;