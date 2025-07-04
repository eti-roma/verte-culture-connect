
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Thermometer, Camera, BookOpen } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

interface StatsCardsProps {
  stats: {
    productionsActives?: number;
    scorePhotoMoyen?: number;
    temperature?: number;
    modulesCompletes?: number;
  } | undefined;
  isLoading: boolean;
}

export const StatsCards = ({ stats, isLoading }: StatsCardsProps) => {
  const { t } = useTranslations();

  const statsList = [
    { 
      title: t('dashboard.activeProductions'), 
      value: isLoading ? "..." : String(stats?.productionsActives ?? '3'), 
      icon: Leaf, 
      color: 'text-green-600',
      change: '+12%',
      changeType: 'positive' as const
    },
    { 
      title: t('dashboard.averageHealthScore'), 
      value: isLoading ? "..." : `${stats?.scorePhotoMoyen ?? '85'}%`, 
      icon: Camera, 
      color: 'text-blue-600',
      change: '+8%',
      changeType: 'positive' as const
    },
    { 
      title: t('dashboard.currentTemperature'), 
      value: isLoading ? "..." : `${stats?.temperature ?? '22'}°C`, 
      icon: Thermometer, 
      color: 'text-orange-600',
      change: t('dashboard.optimal'),
      changeType: 'neutral' as const
    },
    { 
      title: t('dashboard.completedModules'), 
      value: isLoading ? "..." : String(stats?.modulesCompletes ?? '0'), 
      icon: BookOpen, 
      color: 'text-purple-600',
      change: `+${stats?.modulesCompletes ?? 0}`,
      changeType: 'positive' as const
    },
  ];

  return (
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
              <div className="flex items-center mt-2">
                <span className={`text-xs font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' :
                  stat.changeType === 'neutral' ? 'text-gray-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-xs text-gray-500 ml-1">{t('dashboard.vs')} {t('dashboard.previousPeriod')}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
