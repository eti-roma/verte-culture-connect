
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { time: '06:00', temperature: 20, humidity: 65, ph: 6.2 },
  { time: '09:00', temperature: 22, humidity: 68, ph: 6.3 },
  { time: '12:00', temperature: 25, humidity: 70, ph: 6.1 },
  { time: '15:00', temperature: 27, humidity: 72, ph: 6.4 },
  { time: '18:00', temperature: 24, humidity: 69, ph: 6.2 },
  { time: '21:00', temperature: 21, humidity: 66, ph: 6.3 },
];

export const ParametersChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres Environnementaux</CardTitle>
        <CardDescription>Évolution des conditions sur 24h</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="temperature" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
            <Area type="monotone" dataKey="humidity" stackId="2" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
