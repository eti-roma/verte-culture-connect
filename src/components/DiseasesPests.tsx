
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bug, AlertTriangle, Shield, Search, Camera, MessageCircle } from 'lucide-react';
import { useDiseasesPests, useProblemReports, useAddProblemReport } from '@/hooks/useDiseasesPests';

export const DiseasesPests = () => {
  const { data: diseasesPests, isLoading } = useDiseasesPests();
  const { data: reports } = useProblemReports();
  const addReport = useAddProblemReport();
  
  const [selectedDisease, setSelectedDisease] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [reportForm, setReportForm] = useState({
    description: '',
    disease_pest_id: '',
  });
  const [showReportForm, setShowReportForm] = useState(false);

  const filteredDiseases = diseasesPests?.filter(disease =>
    disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disease.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    addReport.mutate(reportForm);
    setReportForm({ description: '', disease_pest_id: '' });
    setShowReportForm(false);
  };

  const getSeverityColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-yellow-100 text-yellow-800';
      case 4: return 'bg-orange-100 text-orange-800';
      case 5: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityLabel = (level: number) => {
    const labels = ['', 'Faible', 'Modérée', 'Élevée', 'Critique', 'Extrême'];
    return labels[level] || 'Inconnue';
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-8">Chargement...</div>;
  }

  if (selectedDisease) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedDisease(null)}
            className="text-green-600 hover:text-green-700"
          >
            ← Retour à la liste
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl flex items-center space-x-3">
                  <Bug className="w-6 h-6 text-red-600" />
                  <span>{selectedDisease.name}</span>
                </CardTitle>
                <CardDescription className="text-lg">
                  {selectedDisease.description}
                </CardDescription>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <Badge className={getSeverityColor(selectedDisease.severity_level)}>
                  Sévérité: {getSeverityLabel(selectedDisease.severity_level)}
                </Badge>
                <Badge variant="outline">
                  {selectedDisease.type === 'disease' ? 'Maladie' : 'Ravageur'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span>Symptômes</span>
                </h3>
                <ul className="space-y-2">
                  {selectedDisease.symptoms?.map((symptom: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Causes Principales</h3>
                <ul className="space-y-2">
                  {selectedDisease.causes?.map((cause: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Traitements Recommandés</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedDisease.treatments?.map((treatment: string, index: number) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-800">{treatment}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span>Conseils de Prévention</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedDisease.prevention_tips?.map((tip: string, index: number) => (
                  <div key={index} className="p-3 bg-green-50 rounded-lg">
                    <span className="text-green-800">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            <Alert>
              <MessageCircle className="h-4 w-4" />
              <AlertDescription>
                Vous observez ces symptômes ? 
                <Button 
                  variant="link" 
                  className="p-0 h-auto ml-1"
                  onClick={() => {
                    setReportForm({...reportForm, disease_pest_id: selectedDisease.id});
                    setShowReportForm(true);
                  }}
                >
                  Signaler ce problème pour obtenir de l'aide personnalisée
                </Button>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Maladies et Ravageurs</h2>
        <p className="text-lg text-gray-600">
          Guide complet pour identifier et traiter les problèmes sanitaires
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher par nom ou symptôme..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          onClick={() => setShowReportForm(true)}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          <Camera className="w-4 h-4 mr-2" />
          Signaler un Problème
        </Button>
      </div>

      {showReportForm && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700">Signaler un Problème</CardTitle>
            <CardDescription>
              Décrivez le problème observé pour obtenir une aide personnalisée
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Problème suspecté (optionnel)
                </label>
                <select 
                  value={reportForm.disease_pest_id}
                  onChange={(e) => setReportForm({...reportForm, disease_pest_id: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Sélectionner si connu</option>
                  {diseasesPests?.map((disease) => (
                    <option key={disease.id} value={disease.id}>
                      {disease.name} ({disease.type === 'disease' ? 'Maladie' : 'Ravageur'})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description détaillée *
                </label>
                <Textarea
                  value={reportForm.description}
                  onChange={(e) => setReportForm({...reportForm, description: e.target.value})}
                  placeholder="Décrivez les symptômes observés, la zone affectée, l'évolution du problème..."
                  required
                  rows={4}
                />
              </div>

              <div className="flex space-x-3">
                <input
                  type="file"
                  accept="image/*"
                  id="problem-photo"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Traitement de l'image
                      console.log('Photo sélectionnée:', file.name);
                    }
                  }}
                />
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('problem-photo')?.click()}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Ajouter une photo
                </Button>
                <Button 
                  type="submit" 
                  className="bg-red-500 hover:bg-red-600"
                  disabled={addReport.isPending}
                >
                  {addReport.isPending ? 'Envoi...' : 'Envoyer le Signalement'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowReportForm(false)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDiseases?.map((disease) => (
          <Card 
            key={disease.id}
            className="hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
            onClick={() => setSelectedDisease(disease)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Bug className="w-5 h-5 text-red-600" />
                    <span>{disease.name}</span>
                  </CardTitle>
                  <CardDescription>{disease.description}</CardDescription>
                </div>
              </div>
              <div className="flex space-x-2 mt-3">
                <Badge className={getSeverityColor(disease.severity_level)}>
                  {getSeverityLabel(disease.severity_level)}
                </Badge>
                <Badge variant="outline">
                  {disease.type === 'disease' ? 'Maladie' : 'Ravageur'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                Voir Détails et Traitements
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {reports && reports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mes Signalements</CardTitle>
            <CardDescription>
              Historique de vos signalements et réponses d'experts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.slice(0, 5).map((report) => (
                <div key={report.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">
                      {report.diseases_pests?.name || 'Problème non identifié'}
                    </h4>
                    <Badge 
                      className={
                        report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        report.status === 'responded' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {report.status === 'resolved' ? 'Résolu' :
                       report.status === 'responded' ? 'Répondu' : 'En attente'}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{report.description}</p>
                  {report.expert_response && (
                    <div className="bg-blue-50 p-3 rounded mt-3">
                      <p className="text-sm text-blue-800">
                        <strong>Réponse d'expert:</strong> {report.expert_response}
                      </p>
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    Signalé le {new Date(report.created_at).toLocaleString('fr-FR')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
