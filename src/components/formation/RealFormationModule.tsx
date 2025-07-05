
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ExternalLink, Filter, Users } from 'lucide-react';
import { useFormation } from '@/hooks/useFormation';
import { Skeleton } from '@/components/ui/skeleton';

export const RealFormationModule = () => {
  const { data: courses, isLoading, error } = useFormation();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Erreur lors du chargement des formations</p>
      </div>
    );
  }

  const modules = [...new Set(courses?.map(course => course.module) || [])];
  const filteredCourses = selectedModule 
    ? courses?.filter(course => course.module === selectedModule)
    : courses;

  const getModuleColor = (module: string) => {
    const colors = {
      'Physiologie': 'bg-green-100 text-green-800',
      'Germination': 'bg-blue-100 text-blue-800',
      'Nutrition': 'bg-orange-100 text-orange-800',
      'Environnement': 'bg-purple-100 text-purple-800',
      'Maladies': 'bg-red-100 text-red-800',
    };
    return colors[module as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Ressources de Formation</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Accédez à des ressources pédagogiques de qualité provenant d'organismes reconnus
        </p>
      </div>

      {/* Filtres par module */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={selectedModule === null ? "default" : "outline"}
          onClick={() => setSelectedModule(null)}
          className="flex items-center space-x-2"
        >
          <Filter className="w-4 h-4" />
          <span>Tous les modules</span>
        </Button>
        {modules.map((module) => (
          <Button
            key={module}
            variant={selectedModule === module ? "default" : "outline"}
            onClick={() => setSelectedModule(module)}
            className="flex items-center space-x-2"
          >
            <span>{module}</span>
            <Badge variant="secondary" className="ml-1">
              {courses?.filter(c => c.module === module).length}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Liste des cours */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCourses?.map((course) => (
          <Card 
            key={course.id} 
            className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
                    {course.description && (
                      <CardDescription className="mt-2 line-clamp-2">
                        {course.description}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <Badge className={getModuleColor(course.module)}>
                  {course.module}
                </Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-1" />
                  <span>Ressource officielle</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                onClick={() => window.open(course.url, '_blank', 'noopener,noreferrer')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Accéder au cours
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses?.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucun cours trouvé pour ce module</p>
        </div>
      )}

      {/* Statistiques */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">Ressources Disponibles</h3>
            <div className="flex justify-center space-x-8 text-sm text-gray-600">
              <div>
                <span className="font-bold text-2xl text-green-600">{courses?.length || 0}</span>
                <p>Cours au total</p>
              </div>
              <div>
                <span className="font-bold text-2xl text-green-600">{modules.length}</span>
                <p>Modules couverts</p>
              </div>
            </div>
            <p className="text-gray-600 mt-4">
              Toutes ces ressources proviennent d'organismes reconnus comme l'INRAE, la FAO, et des universités partenaires
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
