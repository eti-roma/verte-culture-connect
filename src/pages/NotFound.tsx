import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useSEO } from '@/hooks/useSEO';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useSEO({
    title: "Page non trouvée - HydroFourrage Pro",
    description: "La page que vous recherchez n'existe pas. Retournez à l'accueil de HydroFourrage Pro",
    canonical: `${window.location.origin}/404`
  });

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-950 transition-colors duration-300">
      <div className="text-center space-y-6 px-4">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-emerald-600 dark:text-emerald-400">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Page non trouvée
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </Button>
          
          <Link to="/">
            <Button className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700">
              <Home className="w-4 h-4" />
              <span>Accueil</span>
            </Button>
          </Link>
        </div>
        
        <div className="mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Besoin d'aide ? Contactez notre support technique.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
