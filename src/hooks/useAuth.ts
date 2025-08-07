
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  
  // Improved phone validation for international numbers
  const isPhone = (value: string) => {
    const cleaned = value.replace(/[\s\-\(\)]/g, "");
    // Check if it's a valid international phone number (starts with + and has 7-15 digits)
    return /^\+[1-9]\d{6,14}$/.test(cleaned);
  };

  const normalizePhone = (phone: string) => {
    // Remove all spaces, dashes, parentheses
    const cleaned = phone.replace(/[\s\-\(\)]/g, "");
    
    // If it already starts with +, return as is
    if (cleaned.startsWith("+")) {
      return cleaned;
    }
    
    // If it starts with 0, assume it's French number
    if (cleaned.startsWith("0")) {
      return "+33" + cleaned.substring(1);
    }
    
    // If it starts with 6, 7, 8, or 9 and has 8-9 digits, assume it's Cameroon
    if (/^[6789]\d{7,8}$/.test(cleaned)) {
      return "+237" + cleaned;
    }
    
    // Otherwise, return the cleaned number (assuming it's already international format without +)
    return "+" + cleaned;
  };

  const signUp = async (email: string, password: string, username: string, _: string, city: string) => {
    setLoading(true);
    try {
      if (!isEmail(email)) {
        throw new Error("Format invalide. Utilisez une adresse email valide.");
      }

      const { data, error } = await supabase.auth.signUp({
        email,
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
            phone: null,
            location: city,
          });
        if (profileError) throw profileError;
      }
      
      toast({ 
        title: "Inscription réussie", 
        description: "Votre compte a été créé avec succès." 
      });
      return { success: true };
    } catch (error: any) {
      let errorMessage = "Erreur lors de l'inscription";
      
      if (error.message?.includes("User already registered")) {
        errorMessage = "Ce compte existe déjà. Essayez de vous connecter.";
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
      if (!isEmail(identity)) {
        throw new Error("Format invalide. Utilisez une adresse email valide.");
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: identity,
        password,
      });
      if (error) throw error;
      
      toast({ title: "Connexion réussie" });
      return { success: true };
    } catch (error: any) {
      let errorMessage = "Erreur lors de la connexion";
      
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Email ou mot de passe incorrect.";
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Veuillez confirmer votre email avant de vous connecter.";
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
    verifyOTP,
    resetPassword,
    isEmail,
    isPhone,
  };
};
