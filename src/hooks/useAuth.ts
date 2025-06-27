
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isPhone = (value: string) => /^(\+33|0)[1-9](\d{8})$/.test(value.replace(/\s/g, ""));

  const normalizePhone = (phone: string) => {
    const cleaned = phone.replace(/\s/g, "");
    if (cleaned.startsWith("0")) {
      return "+33" + cleaned.substring(1);
    }
    return cleaned;
  };

  const signUp = async (identity: string, password: string, username: string, phone: string, city: string) => {
    setLoading(true);
    try {
      if (isEmail(identity)) {
        const { data, error } = await supabase.auth.signUp({
          email: identity,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        if (error) throw error;
        
        const userId = data.user?.id;
        if (userId) {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              id: userId,
              username,
              phone: isPhone(phone) ? normalizePhone(phone) : null,
              location: city,
            });
          if (profileError) throw profileError;
        }
        
        toast({ 
          title: "Inscription réussie", 
          description: "Vérifie ton email pour confirmer ton compte." 
        });
        return { success: true };
      } else if (isPhone(identity)) {
        // Pour les téléphones, on utilise l'inscription classique avec mot de passe
        const phoneNorm = normalizePhone(identity);
        const { data, error } = await supabase.auth.signUp({
          phone: phoneNorm,
          password,
        });
        if (error) throw error;
        
        const userId = data.user?.id;
        if (userId) {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              id: userId,
              username,
              phone: phoneNorm,
              location: city,
            });
          if (profileError) throw profileError;
        }
        
        toast({
          title: "Vérification requise",
          description: "Un code a été envoyé par SMS pour confirmer ton compte.",
        });
        return { success: true, requiresVerification: true, phone: phoneNorm };
      } else {
        throw new Error("Format invalide. Utilisez un email ou un numéro français (ex: 06 12 34 56 78)");
      }
    } catch (error: any) {
      let errorMessage = "Erreur lors de l'inscription";
      
      if (error.message?.includes("User already registered")) {
        errorMessage = "Ce compte existe déjà. Essayez de vous connecter.";
      } else if (error.message?.includes("Invalid phone")) {
        errorMessage = "Numéro de téléphone invalide. Utilisez le format français (ex: 06 12 34 56 78)";
      } else if (error.message?.includes("Password")) {
        errorMessage = "Le mot de passe doit contenir au moins 6 caractères.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Erreur d'inscription",
        description: errorMessage,
        variant: "destructive"
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (identity: string, password: string) => {
    setLoading(true);
    try {
      if (isEmail(identity)) {
        const { error } = await supabase.auth.signInWithPassword({
          email: identity,
          password,
        });
        if (error) throw error;
        
        toast({ title: "Connexion réussie" });
        return { success: true };
      } else if (isPhone(identity)) {
        const phoneNorm = normalizePhone(identity);
        // Correction : utiliser signInWithPassword pour les comptes avec mot de passe
        const { error } = await supabase.auth.signInWithPassword({
          phone: phoneNorm,
          password,
        });
        if (error) throw error;
        
        toast({ title: "Connexion réussie" });
        return { success: true };
      } else {
        throw new Error("Format invalide. Utilisez un email ou un numéro français (ex: 06 12 34 56 78)");
      }
    } catch (error: any) {
      let errorMessage = "Erreur lors de la connexion";
      
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Identifiants incorrects. Vérifiez votre email/téléphone et mot de passe.";
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Veuillez confirmer votre email avant de vous connecter.";
      } else if (error.message?.includes("Phone not confirmed")) {
        errorMessage = "Veuillez confirmer votre numéro de téléphone avant de vous connecter.";
      } else if (error.message?.includes("Invalid phone")) {
        errorMessage = "Numéro de téléphone invalide. Utilisez le format français (ex: 06 12 34 56 78)";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive"
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signInWithOTP = async (phone: string) => {
    setLoading(true);
    try {
      const phoneNorm = normalizePhone(phone);
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNorm
      });
      if (error) throw error;
      
      toast({
        title: "Code envoyé",
        description: "Un code de connexion a été envoyé par SMS.",
      });
      return { success: true, requiresVerification: true, phone: phoneNorm };
    } catch (error: any) {
      let errorMessage = "Erreur lors de l'envoi du SMS";
      
      if (error.message?.includes("Invalid phone")) {
        errorMessage = "Numéro de téléphone invalide. Utilisez le format français (ex: 06 12 34 56 78)";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Erreur SMS",
        description: errorMessage,
        variant: "destructive"
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (phone: string, token: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms'
      });
      if (error) throw error;
      
      toast({ title: "Vérification réussie" });
      return { success: true };
    } catch (error: any) {
      let errorMessage = "Le code saisi est invalide ou expiré.";
      
      if (error.message?.includes("Token has expired")) {
        errorMessage = "Le code a expiré. Demandez un nouveau code.";
      } else if (error.message?.includes("Invalid token")) {
        errorMessage = "Code incorrect. Vérifiez et réessayez.";
      }

      toast({
        title: "Code incorrect",
        description: errorMessage,
        variant: "destructive"
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });
      if (error) throw error;
      
      toast({
        title: "Email envoyé",
        description: "Vérifie ton email pour réinitialiser ton mot de passe.",
      });
      return { success: true };
    } catch (error: any) {
      let errorMessage = "Erreur lors de l'envoi de l'email";
      
      if (error.message?.includes("Email not found")) {
        errorMessage = "Aucun compte associé à cette adresse email.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    signUp,
    signIn,
    signInWithOTP,
    verifyOTP,
    resetPassword,
    isEmail,
    isPhone,
  };
};
