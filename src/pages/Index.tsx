
import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/components/Dashboard';
import { Formation } from '@/components/Formation';
import { ProducerMap } from '@/components/ProducerMap';
import { AITracking } from '@/components/AITracking';
import { Community } from '@/components/Community';
import { CultureParameters } from '@/components/CultureParameters';
import { DiseasesPests } from '@/components/DiseasesPests';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = ({ user, session }: { user: any, session: any }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Déconnexion réussie" });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'formation':
        return <Formation />;
      case 'map':
        return <ProducerMap />;
      case 'ai-tracking':
        return <AITracking />;
      case 'parameters':
        return <CultureParameters />;
      case 'diseases':
        return <DiseasesPests />;
      case 'community':
        return <Community />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="w-full flex justify-end items-center px-4 pt-2">
        <span className="text-xs text-muted-foreground mr-2">{user?.email}</span>
        <Button size="sm" variant="outline" onClick={handleLogout}>
          Se déconnecter
        </Button>
      </div>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto px-4 py-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
