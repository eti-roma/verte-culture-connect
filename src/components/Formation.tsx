
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, User, GraduationCap, Library, CheckCircle, Clock, Users, Play } from 'lucide-react';
import { RealFormationModule } from './formation/RealFormationModule';
import { InteractiveModuleViewer } from './formation/InteractiveModuleViewer';
import { useTrainingModules } from '@/hooks/useTrainingModules';
import { useTrainingProgress, useModuleCompletion } from '@/hooks/useTrainingProgress';
import { Skeleton } from '@/components/ui/skeleton';

export const Formation = () => {
  const { data: modules, isLoading } = useTrainingModules();
  const { data: completion } = useModuleCompletion();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // If a module is selected, show the module viewer
  if (selectedModule) {
    const selectedModuleData = modules?.find(m => m.id === selectedModule);
    return (
      <InteractiveModuleViewer
        moduleId={selectedModule}
        moduleTitle={selectedModuleData?.title || 'Module de Formation'}
        onBack={() => setSelectedModule(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Formation Professionnelle
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Développez vos compétences en production de fourrage hydroponique avec nos modules de formation interactifs
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Votre Progression</h3>
            <div className="flex justify-center items-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {completion?.completedModules || 0}
                </div>
                <p className="text-sm text-muted-foreground">Modules terminés</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {completion?.totalModules || 0}
                </div>
                <p className="text-sm text-muted-foreground">Modules disponibles</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {completion?.totalModules ? 
                    Math.round(((completion?.completedModules || 0) / completion.totalModules) * 100)
                    : 0}%
                </div>
                <p className="text-sm text-muted-foreground">Progression totale</p>
              </div>
            </div>
            <Progress 
              value={completion?.totalModules ? 
                ((completion?.completedModules || 0) / completion.totalModules) * 100
                : 0} 
              className="max-w-md mx-auto"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="interactive" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="interactive" className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4" />
            <span>Modules Interactifs</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center space-x-2">
            <Library className="w-4 h-4" />
            <span>Ressources</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="interactive" className="space-y-6 mt-6">
          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules?.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                onSelect={() => setSelectedModule(module.id)}
              />
            ))}
          </div>

          {/* Empty State */}
          {!modules || modules.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucun module disponible</h3>
                <p className="text-muted-foreground">
                  Les modules de formation seront bientôt disponibles.
                </p>
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <RealFormationModule />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ModuleCardProps {
  module: any;
  onSelect: () => void;
}

const ModuleCard = ({ module, onSelect }: ModuleCardProps) => {
  const { data: progress } = useTrainingProgress(module.id);

  const getStatusBadge = () => {
    const progressPercentage = progress?.progress_percentage || 0;
    
    if (progressPercentage === 0) {
      return <Badge variant="secondary">Non commencé</Badge>;
    } else if (progressPercentage === 100) {
      return <Badge className="bg-green-600">Terminé</Badge>;
    } else {
      return <Badge variant="outline">En cours</Badge>;
    }
  };

  const getActionButton = () => {
    const progressPercentage = progress?.progress_percentage || 0;
    
    if (progressPercentage === 0) {
      return (
        <Button onClick={onSelect} className="w-full">
          <Play className="w-4 h-4 mr-2" />
          Commencer
        </Button>
      );
    } else if (progressPercentage === 100) {
      return (
        <Button onClick={onSelect} variant="outline" className="w-full">
          <CheckCircle className="w-4 h-4 mr-2" />
          Revoir
        </Button>
      );
    } else {
      return (
        <Button onClick={onSelect} className="w-full">
          <Play className="w-4 h-4 mr-2" />
          Continuer
        </Button>
      );
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          {getStatusBadge()}
        </div>
        
        <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
          {module.title}
        </CardTitle>
        
        {module.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {module.description}
          </p>
        )}
        
        {/* Progress Bar */}
        {progress && progress.progress_percentage > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progression</span>
              <span className="font-medium">{progress.progress_percentage}%</span>
            </div>
            <Progress value={progress.progress_percentage} className="h-2" />
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>~30 min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>Interactif</span>
          </div>
        </div>
        
        {getActionButton()}
      </CardContent>
    </Card>
  );
};
