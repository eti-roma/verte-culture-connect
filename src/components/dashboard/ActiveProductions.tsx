
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Leaf } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

interface ActiveProductionsProps {
  stats: {
    scorePhotoMoyen?: number;
  } | undefined;
}

export const ActiveProductions = ({ stats }: ActiveProductionsProps) => {
  const { t } = useTranslations();

  const productions = [
    { 
      name: 'Laitue NFT - Lot A', 
      progress: 85, 
      days: 28, 
      status: t('dashboard.excellent'), 
      yield: `${stats?.scorePhotoMoyen ?? 85}%`,
      healthScore: stats?.scorePhotoMoyen ?? 85
    },
    { 
      name: 'Épinards DWC - Lot B', 
      progress: 60, 
      days: 18, 
      status: t('dashboard.good'), 
      yield: `${Math.max(70, (stats?.scorePhotoMoyen ?? 85) - 5)}%`,
      healthScore: Math.max(70, (stats?.scorePhotoMoyen ?? 85) - 5)
    },
    { 
      name: 'Basilic Aero - Lot C', 
      progress: 30, 
      days: 8, 
      status: t('dashboard.inProgress'), 
      yield: `${Math.max(75, (stats?.scorePhotoMoyen ?? 85) - 3)}%`,
      healthScore: Math.max(75, (stats?.scorePhotoMoyen ?? 85) - 3)
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Leaf className="w-5 h-5 text-green-600" />
          <span>{t('dashboard.activeProductions')}</span>
        </CardTitle>
        <CardDescription>
          {t('dashboard.realTimeData')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {productions.map((prod, index) => (
          <div key={index} className="space-y-3 p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">{prod.name}</span>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{t('dashboard.day')} {prod.days}</span>
                <span>{t('dashboard.health')} {prod.yield}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  prod.healthScore >= 85 ? 'bg-green-100 text-green-800' :
                  prod.healthScore >= 75 ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {prod.status}
                </span>
              </div>
            </div>
            <Progress value={prod.progress} className="h-2" />
            <div className="text-xs text-gray-500 flex justify-between">
              <span>{t('dashboard.progression')} {prod.progress}%</span>
              <span>{t('dashboard.aiScore')} {prod.healthScore}/100</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
