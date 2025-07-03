
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const AlertsPanel = () => {
  const alerts = [
    { type: 'warning', message: 'pH légèrement élevé dans la serre B (6.8)', icon: AlertTriangle },
    { type: 'success', message: 'Température optimale maintenue', icon: CheckCircle },
    { type: 'info', message: 'Récolte prévue dans 3 jours pour l\'orge', icon: Info },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertes & Notifications</CardTitle>
        <CardDescription>Surveillance en temps réel</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert, index) => {
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
