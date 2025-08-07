
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import PasswordInput from "./PasswordInput";

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
    <form onSubmit={handleSubmit} className="bg-white dark:bg-card shadow-lg rounded-lg p-8 w-full max-w-md space-y-6 animate-fade-in border border-border">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Connexion</h1>
        <p className="text-sm text-muted-foreground mt-1">Connectez-vous à votre compte</p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Adresse email
          </Label>
          <Input
            type="email"
            value={identity}
            onChange={e => setIdentity(e.target.value)}
            placeholder="exemple@email.com"
            disabled={loading}
            required
            autoComplete="email"
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-foreground">
            Mot de passe
          </Label>
          <PasswordInput
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Votre mot de passe"
            disabled={loading}
            required
            autoComplete="current-password"
          />
        </div>
      </div>
      
      <Button 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium" 
        type="submit" 
        disabled={loading || !identity || !password}
        size="lg"
      >
        {loading ? "Connexion en cours..." : "Se connecter"}
      </Button>
      
      <div className="text-center space-y-3">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-muted-foreground hover:text-foreground underline transition-colors"
          disabled={loading}
        >
          Mot de passe oublié ?
        </button>
        
        <div className="flex items-center justify-center gap-1 text-sm">
          <span className="text-muted-foreground">Pas encore de compte ?</span>
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-primary hover:text-primary/80 font-medium underline transition-colors"
            disabled={loading}
          >
            S'inscrire
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
