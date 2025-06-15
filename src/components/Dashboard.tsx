
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Leaf, Droplets, Thermometer, Calendar } from 'lucide-react';

export const Dashboard = () => {
  const stats = [
    { title: 'Productions Actives', value: '12', icon: Leaf, color: 'text-green-600' },
    { title: 'Rendement Moyen', value: '8.5 kg/m²', icon: Droplets, color: 'text-blue-600' },
    { title: 'Température Optimale', value: '22°C', icon: Thermometer, color: 'text-orange-600' },
    { title: 'Prochaine Récolte', value: '3 jours', icon: Calendar, color: 'text-purple-600' },
  ];

  const productions = [
    { name: 'Orge - Lot A', progress: 85, days: 12, status: 'Excellente' },
    { name: 'Blé - Lot B', progress: 60, days: 8, status: 'Bonne' },
    { name: 'Maïs - Lot C', progress: 30, days: 4, status: 'En cours' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Tableau de Bord</h2>
        <div className="text-sm text-gray-600">
          Dernière mise à jour : {new Date().toLocaleString('fr-FR')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
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
    </div>
  );
};
