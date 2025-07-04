
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/useTranslations';
import { Thermometer, Droplets, Activity } from 'lucide-react';

export const EnhancedParametersChart = () => {
  const { t } = useTranslations();
  const [selectedParams, setSelectedParams] = useState(['temperature', 'humidity', 'ph']);
  const [chartType, setChartType] = useState<'area' | 'line'>('area');

  // Données simulées plus réalistes
  const data = [
    { time: '06:00', temperature: 20.5, humidity: 65, ph: 6.2, conductivity: 1.8 },
    { time: '07:00', temperature: 21.2, humidity: 66, ph: 6.3, conductivity: 1.9 },
    { time: '08:00', temperature: 22.1, humidity: 68, ph: 6.1, conductivity: 1.7 },
    { time: '09:00', temperature: 23.5, humidity: 69, ph: 6.4, conductivity: 2.0 },
    { time: '10:00', temperature: 24.8, humidity: 70, ph: 6.2, conductivity: 1.8 },
    { time: '11:00', temperature: 25.9, humidity: 72, ph: 6.3, conductivity: 1.9 },
    { time: '12:00', temperature: 26.5, humidity: 73, ph: 6.1, conductivity: 1.7 },
    { time: '13:00', temperature: 27.2, humidity: 74, ph: 6.4, conductivity: 2.1 },
    { time: '14:00', temperature: 27.8, humidity: 75, ph: 6.2, conductivity: 1.8 },
    { time: '15:00', temperature: 27.1, humidity: 72, ph: 6.3, conductivity: 1.9 },
    { time: '16:00', temperature: 26.3, humidity: 71, ph: 6.1, conductivity: 1.7 },
    { time: '17:00', temperature: 25.1, humidity: 69, ph: 6.4, conductivity: 2.0 },
    { time: '18:00', temperature: 24.2, humidity: 68, ph: 6.2, conductivity: 1.8 },
    { time: '19:00', temperature: 23.1, humidity: 67, ph: 6.3, conductivity: 1.9 },
    { time: '20:00', temperature: 22.3, humidity: 66, ph: 6.1, conductivity: 1.7 },
    { time: '21:00', temperature: 21.5, humidity: 65, ph: 6.4, conductivity: 2.0 },
  ];

  const paramConfig = {
    temperature: {
      color: '#ef4444',
      name: t('charts.temperature'),
      icon: Thermometer,
      unit: '°C',
      scale: 1
    },
    humidity: {
      color: '#06b6d4',
      name: t('charts.humidity'),
      icon: Droplets,
      unit: '%',
      scale: 1
    },
    ph: {
      color: '#8b5cf6',
      name: t('charts.ph'),
      icon: Activity,
      unit: '',
      scale: 10 // Multiplier pour mieux visualiser
    },
    conductivity: {
      color: '#f59e0b',
      name: 'Conductivité',
      icon: Activity,
      unit: 'mS/cm',
      scale: 10
    }
  };

  const toggleParam = (param: string) => {
    setSelectedParams(prev => 
      prev.includes(param) 
        ? prev.filter(p => p !== param)
        : [...prev, param]
    );
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    const elements = Object.entries(paramConfig).map(([param, config]) => 
      selectedParams.includes(param) ? (
        chartType === 'area' ? (
          <Area
            key={param}
            type="monotone"
            dataKey={param}
            stroke={config.color}
            fill={config.color}
            fillOpacity={0.3}
            name={config.name}
            strokeWidth={2}
          />
        ) : (
          <Line
            key={param}
            type="monotone"
            dataKey={param}
            stroke={config.color}
            strokeWidth={2.5}
            name={config.name}
            dot={{ fill: config.color, strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: config.color, strokeWidth: 2 }}
          />
        )
      ) : null
    );

    const ChartComponent = chartType === 'area' ? AreaChart : LineChart;

    return (
      <ChartComponent {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="time" 
          tick={{ fontSize: 12 }}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip 
          formatter={(value, name) => {
            const param = Object.keys(paramConfig).find(p => paramConfig[p as keyof typeof paramConfig].name === name);
            const config = param ? paramConfig[param as keyof typeof paramConfig] : null;
            return [
              `${typeof value === 'number' ? value.toFixed(1) : value}${config?.unit || ''}`, 
              name
            ];
          }}
          labelFormatter={(label) => `${t('charts.time')}: ${label}`}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        {elements}
      </ChartComponent>
    );
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span>{t('dashboard.environmentalParameters')}</span>
            </CardTitle>
            <CardDescription>{t('dashboard.progressionEvolution')}</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={chartType === 'area' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('area')}
            >
              Area
            </Button>
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
            >
              Line
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {Object.entries(paramConfig).map(([param, config]) => {
            const IconComponent = config.icon;
            return (
              <Button
                key={param}
                variant={selectedParams.includes(param) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleParam(param)}
                className="text-xs flex items-center space-x-1"
                style={{
                  backgroundColor: selectedParams.includes(param) ? config.color : undefined,
                  borderColor: config.color
                }}
              >
                <IconComponent className="w-3 h-3" />
                <span>{config.name}</span>
              </Button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>
        
        {/* Valeurs actuelles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
          {Object.entries(paramConfig).map(([param, config]) => {
            if (!selectedParams.includes(param)) return null;
            
            const currentValue = data[data.length - 1][param as keyof typeof data[0]] as number;
            const IconComponent = config.icon;
            
            return (
              <div key={param} className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <IconComponent className="w-4 h-4" style={{ color: config.color }} />
                  <span className="text-sm font-medium text-gray-600">{config.name}</span>
                </div>
                <div className="text-lg font-bold" style={{ color: config.color }}>
                  {currentValue.toFixed(1)}{config.unit}
                </div>
                <div className="text-xs text-gray-500">Actuel</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
