
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

export const AITracking = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        analyzeImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    setIsAnalyzing(true);
    // Simulation d'analyse IA
    setTimeout(() => {
      setAnalysisResult({
        health: 'Excellente',
        growth: 92,
        issues: [],
        recommendations: [
          'Maintenir le niveau d\'humidité actuel',
          'Augmenter légèrement l\'éclairage dans 2 jours',
          'Récolte recommandée dans 3-4 jours'
        ],
        nutrients: {
          nitrogen: 'Optimal',
          phosphorus: 'Bon',
          potassium: 'Optimal'
        },
        estimatedYield: '8.2 kg/m²'
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  const recentAnalyses = [
    { id: 1, date: '2024-01-15', culture: 'Orge - Lot A', health: 'Excellente', growth: 85 },
    { id: 2, date: '2024-01-14', culture: 'Blé - Lot B', health: 'Bonne', growth: 72 },
    { id: 3, date: '2024-01-13', culture: 'Maïs - Lot C', health: 'Attention', growth: 45 },
  ];

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'Excellente': return 'bg-green-100 text-green-800';
      case 'Bonne': return 'bg-blue-100 text-blue-800';
      case 'Attention': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Suivi IA par Photos</h2>
        <p className="text-lg text-gray-600">
          Analysez la santé de vos cultures grâce à l'intelligence artificielle
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="w-5 h-5 text-green-600" />
              <span>Nouvelle Analyse</span>
            </CardTitle>
            <CardDescription>
              Prenez ou importez une photo de votre culture pour analyse
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {selectedImage ? (
                <img 
                  src={selectedImage} 
                  alt="Culture sélectionnée" 
                  className="max-w-full h-48 object-cover mx-auto rounded-lg"
                />
              ) : (
                <div className="space-y-3">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-gray-600">Cliquez pour sélectionner une photo</p>
                    <p className="text-sm text-gray-400">PNG, JPG jusqu'à 10MB</p>
                  </div>
                </div>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <Button 
              className="w-full bg-green-500 hover:bg-green-600"
              disabled={!selectedImage || isAnalyzing}
            >
              {isAnalyzing ? 'Analyse en cours...' : 'Analyser la Photo'}
            </Button>
          </CardContent>
        </Card>

        {analysisResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Résultats d'Analyse</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Santé Générale</div>
                  <Badge className={getHealthColor(analysisResult.health)}>
                    {analysisResult.health}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Croissance</div>
                  <div className="text-2xl font-bold text-green-600">
                    {analysisResult.growth}%
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-2">Rendement Estimé</div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-lg font-semibold">
                    {analysisResult.estimatedYield}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-2">État Nutritionnel</div>
                <div className="space-y-1">
                  {Object.entries(analysisResult.nutrients).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="capitalize">{key}:</span>
                      <Badge variant="outline" className="text-xs">
                        {value as string}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-2">Recommandations</div>
                <ul className="space-y-1">
                  {analysisResult.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analyses Récentes</CardTitle>
          <CardDescription>
            Historique de vos analyses par IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAnalyses.map((analysis) => (
              <div key={analysis.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Camera className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{analysis.culture}</div>
                    <div className="text-sm text-gray-600">{analysis.date}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getHealthColor(analysis.health)}>
                    {analysis.health}
                  </Badge>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{analysis.growth}%</div>
                    <div className="text-xs text-gray-500">Croissance</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
