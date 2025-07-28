
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Camera, Upload, History, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const PhotoAnalysis = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    setProgress(0);

    // Simulation de l'analyse IA
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setAnalyzing(false);
          toast({
            title: "Analyse terminée",
            description: "Vos plantes sont en bonne santé ! Score: 85/100",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const analysisHistory = [
    { date: '2024-01-15', score: 85, issues: ['Légère carence en azote'], image: '/placeholder.svg' },
    { date: '2024-01-10', score: 92, issues: [], image: '/placeholder.svg' },
    { date: '2024-01-05', score: 78, issues: ['Humidité excessive'], image: '/placeholder.svg' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>Analyse IA par Photos</span>
          </CardTitle>
          <CardDescription>
            Uploadez une photo de vos cultures pour un diagnostic automatique
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium">Cliquez pour uploader une photo</p>
              <p className="text-sm text-gray-500">JPG, PNG jusqu'à 10MB</p>
            </label>
          </div>

          {analyzing && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Analyse en cours...</p>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          <div className="flex space-x-2">
            <Button variant="outline" className="flex-1">
              <Camera className="w-4 h-4 mr-2" />
              Prendre une photo
            </Button>
            <Button variant="outline">
              <History className="w-4 h-4 mr-2" />
              Historique
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique des Analyses</CardTitle>
          <CardDescription>Suivez l'évolution de vos cultures</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysisHistory.map((analysis, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                <img src={analysis.image} alt="Culture" className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{analysis.date}</p>
                      <p className="text-sm text-gray-600">Score santé: {analysis.score}/100</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                  {analysis.issues.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-yellow-600">Problèmes détectés:</p>
                      <ul className="text-sm text-gray-600">
                        {analysis.issues.map((issue, i) => (
                          <li key={i}>• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
