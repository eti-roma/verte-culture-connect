
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isPhone = (value: string) => /^((\+?\d{1,3})?\s?\d{6,20})$/.test(value.replace(/\s/g, ""));

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
              phone,
              location: city,
            });
          if (profileError) throw profileError;
        }
        
        toast({ title: "Inscription réussie", description: "Vérifie ton email pour confirmer ton compte." });
        return { success: true };
      } else if (isPhone(identity)) {
        const phoneNorm = identity.replace(/\s/g, "");
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
          description: "Un code a été envoyé par SMS.",
        });
        return { success: true, requiresVerification: true, phone: phoneNorm };
      } else {
        throw new Error("Veuillez entrer un email ou numéro valide");
      }
    } catch (error: any) {
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Erreur lors de l'inscription",
        variant: "destructive"
      });
      return { success: false, error: error.message };
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
        const phoneNorm = identity.replace(/\s/g, "");
        const { error } = await supabase.auth.signInWithOtp({
          phone: phoneNorm
        });
        if (error) throw error;
        
        toast({
          title: "Vérification requise",
          description: "Un code a été envoyé par SMS.",
        });
        return { success: true, requiresVerification: true, phone: phoneNorm };
      } else {
        throw new Error("Veuillez entrer un email ou numéro valide");
      }
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Erreur lors de la connexion",
        variant: "destructive"
      });
      return { success: false, error: error.message };
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
      toast({
        title: "Code incorrect",
        description: "Le code saisi est invalide ou expiré.",
        variant: "destructive"
      });
      return { success: false, error: error.message };
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
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'envoi de l'email",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    signUp,
    signIn,
    verifyOTP,
    resetPassword,
    isEmail,
    isPhone,
  };
};
