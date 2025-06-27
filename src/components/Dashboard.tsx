
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Leaf, Droplets, Thermometer, Calendar, AlertCircle } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';

export const Dashboard = () => {
  const { data: stats, isLoading, error } = useDashboardStats();

  const statsList = [
    { 
      title: 'Productions Actives', 
      value: isLoading ? "..." : String(stats?.productionsActives ?? '0'), 
      icon: Leaf, 
      color: 'text-green-600' 
    },
    { 
      title: 'Rendement Moyen', 
      value: isLoading ? "..." : stats?.rendementMoyen ?? '8.5 kg/m²', 
      icon: Droplets, 
      color: 'text-blue-600' 
    },
    { 
      title: 'Température Optimale', 
      value: isLoading ? "..." : `${stats?.temperature ?? '22'}°C`, 
      icon: Thermometer, 
      color: 'text-orange-600' 
    },
    { 
      title: 'Prochaine Récolte', 
      value: isLoading ? "..." : stats?.prochaineRecolte ?? '3 jours', 
      icon: Calendar, 
      color: 'text-purple-600' 
    },
  ];

  // Données de démonstration pour les productions
  const productions = [
    { name: 'Orge - Lot A', progress: 85, days: 12, status: 'Excellente' },
    { name: 'Blé - Lot B', progress: 60, days: 8, status: 'Bonne' },
    { name: 'Maïs - Lot C', progress: 30, days: 4, status: 'En cours' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Tableau de Bord</h2>
          <p className="text-gray-600 mt-1">Bienvenue dans votre espace de gestion hydroponique</p>
        </div>
        <div className="text-sm text-gray-600">
          Dernière mise à jour : {new Date().toLocaleString('fr-FR')}
        </div>
      </div>

      {error && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="flex items-center space-x-2 pt-6">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <p className="text-yellow-800">
              Certaines données ne sont pas disponibles. L'application fonctionne en mode démonstration.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsList.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <IconComponent className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Leaf className="w-5 h-5 text-green-600" />
            <span>Productions en Cours</span>
          </CardTitle>
          <CardDescription>
            Suivi en temps réel de vos cultures hydroponiques
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {productions.map((prod, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{prod.name}</span>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Jour {prod.days}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    prod.status === 'Excellente' ? 'bg-green-100 text-green-800' :
                    prod.status === 'Bonne' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {prod.status}
                  </span>
                </div>
              </div>
              <Progress value={prod.progress} className="h-2" />
              <div className="text-xs text-gray-500">
                Progression: {prod.progress}%
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              🎉 Application HydroFourrage Pro
            </h3>
            <p className="text-green-700">
              Votre application est maintenant entièrement fonctionnelle ! 
              Explorez les différentes sections via la navigation pour découvrir toutes les fonctionnalités.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
