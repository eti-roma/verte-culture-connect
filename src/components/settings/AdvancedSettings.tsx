
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Bell, Download, Shield, Palette, Globe } from 'lucide-react';

export const AdvancedSettings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      alerts: true
    },
    display: {
      theme: 'light',
      language: 'fr',
      units: 'metric'
    },
    system: {
      autoBackup: true,
      dataExport: true,
      advancedMode: false
    }
  });

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Settings className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Paramètres Avancés</h2>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </CardTitle>
          <CardDescription>
            Configurez vos préférences de notification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notif">Notifications par email</Label>
              <Switch
                id="email-notif"
                checked={settings.notifications.email}
                onCheckedChange={(value) => handleSettingChange('notifications', 'email', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notif">Notifications push</Label>
              <Switch
                id="push-notif"
                checked={settings.notifications.push}
                onCheckedChange={(value) => handleSettingChange('notifications', 'push', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-notif">Notifications SMS</Label>
              <Switch
                id="sms-notif"
                checked={settings.notifications.sms}
                onCheckedChange={(value) => handleSettingChange('notifications', 'sms', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="alerts-notif">Alertes système</Label>
              <Switch
                id="alerts-notif"
                checked={settings.notifications.alerts}
                onCheckedChange={(value) => handleSettingChange('notifications', 'alerts', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Affichage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>Affichage</span>
          </CardTitle>
          <CardDescription>
            Personnalisez l'apparence de l'application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Thème</Label>
              <Select value={settings.display.theme} onValueChange={(value) => handleSettingChange('display', 'theme', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Clair</SelectItem>
                  <SelectItem value="dark">Sombre</SelectItem>
                  <SelectItem value="auto">Automatique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Langue</Label>
              <Select value={settings.display.language} onValueChange={(value) => handleSettingChange('display', 'language', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Système */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Système</span>
          </CardTitle>
          <CardDescription>
            Options avancées du système
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-backup">Sauvegarde automatique</Label>
              <Switch
                id="auto-backup"
                checked={settings.system.autoBackup}
                onCheckedChange={(value) => handleSettingChange('system', 'autoBackup', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="data-export">Export de données</Label>
              <Switch
                id="data-export"
                checked={settings.system.dataExport}
                onCheckedChange={(value) => handleSettingChange('system', 'dataExport', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="advanced-mode">Mode avancé</Label>
              <Switch
                id="advanced-mode"
                checked={settings.system.advancedMode}
                onCheckedChange={(value) => handleSettingChange('system', 'advancedMode', value)}
              />
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Exporter les données
            </Button>
            <Button variant="outline">
              Sauvegarder les paramètres
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
