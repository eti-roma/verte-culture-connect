
import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/components/Dashboard';
import { Formation } from '@/components/Formation';
import { ProducerMap } from '@/components/ProducerMap';
import { AITracking } from '@/components/AITracking';
import { Community } from '@/components/Community';
import { CultureParameters } from '@/components/CultureParameters';
import { DiseasesPests } from '@/components/DiseasesPests';
import { PhotoAnalysis } from '@/components/ai/PhotoAnalysis';
import { CommunityHub } from '@/components/community/CommunityHub';
import { InteractiveTraining } from '@/components/training/InteractiveTraining';
import { DiagnosticChatbot } from '@/components/diseases/DiagnosticChatbot';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslations } from "@/hooks/useTranslations";
import { ThemeToggle } from "@/components/ThemeToggle";
import { OnlineStatusIndicator } from "@/components/OnlineStatusIndicator";

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslations();

  useEffect(() => {
    // Récupérer les informations de l'utilisateur
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      console.log("Déconnexion réussie");
      navigate("/auth");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'formation':
        return <InteractiveTraining />;
      case 'formation-basic':
        return <Formation />;
      case 'map':
        return <ProducerMap />;
      case 'ai-tracking':
        return <PhotoAnalysis />;
      case 'ai-tracking-basic':
        return <AITracking />;
      case 'parameters':
        return <CultureParameters />;
      case 'diseases':
        return <DiagnosticChatbot />;
      case 'diseases-basic':
        return <DiseasesPests />;
      case 'community':
        return <CommunityHub />;
      case 'community-basic':
        return <Community />;
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-950 transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement de l'application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-950 transition-colors duration-300">
      <div className="w-full flex justify-between items-center px-4 pt-2 space-x-4">
        <div className="flex items-center space-x-3">
          <LanguageSelector showLabel={false} size="sm" />
          <OnlineStatusIndicator />
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <span className="text-xs text-muted-foreground">
            {user?.email || t('common.user')}
          </span>
          <Button size="sm" variant="outline" onClick={handleLogout}>
            {t('common.logout')}
          </Button>
        </div>
      </div>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto px-4 py-6 transition-all duration-300">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
