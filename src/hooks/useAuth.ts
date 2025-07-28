
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

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
        
        console.log("Inscription réussie - Vérifie ton email pour confirmer ton compte.");
        return { success: true };
      } else if (isPhone(identity)) {
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
        
        console.log("Vérification requise - Un code a été envoyé par SMS.");
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

      console.error("Erreur d'inscription:", errorMessage);
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
        
        console.log("Connexion réussie");
        return { success: true };
      } else if (isPhone(identity)) {
        const phoneNorm = normalizePhone(identity);
        const { error } = await supabase.auth.signInWithOtp({
          phone: phoneNorm
        });
        if (error) throw error;
        
        console.log("Vérification requise - Un code a été envoyé par SMS.");
        return { success: true, requiresVerification: true, phone: phoneNorm };
      } else {
        throw new Error("Format invalide. Utilisez un email ou un numéro français (ex: 06 12 34 56 78)");
      }
    } catch (error: any) {
      let errorMessage = "Erreur lors de la connexion";
      
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Email ou mot de passe incorrect.";
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Veuillez confirmer votre email avant de vous connecter.";
      } else if (error.message?.includes("Invalid phone")) {
        errorMessage = "Numéro de téléphone invalide. Utilisez le format français (ex: 06 12 34 56 78)";
      } else if (error.message) {
        errorMessage = error.message;
      }

      console.error("Erreur de connexion:", errorMessage);
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
      
      console.log("Vérification réussie");
      return { success: true };
    } catch (error: any) {
      let errorMessage = "Le code saisi est invalide ou expiré.";
      
      if (error.message?.includes("Token has expired")) {
        errorMessage = "Le code a expiré. Demandez un nouveau code.";
      } else if (error.message?.includes("Invalid token")) {
        errorMessage = "Code incorrect. Vérifiez et réessayez.";
      }

      console.error("Code incorrect:", errorMessage);
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
      
      console.log("Email envoyé - Vérifie ton email pour réinitialiser ton mot de passe.");
      return { success: true };
    } catch (error: any) {
      let errorMessage = "Erreur lors de l'envoi de l'email";
      
      if (error.message?.includes("Email not found")) {
        errorMessage = "Aucun compte associé à cette adresse email.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      console.error("Erreur:", errorMessage);
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
