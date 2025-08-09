import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ChevronLeft, ChevronRight, CheckCircle, Play, Clock } from 'lucide-react';
import { useTrainingSections } from '@/hooks/useTrainingModules';
import { useTrainingProgress, useUpdateProgress } from '@/hooks/useTrainingProgress';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface TrainingPlayerProps {
  moduleId: string;
  moduleTitle: string;
  onBack: () => void;
}

export const TrainingPlayer: React.FC<TrainingPlayerProps> = ({
  moduleId,
  moduleTitle,
  onBack
}) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const { data: sections, isLoading } = useTrainingSections(moduleId);
  const { data: progress } = useTrainingProgress(moduleId);
  const updateProgress = useUpdateProgress();
  const { toast } = useToast();

  const currentSection = sections?.[currentSectionIndex];
  const totalSections = sections?.length || 0;
  const completedSections = (progress && 'progressData' in progress && progress.progressData) 
    ? progress.progressData.filter(p => p.progress_percentage === 100)?.length || 0 
    : 0;
  const overallProgress = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;

  const handleSectionComplete = async () => {
    if (!currentSection) return;

    try {
      await updateProgress.mutateAsync({
        moduleId,
        sectionId: currentSection.id,
        progressPercentage: 100
      });

      toast({
        title: "Section terminée !",
        description: `Vous avez terminé "${currentSection.title}"`,
      });

      // Auto-advance to next section if available
      if (currentSectionIndex < totalSections - 1) {
        setCurrentSectionIndex(currentSectionIndex + 1);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder votre progression",
        variant: "destructive"
      });
    }
  };

  const handleModuleComplete = async () => {
    try {
      await updateProgress.mutateAsync({
        moduleId,
        progressPercentage: 100
      });

      toast({
        title: "Module terminé !",
        description: `Félicitations ! Vous avez terminé "${moduleTitle}"`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder votre progression",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!sections || sections.length === 0) {
    return (
      <div className="text-center py-8">
        <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune leçon disponible</h3>
        <p className="text-gray-600 mb-4">Ce module ne contient pas encore de contenu.</p>
        <Button onClick={onBack} variant="outline">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Retour aux modules
        </Button>
      </div>
    );
  }

  const isLastSection = currentSectionIndex === totalSections - 1;
  const isModuleCompleted = overallProgress === 100;

  return (
    <div className="space-y-6">
      {/* Header avec navigation */}
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="ghost" className="text-emerald-600 hover:text-emerald-700">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Retour aux modules
        </Button>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{moduleTitle}</h1>
          <p className="text-sm text-gray-600">
            Leçon {currentSectionIndex + 1} sur {totalSections}
          </p>
        </div>
        
        <div className="w-32"></div> {/* Spacer for centering */}
      </div>

      {/* Barre de progression du module */}
      <Card className="bg-gradient-to-r from-emerald-50 to-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progression du module</span>
            <span className="text-sm font-medium text-emerald-600">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
          <p className="text-xs text-gray-600 mt-2">
            {completedSections} sur {totalSections} leçons terminées
          </p>
        </CardContent>
      </Card>

      {/* Contenu de la section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <span>{currentSection?.title}</span>
              </CardTitle>
              <CardDescription className="mt-2">
                Section {currentSectionIndex + 1} • Lecture estimée: 5 min
              </CardDescription>
            </div>
            <Badge variant={overallProgress === 100 ? "default" : "secondary"}>
              {overallProgress === 100 ? "Terminé" : "En cours"}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Contenu de la leçon */}
          <div className="prose prose-emerald max-w-none">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Play className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-semibold text-emerald-900">Contenu de la leçon</h3>
              </div>
              <p className="text-gray-800 leading-relaxed">
                {currentSection?.content || "Contenu de la leçon à venir..."}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              onClick={() => setCurrentSectionIndex(Math.max(0, currentSectionIndex - 1))}
              disabled={currentSectionIndex === 0}
              variant="outline"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Précédent
            </Button>

            <div className="flex space-x-3">
              <Button
                onClick={handleSectionComplete}
                disabled={updateProgress.isPending}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {updateProgress.isPending ? "Sauvegarde..." : "Marquer comme terminé"}
              </Button>

              {isLastSection && completedSections === totalSections - 1 && (
                <Button
                  onClick={handleModuleComplete}
                  disabled={updateProgress.isPending || isModuleCompleted}
                  variant={isModuleCompleted ? "outline" : "default"}
                >
                  {isModuleCompleted ? "Module terminé ✓" : "Terminer le module"}
                </Button>
              )}
            </div>

            <Button
              onClick={() => setCurrentSectionIndex(Math.min(totalSections - 1, currentSectionIndex + 1))}
              disabled={currentSectionIndex === totalSections - 1}
              variant="outline"
            >
              Suivant
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des sections */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Plan du cours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sections.map((section, index) => {
              const isCompleted = (progress && 'progressData' in progress && progress.progressData)
                ? progress.progressData.some(p => p.section_id === section.id && p.progress_percentage === 100)
                : false;
              const isCurrent = index === currentSectionIndex;

              return (
                <div
                  key={section.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    isCurrent 
                      ? 'bg-emerald-100 border border-emerald-200' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setCurrentSectionIndex(index)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      isCompleted 
                        ? 'bg-emerald-500 text-white' 
                        : isCurrent 
                        ? 'bg-emerald-200 text-emerald-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{section.title}</h4>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>5 min</span>
                      </div>
                    </div>
                  </div>
                  {isCompleted && (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};