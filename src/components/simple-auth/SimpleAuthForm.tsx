import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { useNavigate } from 'react-router-dom';
import SimplePhoneInput from './PhoneInput';
import OTPInput from './OTPInput';
import ProfileSetup from './ProfileSetup';
import { ThemeToggle } from '@/components/ThemeToggle';
import { User } from '@supabase/supabase-js';

type AuthStep = 'phone' | 'otp' | 'profile';

const SimpleAuthForm = () => {
  const [step, setStep] = useState<AuthStep>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  
  const { t } = useTranslation();
  const { loading, sendOTP, verifyOTP } = useSimpleAuth();
  const navigate = useNavigate();

  // Resend timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handlePhoneSubmit = async () => {
    const result = await sendOTP(phone);
    if (result.success) {
      setPhone(result.phone!);
      setStep('otp');
      setResendTimer(60); // 60 seconds cooldown
    }
  };

  const handleOTPSubmit = async () => {
    const result = await verifyOTP(phone, otp);
    if (result.success) {
      setUser(result.user!);
      if (result.isNewUser) {
        setStep('profile');
      } else {
        navigate('/', { replace: true });
      }
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer === 0) {
      const result = await sendOTP(phone);
      if (result.success) {
        setResendTimer(60);
        setOtp('');
      }
    }
  };

  const handleProfileComplete = () => {
    navigate('/', { replace: true });
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('phone');
      setOtp('');
    } else if (step === 'profile') {
      setStep('otp');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {step === 'phone' && (
        <div className="w-full max-w-md mx-auto bg-background border border-border rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t('welcome')}
            </h1>
            <p className="text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>

          <div className="space-y-6">
            <SimplePhoneInput
              value={phone}
              onChange={setPhone}
              disabled={loading}
            />

            <Button
              onClick={handlePhoneSubmit}
              disabled={loading || !phone}
              className="w-full h-14 text-lg font-semibold rounded-xl"
            >
              {loading ? t('loading') : t('continue')}
            </Button>
          </div>
        </div>
      )}

      {step === 'otp' && (
        <div className="w-full max-w-md mx-auto bg-background border border-border rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔐</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {t('enter_code')}
            </h1>
            <p className="text-muted-foreground">
              {t('code_sent', { phone })}
            </p>
          </div>

          <div className="space-y-6">
            <OTPInput
              value={otp}
              onChange={setOtp}
              disabled={loading}
            />

            <Button
              onClick={handleOTPSubmit}
              disabled={loading || otp.length !== 6}
              className="w-full h-14 text-lg font-semibold rounded-xl"
            >
              {loading ? t('loading') : t('verify')}
            </Button>

            <div className="text-center space-y-2">
              <Button
                variant="ghost"
                onClick={handleResendOTP}
                disabled={loading || resendTimer > 0}
                className="text-muted-foreground hover:text-foreground"
              >
                {resendTimer > 0 ? `${t('resend_code')} (${resendTimer}s)` : t('resend_code')}
              </Button>

              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={loading}
                className="w-full text-muted-foreground hover:text-foreground"
              >
                {t('back')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {step === 'profile' && user && (
        <ProfileSetup
          user={user}
          phone={phone}
          onComplete={handleProfileComplete}
        />
      )}
    </div>
  );
};

export default SimpleAuthForm;