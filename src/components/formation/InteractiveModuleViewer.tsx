import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, PlayCircle, FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTrainingSections } from '@/hooks/useTrainingModules';
import { useTrainingProgress, useUpdateProgress } from '@/hooks/useTrainingProgress';

interface InteractiveModuleViewerProps {
  moduleId: string;
  moduleTitle: string;
  onBack: () => void;
}

export const InteractiveModuleViewer = ({ moduleId, moduleTitle, onBack }: InteractiveModuleViewerProps) => {
  const { data: sections, isLoading } = useTrainingSections(moduleId);
  const { data: progress } = useTrainingProgress(moduleId);
  const updateProgress = useUpdateProgress();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du module...</p>
        </div>
      </div>
    );
  }

  if (!sections || sections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Aucune section disponible</h3>
            <p className="text-muted-foreground mb-4">
              Ce module ne contient pas encore de sections de formation.
            </p>
            <Button onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux modules
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentSection = sections[currentSectionIndex];
  const isLastSection = currentSectionIndex === sections.length - 1;
  const isFirstSection = currentSectionIndex === 0;

  const handleMarkAsCompleted = async () => {
    if (!currentSection) return;

    try {
      await updateProgress.mutateAsync({
        moduleId,
        sectionId: currentSection.id,
        progressPercentage: 100
      });

      // Move to next section if not the last one
      if (!isLastSection) {
        setCurrentSectionIndex(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
        return <PlayCircle className="w-5 h-5" />;
      case 'pdf':
      case 'document':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux modules
            </Button>
            <Badge variant="secondary">
              Section {currentSectionIndex + 1} sur {sections.length}
            </Badge>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{moduleTitle}</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Progression du module: {progress?.progress_percentage || 0}%
            </span>
            <Progress value={progress?.progress_percentage || 0} className="flex-1 max-w-xs" />
          </div>
        </div>

        {/* Current Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-primary">{currentSectionIndex + 1}.</span>
              {currentSection.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentSection.content && (
              <div className="prose max-w-none mb-6">
                <p className="text-muted-foreground">{currentSection.content}</p>
              </div>
            )}

            {/* Resources */}
            {currentSection.training_resources && currentSection.training_resources.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold">Ressources de cette section:</h4>
                <div className="grid gap-3">
                  {currentSection.training_resources.map((resource: any) => (
                    <Card key={resource.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getResourceIcon(resource.type)}
                          <div>
                            <p className="font-medium">{resource.title}</p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {resource.type}
                            </p>
                          </div>
                        </div>
                        {resource.url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(resource.url, '_blank')}
                          >
                            Accéder
                          </Button>
                        )}
                      </div>
                      {resource.content && (
                        <p className="mt-3 text-sm text-muted-foreground">
                          {resource.content}
                        </p>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentSectionIndex(prev => Math.max(0, prev - 1))}
            disabled={isFirstSection}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Section précédente
          </Button>

          <Button
            onClick={handleMarkAsCompleted}
            disabled={updateProgress.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {updateProgress.isPending ? 'Sauvegarde...' : 'Marquer comme terminé'}
          </Button>

          <Button
            variant="outline"
            onClick={() => setCurrentSectionIndex(prev => Math.min(sections.length - 1, prev + 1))}
            disabled={isLastSection}
          >
            Section suivante
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Completion Message */}
        {isLastSection && progress?.progress_percentage === 100 && (
          <Card className="mt-6 bg-green-50 border-green-200">
            <CardContent className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Félicitations !
              </h3>
              <p className="text-green-700">
                Vous avez terminé ce module de formation avec succès.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};