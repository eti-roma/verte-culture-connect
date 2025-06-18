
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const { loading, resetPassword, isEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEmail(email)) {
      return;
    }
    
    const result = await resetPassword(email);
    if (result.success) {
      onBack();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md space-y-6 animate-fade-in border">
      <h1 className="text-2xl font-bold text-center">Mot de passe oublié</h1>
      <p className="text-sm text-gray-600 text-center">
        Saisissez votre adresse email pour recevoir un lien de réinitialisation.
      </p>
      
      <Input
        required
        type="email"
        placeholder="Adresse email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      
      <Button className="w-full" type="submit" disabled={loading || !isEmail(email)}>
        {loading ? "Envoi en cours..." : "Envoyer le lien"}
      </Button>
      
      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        className="w-full text-emerald-700 hover:text-emerald-800"
        disabled={loading}
      >
        Retour à la connexion
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
