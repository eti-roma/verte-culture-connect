
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
      console.log("Déconnexion réussie");
      navigate("/auth");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
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
      <div className="w-full flex justify-between items-center px-4 pt-4 pb-6">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-foreground">Bienvenue</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            {user?.email || 'Utilisateur'}
          </span>
          <Button size="sm" variant="outline" onClick={handleLogout}>
            Déconnexion
          </Button>
        </div>
      </div>
      <main className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Application démarrée avec succès !
          </h2>
          <p className="text-lg text-muted-foreground">
            L'erreur useState a été corrigée. Vous pouvez maintenant développer votre application.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
