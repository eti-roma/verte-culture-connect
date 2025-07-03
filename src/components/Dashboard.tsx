
import React from 'react';
import { EnhancedDashboard } from './EnhancedDashboard';
import { useRealTimeNotifications, useSimulateNotifications } from '@/hooks/useRealTimeNotifications';

export const Dashboard = () => {
  // Activer les notifications en temps réel
  useRealTimeNotifications();
  useSimulateNotifications();

  return <EnhancedDashboard />;
};
