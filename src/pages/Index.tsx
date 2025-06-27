
import React, { useState, useEffect } from 'react';
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
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

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
      toast({ title: "Déconnexion réussie" });
      navigate("/auth");
    } catch (error) {
      toast({ 
        title: "Erreur", 
        description: "Erreur lors de la déconnexion",
        variant: "destructive" 
      });
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="w-full flex justify-end items-center px-4 pt-2">
        <span className="text-xs text-muted-foreground mr-2">
          {user?.email || 'Utilisateur connecté'}
        </span>
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
