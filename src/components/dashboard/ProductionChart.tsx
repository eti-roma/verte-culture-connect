
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { name: 'Jour 1', orge: 4, ble: 2, mais: 3 },
  { name: 'Jour 3', orge: 6, ble: 3, mais: 4 },
  { name: 'Jour 5', orge: 8, ble: 4, mais: 5 },
  { name: 'Jour 7', orge: 12, ble: 6, mais: 7 },
  { name: 'Jour 10', orge: 16, ble: 8, mais: 9 },
  { name: 'Jour 14', orge: 20, ble: 12, mais: 14 },
];

export const ProductionChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution de la Production</CardTitle>
        <CardDescription>Croissance des cultures en cm sur 14 jours</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="orge" stroke="#22c55e" strokeWidth={2} />
            <Line type="monotone" dataKey="ble" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="mais" stroke="#f59e0b" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
