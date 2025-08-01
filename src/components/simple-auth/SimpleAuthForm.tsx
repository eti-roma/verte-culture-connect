import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const SimpleAuthForm = () => {
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  
  const { loading, sendOTP, verifyOTP } = useSimpleAuth();
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    setMessage('');
    const result = await sendOTP(phone);
    if (result.success) {
      setOtpSent(true);
      setMessage("Un code a été envoyé par SMS.");
    } else {
      setMessage('Erreur lors de l\'envoi du code : ' + result.error);
    }
  };

  const handleVerifyOtp = async () => {
    const result = await verifyOTP(phone, otp);
    if (result.success) {
      setMessage('Connexion réussie. Bienvenue !');
      // Redirection automatique vers l'accueil
      navigate('/', { replace: true });
    } else {
      setMessage('Erreur de vérification : ' + result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm mx-auto bg-background border border-border rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📱</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Connexion / Inscription
          </h2>
          <p className="text-muted-foreground text-sm">
            Entrez votre numéro de téléphone pour continuer
          </p>
        </div>

        <div className="space-y-4">
          <PhoneInput
            country={'cm'}
            enableSearch={true}
            value={phone}
            onChange={setPhone}
            containerClass="w-full"
            inputClass="!w-full !h-12 !text-base !border-2 !border-border !bg-background !text-foreground focus:!border-primary"
            buttonClass="!border-2 !border-border !bg-background hover:!bg-accent"
            dropdownClass="!bg-background !border-border !shadow-lg"
            searchClass="!bg-background !text-foreground !border-border"
            placeholder="Numéro de téléphone"
            disabled={loading}
          />

          {!otpSent ? (
            <Button
              onClick={handleSendOtp}
              disabled={loading || !phone}
              className="w-full h-12 text-base font-semibold rounded-xl"
            >
              {loading ? 'Envoi...' : 'Recevoir le code'}
            </Button>
          ) : (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Code reçu par SMS"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full h-12 text-base border-2 rounded-xl text-center text-lg font-mono tracking-widest"
                maxLength={6}
                disabled={loading}
              />
              <Button
                onClick={handleVerifyOtp}
                disabled={loading || !otp}
                className="w-full h-12 text-base font-semibold rounded-xl"
              >
                {loading ? 'Vérification...' : 'Se connecter'}
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                  setMessage('');
                }}
                disabled={loading}
                className="w-full text-muted-foreground hover:text-foreground"
              >
                Modifier le numéro
              </Button>
            </div>
          )}

          {message && (
            <div className={`text-sm text-center p-3 rounded-lg ${
              message.includes('Erreur') 
                ? 'bg-destructive/10 text-destructive' 
                : 'bg-primary/10 text-primary'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleAuthForm;