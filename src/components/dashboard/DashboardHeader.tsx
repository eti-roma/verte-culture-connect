
import React from 'react';
import { Activity } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

export const DashboardHeader = () => {
  const { t } = useTranslations();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h2>
        <p className="text-gray-600 mt-1">{t('dashboard.subtitle')}</p>
      </div>
      <div className="text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-green-500" />
          <span>{t('dashboard.systemConnected')} {t('dashboard.lastSync')} {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};
