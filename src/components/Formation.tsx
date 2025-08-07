
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Leaf, Droplets, User, GraduationCap, Library } from 'lucide-react';
import { RealFormationModule } from './formation/RealFormationModule';

export const Formation = () => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

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

  if (selectedModule) {
    const module = modules.find(m => m.id === selectedModule);
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
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contenu du module :</h3>
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
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white mt-6">
              Commencer le Module
            </Button>
          </CardContent>
        </Card>
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
            {modules.map((module) => (
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
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                  >
                    Accéder au Module
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">Certification Professionnelle</h3>
                  <p className="text-gray-600 mt-1">
                    Obtenez votre certification en production de fourrage hydroponique après avoir complété tous les modules
                  </p>
                </div>
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                  En Savoir Plus
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <RealFormationModule />
        </TabsContent>
      </Tabs>
    </div>
  );
};
