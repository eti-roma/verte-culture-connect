import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BookOpen, User, GraduationCap, Library, ExternalLink, Play } from 'lucide-react';
import { RealFormationModule } from './formation/RealFormationModule';
import { TrainingPlayer } from './training/TrainingPlayer';
import { useFormation } from '@/hooks/useFormation';
import { useTrainingModules } from '@/hooks/useTrainingModules';
import { useTrainingProgress } from '@/hooks/useTrainingProgress';
import { Skeleton } from '@/components/ui/skeleton';

export const Formation = () => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const { data: courses, isLoading: coursesLoading } = useFormation();
  const { data: modules, isLoading: modulesLoading } = useTrainingModules();
  const { data: overallProgress } = useTrainingProgress('all');

  const isLoading = coursesLoading || modulesLoading;

  // Use real modules from database or fallback to static ones
  const displayModules = modules?.length ? modules : [
    {
      id: 'basics',
      title: 'Fondamentaux du Fourrage Hydroponique',
      description: 'Découvrez les principes de base de la culture hydroponique',
      duration_minutes: 45,
      order_index: 1
    },
    {
      id: 'setup',
      title: 'Installation et Configuration',
      description: 'Apprenez à installer votre système de production',
      duration_minutes: 60,
      order_index: 2
    },
    {
      id: 'production',
      title: 'Cycle de Production Complet',
      description: 'Maîtrisez tous les aspects de la production',
      duration_minutes: 90,
      order_index: 3
    },
    {
      id: 'troubleshooting',
      title: 'Résolution de Problèmes',
      description: 'Identifiez et résolvez les problèmes courants',
      duration_minutes: 30,
      order_index: 4
    }
  ];

  const getLevelColor = (orderIndex: number) => {
    switch (orderIndex) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-orange-100 text-orange-800';
      case 4: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelName = (orderIndex: number) => {
    switch (orderIndex) {
      case 1: return 'Débutant';
      case 2: return 'Intermédiaire';
      case 3: return 'Avancé';
      case 4: return 'Expert';
      default: return 'Débutant';
    }
  };

  // Obtenir les cours liés à un module
  const getModuleCourses = (moduleTitle: string) => {
    if (!courses) return [];
    // Mapper les titres de modules aux noms de modules dans la base de données
    const moduleMapping: Record<string, string> = {
      'Fondamentaux du Fourrage Hydroponique': 'Physiologie',
      'Installation et Configuration': 'Environnement', 
      'Cycle de Production Complet': 'Nutrition',
      'Résolution de Problèmes': 'Maladies'
    };
    const moduleName = moduleMapping[moduleTitle];
    return moduleName ? courses.filter(course => course.module === moduleName) : [];
  };

  const getModuleProgress = (moduleId: string) => {
    if (!overallProgress || !('progressData' in overallProgress) || !overallProgress.progressData) return 0;
    const moduleProgress = overallProgress.progressData.filter(p => p.module_id === moduleId);
    if (moduleProgress.length === 0) return 0;
    const totalProgress = moduleProgress.reduce((sum, p) => sum + p.progress_percentage, 0);
    return Math.round(totalProgress / moduleProgress.length);
  };

  if (selectedModule) {
    const module = displayModules.find(m => m.id === selectedModule);
    if (!module) return null;
    
    return (
      <TrainingPlayer 
        moduleId={selectedModule}
        moduleTitle={module.title}
        onBack={() => setSelectedModule(null)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
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

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Formation Professionnelle</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Développez vos compétences en production de fourrage hydroponique avec nos modules de formation
        </p>
      </div>

      <Tabs defaultValue="interactive" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="interactive" className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4" />
            <span>Modules Interactifs</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center space-x-2">
            <Library className="w-4 h-4" />
            <span>Ressources Officielles</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="interactive" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayModules.map((module) => {
              const moduleCourses = getModuleCourses(module.title);
              const progress = getModuleProgress(module.id);
              const levelName = getLevelName(module.order_index);
              const durationText = `${module.duration_minutes} min`;
              
              return (
                <Card 
                  key={module.id} 
                  className="hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                  onClick={() => setSelectedModule(module.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <CardDescription className="mt-1">{module.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge className={getLevelColor(module.order_index)}>
                        {levelName}
                      </Badge>
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>4 leçons</span>
                      </Badge>
                      <Badge variant="outline">{durationText}</Badge>
                      {moduleCourses.length > 0 && (
                        <Badge variant="secondary">
                          +{moduleCourses.length} ressources
                        </Badge>
                      )}
                    </div>
                    
                    {/* Barre de progression */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progression</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="w-full" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className="w-full hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                    >
                      {progress > 0 ? 'Continuer le Module' : 'Commencer le Module'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <RealFormationModule />
        </TabsContent>
      </Tabs>
    </div>
  );
};