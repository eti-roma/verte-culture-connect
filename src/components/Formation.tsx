import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BookOpen, User, GraduationCap, Library, ExternalLink, Play } from 'lucide-react';
import { RealFormationModule } from './formation/RealFormationModule';
import { useFormation } from '@/hooks/useFormation';
import { useTrainingProgress } from '@/hooks/useTrainingProgress';
import { Skeleton } from '@/components/ui/skeleton';

export const Formation = () => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const { data: courses, isLoading } = useFormation();
  const { data: moduleCompletion } = useTrainingProgress('all');

  const modules = [
    {
      id: 'basics',
      title: 'Fondamentaux du Fourrage Hydroponique',
      description: 'Découvrez les principes de base de la culture hydroponique',
      duration: '45 min',
      level: 'Débutant',
      lessons: 8,
      content: [
        'Introduction à l\'hydroponie',
        'Choix des graines et variétés',
        'Équipement nécessaire',
        'Conditions environnementales',
      ]
    },
    {
      id: 'setup',
      title: 'Installation et Configuration',
      description: 'Apprenez à installer votre système de production',
      duration: '60 min',
      level: 'Intermédiaire',
      lessons: 12,
      content: [
        'Préparation de l\'espace',
        'Installation du système d\'irrigation',
        'Configuration de l\'éclairage',
        'Mise en place du contrôle climatique',
      ]
    },
    {
      id: 'production',
      title: 'Cycle de Production Complet',
      description: 'Maîtrisez tous les aspects de la production',
      duration: '90 min',
      level: 'Avancé',
      lessons: 15,
      content: [
        'Semis et germination',
        'Gestion des nutriments',
        'Suivi quotidien',
        'Récolte et post-récolte',
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Résolution de Problèmes',
      description: 'Identifiez et résolvez les problèmes courants',
      duration: '30 min',
      level: 'Expert',
      lessons: 6,
      content: [
        'Maladies et parasites',
        'Problèmes nutritionnels',
        'Défaillances techniques',
        'Optimisation des rendements',
      ]
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Débutant': return 'bg-green-100 text-green-800';
      case 'Intermédiaire': return 'bg-blue-100 text-blue-800';
      case 'Avancé': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtenir les cours liés à un module
  const getModuleCourses = (moduleId: string) => {
    if (!courses) return [];
    // Mapper les IDs de modules aux noms de modules dans la base de données
    const moduleMapping = {
      'basics': 'Physiologie',
      'setup': 'Environnement', 
      'production': 'Nutrition',
      'troubleshooting': 'Maladies'
    };
    const moduleName = moduleMapping[moduleId as keyof typeof moduleMapping];
    return courses.filter(course => course.module === moduleName);
  };

  if (selectedModule) {
    const module = modules.find(m => m.id === selectedModule);
    const moduleCourses = getModuleCourses(selectedModule);
    const progress = Math.floor(Math.random() * 100); // Simulation de progression

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedModule(null)}
            className="text-green-600 hover:text-green-700"
          >
            ← Retour aux modules
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <BookOpen className="w-6 h-6 text-green-600" />
              <div>
                <CardTitle className="text-2xl">{module?.title}</CardTitle>
                <CardDescription className="text-lg">{module?.description}</CardDescription>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <Badge className={getLevelColor(module?.level || '')}>
                {module?.level}
              </Badge>
              <Badge variant="outline">{module?.duration}</Badge>
              <Badge variant="outline">{module?.lessons} leçons</Badge>
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
          
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contenu du module :</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {module?.content.map((lesson, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-gray-800">{lesson}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cours disponibles pour ce module */}
            {moduleCourses.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ressources complémentaires :</h3>
                <div className="grid grid-cols-1 gap-4">
                  {moduleCourses.map((course) => (
                    <Card key={course.id} className="border border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{course.title}</h4>
                            {course.description && (
                              <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                            )}
                          </div>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(course.url, '_blank', 'noopener,noreferrer')}
                            className="ml-4"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Accéder
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
              <Play className="w-4 h-4 mr-2" />
              Commencer le Module
            </Button>
          </CardContent>
        </Card>
      </div>
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
            {modules.map((module) => {
              const moduleCourses = getModuleCourses(module.id);
              const progress = Math.floor(Math.random() * 100); // Simulation
              
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
                      <Badge className={getLevelColor(module.level)}>
                        {module.level}
                      </Badge>
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{module.lessons} leçons</span>
                      </Badge>
                      <Badge variant="outline">{module.duration}</Badge>
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