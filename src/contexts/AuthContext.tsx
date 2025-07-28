import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (identity: string, password: string, isPhone?: boolean) => Promise<{ success: boolean; error?: string; requiresVerification?: boolean; phone?: string }>;
  signIn: (identity: string, password: string) => Promise<{ success: boolean; error?: string; requiresVerification?: boolean; phone?: string }>;
  verifyOTP: (phone: string, token: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const isPhoneNumber = (value: string): boolean => {
    return /^(\+|0)[0-9]/.test(value.replace(/\s/g, ""));
  };

  const normalizePhone = (phone: string): string => {
    let normalized = phone.replace(/\s/g, "");
    if (!normalized.startsWith('+')) {
      if (normalized.startsWith('0')) {
        normalized = '+33' + normalized.substring(1);
      } else if (!normalized.startsWith('33')) {
        normalized = '+' + normalized;
      } else {
        normalized = '+' + normalized;
      }
    }
    return normalized;
  };

  const signUp = async (identity: string, password: string, isPhone?: boolean): Promise<{ success: boolean; error?: string; requiresVerification?: boolean; phone?: string }> => {
    try {
      setLoading(true);
      
      if (isPhone || (!isEmail(identity) && isPhoneNumber(identity))) {
        const normalizedPhone = normalizePhone(identity);
        
        const { error } = await supabase.auth.signUp({
          phone: normalizedPhone,
          password: password,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        return { 
          success: true, 
          requiresVerification: true, 
          phone: normalizedPhone 
        };
      } else {
        const redirectUrl = `${window.location.origin}/`;
        
        const { error } = await supabase.auth.signUp({
          email: identity,
          password: password,
          options: {
            emailRedirectTo: redirectUrl
          }
        });

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (identity: string, password: string): Promise<{ success: boolean; error?: string; requiresVerification?: boolean; phone?: string }> => {
    try {
      setLoading(true);
      
      if (!isEmail(identity) && isPhoneNumber(identity)) {
        const normalizedPhone = normalizePhone(identity);
        
        const { error } = await supabase.auth.signInWithPassword({
          phone: normalizedPhone,
          password: password,
        });

        if (error) {
          if (error.message.includes('phone not confirmed')) {
            const { error: otpError } = await supabase.auth.signInWithOtp({
              phone: normalizedPhone
            });
            
            if (otpError) {
              return { success: false, error: otpError.message };
            }
            
            return { 
              success: true, 
              requiresVerification: true, 
              phone: normalizedPhone 
            };
          }
          return { success: false, error: error.message };
        }

        return { success: true };
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: identity,
          password: password,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (phone: string, token: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.verifyOtp({
        phone: phone,
        token: token,
        type: 'sms'
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      const redirectUrl = `${window.location.origin}/auth?mode=reset`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    verifyOTP,
    resetPassword,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};