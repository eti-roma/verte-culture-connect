
import React from 'react';
import { cropColors, CropKey, ProductionDataPoint } from './ProductionChartConfig';
import { useTranslations } from '@/hooks/useTranslations';

interface ProductionStatisticsProps {
  data: ProductionDataPoint[];
  selectedCrops: string[];
}

export const ProductionStatistics: React.FC<ProductionStatisticsProps> = ({ 
  data, 
  selectedCrops 
}) => {
  const { t } = useTranslations();

  const cropNames = {
    orge: t('charts.barley'),
    ble: t('charts.wheat'),
    mais: t('charts.corn')
  };

  return (
    <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
      {Object.entries(cropNames).map(([crop, name]) => {
        if (!selectedCrops.includes(crop)) return null;
        
        const values = data.map(d => d[crop as keyof typeof d] as number);
        const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
        const trend = values[values.length - 1] - values[0];
        
        return (
          <div key={crop} className="text-center">
            <div className="text-sm font-medium text-gray-600">{name}</div>
            <div className="text-lg font-bold" style={{ color: cropColors[crop as CropKey] }}>
              {avg}%
            </div>
            <div className={`text-xs ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '+' : ''}{trend}% {t('charts.evolutionOver')}
            </div>
          </div>
        );
      })}
    </div>
  );
};
