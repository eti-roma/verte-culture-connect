
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Info, Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

export const AlertsPanel = () => {
  const { data: notifications } = useNotifications();

  // Alertes par défaut si pas de notifications
  const defaultAlerts = [
    { type: 'warning', message: 'pH légèrement élevé dans la serre B (6.8)', icon: AlertTriangle },
    { type: 'success', message: 'Température optimale maintenue', icon: CheckCircle },
    { type: 'info', message: 'Récolte prévue dans 3 jours pour l\'orge', icon: Info },
  ];

  const displayAlerts = notifications && notifications.length > 0 
    ? notifications.slice(0, 3).map(notif => ({
        type: notif.type === 'error' ? 'warning' : notif.type as 'warning' | 'success' | 'info',
        message: notif.message,
        icon: notif.type === 'warning' || notif.type === 'error' ? AlertTriangle :
              notif.type === 'success' ? CheckCircle : Info
      }))
    : defaultAlerts;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="w-5 h-5" />
          <span>Alertes & Notifications</span>
        </CardTitle>
        <CardDescription>
          {notifications && notifications.length > 0 
            ? 'Notifications de votre système' 
            : 'Surveillance en temps réel'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayAlerts.map((alert, index) => {
          const IconComponent = alert.icon;
          return (
            <Alert key={index} className={`${
              alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
              alert.type === 'success' ? 'border-green-200 bg-green-50' :
              'border-blue-200 bg-blue-50'
            }`}>
              <IconComponent className={`h-4 w-4 ${
                alert.type === 'warning' ? 'text-yellow-600' :
                alert.type === 'success' ? 'text-green-600' :
                'text-blue-600'
              }`} />
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          );
        })}
      </CardContent>
    </Card>
  );
};
