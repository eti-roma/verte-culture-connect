
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const WelcomeBanner = () => {
  return (
    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
      <CardContent className="pt-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            🎉 Application HydroFourrage Pro - Version Multilingue Complète
          </h3>
          <p className="text-green-700">
            Votre application est maintenant multilingue avec des graphiques dynamiques ! 
            Changez de langue et explorez les graphiques interactifs.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
