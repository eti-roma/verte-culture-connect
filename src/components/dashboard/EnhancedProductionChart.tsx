
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProductionHistory } from '@/hooks/useDashboardData';
import { useTranslations } from '@/hooks/useTranslations';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';

type ChartType = 'line' | 'area' | 'bar';

export const EnhancedProductionChart = () => {
  const { data: productionData, isLoading } = useProductionHistory();
  const { t } = useTranslations();
  const [chartType, setChartType] = useState<ChartType>('line');
  const [selectedCrops, setSelectedCrops] = useState(['orge', 'ble', 'mais']);

  const data = productionData || [
    { date: '2024-01-01', orge: 85, ble: 78, mais: 82, temperature: 22, humidity: 68 },
    { date: '2024-01-07', orge: 88, ble: 82, mais: 85, temperature: 24, humidity: 70 },
    { date: '2024-01-14', orge: 92, ble: 86, mais: 88, temperature: 23, humidity: 72 },
    { date: '2024-01-21', orge: 89, ble: 84, mais: 91, temperature: 25, humidity: 69 },
    { date: '2024-01-28', orge: 94, ble: 88, mais: 93, temperature: 22, humidity: 71 },
    { date: '2024-02-04', orge: 91, ble: 90, mais: 89, temperature: 24, humidity: 68 }
  ];

  const cropColors = {
    orge: '#22c55e',
    ble: '#3b82f6', 
    mais: '#f59e0b'
  };

  const cropNames = {
    orge: t('charts.barley'),
    ble: t('charts.wheat'),
    mais: t('charts.corn')
  };

  const toggleCrop = (crop: string) => {
    setSelectedCrops(prev => 
      prev.includes(crop) 
        ? prev.filter(c => c !== crop)
        : [...prev, crop]
    );
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    const lines = Object.entries(cropColors).map(([crop, color]) => 
      selectedCrops.includes(crop) ? (
        chartType === 'line' ? (
          <Line 
            key={crop}
            type="monotone" 
            dataKey={crop} 
            stroke={color} 
            strokeWidth={3}
            name={cropNames[crop as keyof typeof cropNames]}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
          />
        ) : chartType === 'area' ? (
          <Area
            key={crop}
            type="monotone"
            dataKey={crop}
            stackId="1"
            stroke={color}
            fill={color}
            fillOpacity={0.6}
            name={cropNames[crop as keyof typeof cropNames]}
          />
        ) : (
          <Bar
            key={crop}
            dataKey={crop}
            fill={color}
            name={cropNames[crop as keyof typeof cropNames]}
            radius={[2, 2, 0, 0]}
          />
        )
      ) : null
    );

    if (chartType === 'area') {
      return (
        <AreaChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value, name) => [`${value}%`, name]}
            labelFormatter={(label) => `${t('charts.date')}: ${new Date(label).toLocaleDateString()}`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          {lines}
        </AreaChart>
      );
    } else if (chartType === 'bar') {
      return (
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value, name) => [`${value}%`, name]}
            labelFormatter={(label) => `${t('charts.date')}: ${new Date(label).toLocaleDateString()}`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          {lines}
        </BarChart>
      );
    } else {
      return (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value, name) => [`${value}%`, name]}
            labelFormatter={(label) => `${t('charts.date')}: ${new Date(label).toLocaleDateString()}`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          {lines}
        </LineChart>
      );
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>{t('dashboard.productionEvolution')}</span>
            </CardTitle>
            <CardDescription>
              {isLoading ? 'Chargement des données...' : t('dashboard.healthScoreBasedOnAI')}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
            >
              <Activity className="w-4 h-4" />
            </Button>
            <Button
              variant={chartType === 'area' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('area')}
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('bar')}
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex space-x-4 mt-4">
          {Object.entries(cropNames).map(([crop, name]) => (
            <Button
              key={crop}
              variant={selectedCrops.includes(crop) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleCrop(crop)}
              className="text-xs"
              style={{
                backgroundColor: selectedCrops.includes(crop) ? cropColors[crop as keyof typeof cropColors] : undefined,
                borderColor: cropColors[crop as keyof typeof cropColors]
              }}
            >
              {name}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>
        
        {/* Statistiques résumées */}
        <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
          {Object.entries(cropNames).map(([crop, name]) => {
            if (!selectedCrops.includes(crop)) return null;
            
            const values = data.map(d => d[crop as keyof typeof d] as number);
            const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
            const trend = values[values.length - 1] - values[0];
            
            return (
              <div key={crop} className="text-center">
                <div className="text-sm font-medium text-gray-600">{name}</div>
                <div className="text-lg font-bold" style={{ color: cropColors[crop as keyof typeof cropColors] }}>
                  {avg}%
                </div>
                <div className={`text-xs ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trend >= 0 ? '+' : ''}{trend}% {t('charts.evolutionOver')}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
