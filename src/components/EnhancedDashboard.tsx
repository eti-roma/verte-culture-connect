
import React from 'react';
import { useRealDashboardStats } from '@/hooks/useDashboardData';
import { usePhotoAnalyses } from '@/hooks/usePhotoAnalysis';
import { EnhancedProductionChart } from './dashboard/EnhancedProductionChart';
import { EnhancedParametersChart } from './dashboard/EnhancedParametersChart';
import { AlertsPanel } from './dashboard/AlertsPanel';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { StatsCards } from './dashboard/StatsCards';
import { ActiveProductions } from './dashboard/ActiveProductions';
import { RecentAnalyses } from './dashboard/RecentAnalyses';
import { WelcomeBanner } from './dashboard/WelcomeBanner';

export const EnhancedDashboard = () => {
  const { data: stats, isLoading } = useRealDashboardStats();
  const { data: analyses } = usePhotoAnalyses();

  return (
    <div className="space-y-6">
      <DashboardHeader />
      
      <StatsCards stats={stats} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EnhancedProductionChart />
        <EnhancedParametersChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActiveProductions stats={stats} />
        </div>
        <AlertsPanel />
      </div>

      <RecentAnalyses analyses={analyses} />

      <WelcomeBanner />
    </div>
  );
};
