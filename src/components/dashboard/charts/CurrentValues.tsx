
import React from 'react';
import { paramConfig, ChartDataPoint, ParameterKey } from './ChartConfig';
import { useTranslations } from '@/hooks/useTranslations';

interface CurrentValuesProps {
  data: ChartDataPoint[];
  selectedParams: ParameterKey[];
}

export const CurrentValues: React.FC<CurrentValuesProps> = ({ data, selectedParams }) => {
  const { t } = useTranslations();
  
  if (data.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      {Object.entries(paramConfig).map(([param, config]) => {
        const paramKey = param as ParameterKey;
        if (!selectedParams.includes(paramKey)) return null;
        
        const currentValue = data[data.length - 1][paramKey] as number;
        const IconComponent = config.icon;
        
        return (
          <div key={param} className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <IconComponent className="w-4 h-4" style={{ color: config.color }} />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {t(config.name)}
              </span>
            </div>
            <div className="text-lg font-bold" style={{ color: config.color }}>
              {currentValue.toFixed(1)}{config.unit}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Actuel</div>
          </div>
        );
      })}
    </div>
  );
};
