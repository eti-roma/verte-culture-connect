import React, { useState } from 'react';
import { useFormation } from '@/hooks/useFormationData';
import ModuleCard from './ModuleCard';
import LeconCard from './LeconCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, GraduationCap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const FormationPage = () => {
  const { modules, lecons, loading, error, loadLecons } = useFormation();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedModuleTitle, setSelectedModuleTitle] = useState<string>('');

  const handleModuleSelect = async (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    setSelectedModule(moduleId);
    setSelectedModuleTitle(module?.titre || '');
    await loadLecons(moduleId);
  };

  const handleBack = () => {
    setSelectedModule(null);
    setSelectedModuleTitle('');
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">Erreur de chargement</div>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          {selectedModule ? (
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour aux modules
              </Button>
            </div>
          ) : null}
          
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              {selectedModule ? (
                <BookOpen className="w-8 h-8 text-primary" />
              ) : (
                <GraduationCap className="w-8 h-8 text-primary" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {selectedModule ? selectedModuleTitle : 'Formation au Fourrage Hydroponique'}
            </h1>
            <p className="text-muted-foreground">
              {selectedModule 
                ? 'Suivez les leçons dans l\'ordre pour une meilleure compréhension'
                : 'Apprenez les techniques modernes de production de fourrage hydroponique'
              }
            </p>
          </div>
        </div>

        {/* Content */}
        {!selectedModule ? (
          // Modules Grid
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-lg" />
              ))
            ) : (
              modules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  onSelect={handleModuleSelect}
                />
              ))
            )}
          </div>
        ) : (
          // Lecons Grid
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-lg" />
              ))
            ) : lecons.length > 0 ? (
              lecons.map((lecon) => (
                <LeconCard
                  key={lecon.id}
                  lecon={lecon}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-muted-foreground">
                  Aucune leçon disponible pour ce module
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormationPage;