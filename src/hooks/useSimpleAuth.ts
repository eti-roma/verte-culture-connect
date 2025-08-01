import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

export const useSimpleAuth = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const normalizePhone = (phone: string) => {
    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // If it already starts with +, return as is
    if (cleaned.startsWith('+')) {
      return cleaned;
    }
    
    // If it starts with 0, assume it's a local number and needs country code
    // This will be handled by react-phone-input-2 component
    return cleaned;
  };

  const isValidPhone = (phone: string) => {
    const cleaned = normalizePhone(phone);
    return /^\+[1-9]\d{6,14}$/.test(cleaned);
  };

  const sendOTP = async (phone: string) => {
    setLoading(true);
    try {
      const normalizedPhone = normalizePhone(phone);
      
      if (!isValidPhone(normalizedPhone)) {
        throw new Error(t('invalid_phone'));
      }

      const { error } = await supabase.auth.signInWithOtp({
        phone: normalizedPhone
      });

      if (error) throw error;

      toast({
        title: t('code_sent', { phone: normalizedPhone }),
        description: t('enter_code'),
      });

      return { success: true, phone: normalizedPhone };
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || t('invalid_phone'),
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (phone: string, token: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms'
      });

      if (error) throw error;

      // Check if this is a new user (first time verification)
      const isNewUser = data.user?.phone_confirmed_at === data.user?.created_at;

      toast({
        title: isNewUser ? t('welcome') : t('welcome_back'),
        description: t('verification_success'),
      });

      return { success: true, isNewUser, user: data.user };
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || t('code_invalid'),
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const saveUserProfile = async (userId: string, name: string, phone: string, location?: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          username: name,
          phone,
          location,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: t('save'),
        description: 'Profile saved successfully',
      });

      return { success: true };
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    sendOTP,
    verifyOTP,
    saveUserProfile,
    isValidPhone,
  };
};