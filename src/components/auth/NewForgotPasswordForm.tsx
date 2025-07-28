import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface NewForgotPasswordFormProps {
  onBack: () => void;
}

const NewForgotPasswordForm = ({ onBack }: NewForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword, loading } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await resetPassword(email);
    
    if (result.success) {
      setIsSubmitted(true);
      toast.success("Email de réinitialisation envoyé !");
    } else {
      toast.error(result.error || "Erreur lors de l'envoi");
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Email envoyé !
          </h2>
          <p className="text-sm text-muted-foreground">
            {t('auth.checkEmail')}
          </p>
        </div>
        
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="w-full"
        >
          {t('auth.backToLogin')}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            {t('auth.email')}
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.email')}
            disabled={loading}
            required
          />
        </div>
      </div>
      
      <Button 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium" 
        type="submit" 
        disabled={loading || !email}
        size="lg"
      >
        {loading ? t('auth.loading') : t('auth.sendResetEmail')}
      </Button>
      
      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        className="w-full text-primary hover:text-primary/80"
        disabled={loading}
      >
        {t('auth.backToLogin')}
      </Button>
    </form>
  );
};

export default NewForgotPasswordForm;