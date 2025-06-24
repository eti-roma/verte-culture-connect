
import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

interface AuthFormProps {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
  onSuccess: () => void;
}

const AuthForm = ({ isLogin, setIsLogin, onSuccess }: AuthFormProps) => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  if (showForgotPassword) {
    return (
      <ForgotPasswordForm
        onBack={() => setShowForgotPassword(false)}
      />
    );
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
      onSuccess={onSuccess}
      onSwitchToLogin={() => setIsLogin(true)}
    />
  );
};

export default AuthForm;
