import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { User } from '@supabase/supabase-js';

interface ProfileSetupProps {
  user: User;
  phone: string;
  onComplete: () => void;
}

const ProfileSetup = ({ user, phone, onComplete }: ProfileSetupProps) => {
  const [name, setName] = useState('');
  const { t } = useTranslation();
  const { loading, saveUserProfile } = useSimpleAuth();

  const handleSave = async () => {
    if (name.trim()) {
      const result = await saveUserProfile(user.id, name.trim(), phone);
      if (result.success) {
        onComplete();
      }
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-background border border-border rounded-2xl p-8 shadow-xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">👋</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {t('setup_profile')}
        </h1>
        <p className="text-muted-foreground">
          {t('enter_name')}
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Input
            type="text"
            placeholder={t('name_placeholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="h-14 text-lg border-2 rounded-xl"
            autoFocus
          />
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleSave}
            disabled={loading || !name.trim()}
            className="w-full h-14 text-lg font-semibold rounded-xl"
          >
            {loading ? t('loading') : t('save')}
          </Button>

          <Button
            variant="ghost"
            onClick={handleSkip}
            disabled={loading}
            className="w-full h-12 text-muted-foreground hover:text-foreground"
          >
            {t('skip')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;