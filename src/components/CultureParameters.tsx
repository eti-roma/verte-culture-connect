
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart3, Thermometer, Droplets, Sun, Beaker, Zap, AlertTriangle } from 'lucide-react';
import { useCultureParameters, useAddCultureParameter } from '@/hooks/useCultureParameters';

export const CultureParameters = () => {
  const { data: parameters, isLoading } = useCultureParameters();
  const addParameter = useAddCultureParameter();
  
  const [newParameter, setNewParameter] = useState({
    culture_name: '',
    temperature: '',
    humidity: '',
    light_intensity: '',
    ph_level: '',
    conductivity: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addParameter.mutate({
      ...newParameter,
      temperature: parseFloat(newParameter.temperature) || null,
      humidity: parseFloat(newParameter.humidity) || null,
      light_intensity: parseFloat(newParameter.light_intensity) || null,
      ph_level: parseFloat(newParameter.ph_level) || null,
      conductivity: parseFloat(newParameter.conductivity) || null,
    });
    setNewParameter({
      culture_name: '',
      temperature: '',
      humidity: '',
      light_intensity: '',
      ph_level: '',
      conductivity: ''
    });
  };

  const getParameterStatus = (value: number, min: number, max: number) => {
    if (value < min || value > max) return 'danger';
    if (value < min + (max - min) * 0.1 || value > max - (max - min) * 0.1) return 'warning';
    return 'good';
  };

  const optimalRanges = {
    temperature: { min: 18, max: 25, unit: '°C' },
    humidity: { min: 65, max: 75, unit: '%' },
    light_intensity: { min: 200, max: 400, unit: 'µmol/m²/s' },
    ph_level: { min: 5.5, max: 6.5, unit: '' },
    conductivity: { min: 1.2, max: 2.0, unit: 'mS/cm' }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Suivi des Paramètres de Culture</h2>
        <p className="text-lg text-gray-600">
          Surveillez et enregistrez les paramètres critiques de votre production
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <span>Enregistrer de Nouveaux Paramètres</span>
            </CardTitle>
            <CardDescription>
              Saisissez les mesures actuelles de votre culture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="culture_name">Nom de la Culture</Label>
                <Input
                  id="culture_name"
                  value={newParameter.culture_name}
                  onChange={(e) => setNewParameter({...newParameter, culture_name: e.target.value})}
                  placeholder="Ex: Orge - Lot A"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="temperature">Température (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    value={newParameter.temperature}
                    onChange={(e) => setNewParameter({...newParameter, temperature: e.target.value})}
                    placeholder="22.5"
                  />
                </div>
                <div>
                  <Label htmlFor="humidity">Humidité (%)</Label>
                  <Input
                    id="humidity"
                    type="number"
                    step="0.1"
                    value={newParameter.humidity}
                    onChange={(e) => setNewParameter({...newParameter, humidity: e.target.value})}
                    placeholder="70"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ph_level">pH</Label>
                  <Input
                    id="ph_level"
                    type="number"
                    step="0.1"
                    value={newParameter.ph_level}
                    onChange={(e) => setNewParameter({...newParameter, ph_level: e.target.value})}
                    placeholder="6.0"
                  />
                </div>
                <div>
                  <Label htmlFor="conductivity">Conductivité (mS/cm)</Label>
                  <Input
                    id="conductivity"
                    type="number"
                    step="0.1"
                    value={newParameter.conductivity}
                    onChange={(e) => setNewParameter({...newParameter, conductivity: e.target.value})}
                    placeholder="1.5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="light_intensity">Intensité Lumineuse (µmol/m²/s)</Label>
                <Input
                  id="light_intensity"
                  type="number"
                  step="1"
                  value={newParameter.light_intensity}
                  onChange={(e) => setNewParameter({...newParameter, light_intensity: e.target.value})}
                  placeholder="300"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-500 hover:bg-green-600"
                disabled={addParameter.isPending}
              >
                {addParameter.isPending ? 'Enregistrement...' : 'Enregistrer les Paramètres'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plages Optimales</CardTitle>
            <CardDescription>
              Valeurs recommandées pour une production optimale
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(optimalRanges).map(([key, range]) => {
              const icons = {
                temperature: Thermometer,
                humidity: Droplets,
                light_intensity: Sun,
                ph_level: Beaker,
                conductivity: Zap
              };
              const Icon = icons[key as keyof typeof icons];
              
              return (
                <div key={key} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-green-600" />
                    <span className="font-medium capitalize">
                      {key.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-green-700 font-semibold">
                    {range.min} - {range.max} {range.unit}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {parameters && parameters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historique des Mesures</CardTitle>
            <CardDescription>
              Dernières mesures enregistrées avec alertes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {parameters.slice(0, 10).map((param) => (
                <div key={param.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-lg">{param.culture_name}</h4>
                    <span className="text-sm text-gray-500">
                      {new Date(param.recorded_at).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(optimalRanges).map(([key, range]) => {
                      const value = param[key as keyof typeof param] as number;
                      if (value === null || value === undefined) return null;
                      
                      const status = getParameterStatus(value, range.min, range.max);
                      const statusColors = {
                        good: 'text-green-600 bg-green-50',
                        warning: 'text-yellow-600 bg-yellow-50',
                        danger: 'text-red-600 bg-red-50'
                      };
                      
                      return (
                        <div key={key} className={`p-2 rounded ${statusColors[status]}`}>
                          <div className="text-xs font-medium capitalize">
                            {key.replace('_', ' ')}
                          </div>
                          <div className="text-sm font-bold">
                            {value} {range.unit}
                          </div>
                          {status !== 'good' && (
                            <AlertTriangle className="w-3 h-3 mt-1" />
                          )}
                        </div>
                      );
                    })}
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
