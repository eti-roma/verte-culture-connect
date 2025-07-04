
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from '@/hooks/useTranslations';
import { Activity } from 'lucide-react';
import { ChartTypeToggle } from './charts/ChartTypeToggle';
import { ParameterSelector } from './charts/ParameterSelector';
import { CurrentValues } from './charts/CurrentValues';
import { ParametersChartRenderer } from './charts/ParametersChartRenderer';
import { generateChartData, ParameterKey, ChartType } from './charts/ChartConfig';

export const EnhancedParametersChart = () => {
  const { t } = useTranslations();
  const [selectedParams, setSelectedParams] = useState<ParameterKey[]>(['temperature', 'humidity', 'ph']);
  const [chartType, setChartType] = useState<ChartType>('area');

  const data = generateChartData();

  const toggleParam = (param: ParameterKey) => {
    setSelectedParams(prev => 
      prev.includes(param) 
        ? prev.filter(p => p !== param)
        : [...prev, param]
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
          <ChartTypeToggle chartType={chartType} onToggle={setChartType} />
        </div>
        
        <ParameterSelector 
          selectedParams={selectedParams}
          onToggleParam={toggleParam}
        />
      </CardHeader>
      <CardContent>
        <ParametersChartRenderer 
          data={data}
          selectedParams={selectedParams}
          chartType={chartType}
        />
        
        <CurrentValues 
          data={data}
          selectedParams={selectedParams}
        />
      </CardContent>
    </Card>
  );
};
