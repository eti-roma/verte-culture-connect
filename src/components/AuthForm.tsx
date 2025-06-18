
import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

const AuthForm = ({
  isLogin,
  setIsLogin,
  onSuccess
}: {
  isLogin: boolean;
  setIsLogin: (b: boolean) => void;
  onSuccess: () => void;
}) => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSignupSuccess = () => {
    // Après inscription réussie, basculer vers la connexion
    setIsLogin(true);
  };

  if (showForgotPassword) {
    return <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />;
  }

  if (isLogin) {
    return (
      <LoginForm
        onSuccess={onSuccess}
        onSwitchToSignup={() => setIsLogin(false)}
        onForgotPassword={() => setShowForgotPassword(true)}
      />
    );
  }

  return (
    <SignupForm
      onSuccess={handleSignupSuccess}
      onSwitchToLogin={() => setIsLogin(true)}
    />
  );
};

export default AuthForm;
