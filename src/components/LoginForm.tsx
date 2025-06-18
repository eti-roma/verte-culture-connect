
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
}

const LoginForm = ({ onSuccess, onSwitchToSignup, onForgotPassword }: LoginFormProps) => {
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const { loading, signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await signIn(identity, password);
    if (result.success) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md space-y-6 animate-fade-in border">
      <h1 className="text-2xl font-bold text-center">Connexion</h1>
      
      <Input
        required
        type="text"
        placeholder="Numéro de téléphone ou Email"
        autoComplete="username"
        value={identity}
        onChange={e => setIdentity(e.target.value)}
        disabled={loading}
      />
      
      <Input
        required
        type="password"
        placeholder="Mot de passe"
        autoComplete="current-password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        disabled={loading}
      />
      
      <Button className="w-full" type="submit" disabled={loading}>
        {loading ? "En cours..." : "Se connecter"}
      </Button>
      
      <div className="text-center flex flex-col gap-2">
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-sm text-emerald-700 underline hover:font-semibold"
          disabled={loading}
        >
          Créer un compte
        </button>
        
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-xs text-gray-600 underline hover:text-gray-800"
          disabled={loading}
        >
          Mot de passe oublié ?
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
