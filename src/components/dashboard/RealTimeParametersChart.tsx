
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

export const RealTimeParametersChart = () => {
  const [data, setData] = useState([
    { time: '06:00', temperature: 20, humidity: 65, ph: 6.2 },
    { time: '09:00', temperature: 22, humidity: 68, ph: 6.3 },
    { time: '12:00', temperature: 25, humidity: 70, ph: 6.1 },
    { time: '15:00', temperature: 27, humidity: 72, ph: 6.4 },
    { time: '18:00', temperature: 24, humidity: 69, ph: 6.2 },
    { time: '21:00', temperature: 21, humidity: 66, ph: 6.3 },
  ]);

  useEffect(() => {
    const fetchRealParameters = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: parameters } = await supabase
        .from('culture_parameters')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(24);

      if (parameters && parameters.length > 0) {
        const formattedData = parameters.reverse().map(param => ({
          time: new Date(param.recorded_at).toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          temperature: param.temperature || 22,
          humidity: param.humidity || 68,
          ph: param.ph_level || 6.2
        }));
        setData(formattedData);
      }
    };

    fetchRealParameters();

    // Simuler des mises à jour en temps réel
    const interval = setInterval(() => {
      setData(prev => {
        const newEntry = {
          time: new Date().toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          temperature: 20 + Math.random() * 8,
          humidity: 60 + Math.random() * 15,
          ph: 5.8 + Math.random() * 0.8
        };
        
        const updated = [...prev.slice(1), newEntry];
        return updated;
      });
    }, 60000); // Mise à jour toutes les minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres Environnementaux (Temps Réel)</CardTitle>
        <CardDescription>Évolution des conditions sur les dernières heures</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                typeof value === 'number' ? value.toFixed(1) : value,
                name === 'temperature' ? 'Température (°C)' :
                name === 'humidity' ? 'Humidité (%)' : 'pH'
              ]}
            />
            <Area type="monotone" dataKey="temperature" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
            <Area type="monotone" dataKey="humidity" stackId="2" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
            <Area type="monotone" dataKey="ph" stackId="3" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
