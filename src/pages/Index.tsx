
import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";

const Index = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-950 transition-colors duration-300">
      <div className="w-full flex justify-between items-center px-4 pt-4 pb-6">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-foreground">{t('common.welcome')}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <LanguageSelector showLabel={false} size="sm" />
          <span className="text-sm text-muted-foreground">
            {user?.email || user?.phone || 'Utilisateur'}
          </span>
          <Button size="sm" variant="outline" onClick={handleLogout}>
            {t('common.logout')}
          </Button>
        </div>
      </div>
      <main className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {t('common.appStarted')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('common.appDescription')}
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
