
import React from 'react';
import { Button } from '@/components/ui/button';
import { cropColors, CropKey } from './ProductionChartConfig';
import { useTranslations } from '@/hooks/useTranslations';

interface CropSelectorProps {
  selectedCrops: string[];
  onToggleCrop: (crop: string) => void;
}

export const CropSelector: React.FC<CropSelectorProps> = ({ 
  selectedCrops, 
  onToggleCrop 
}) => {
  const { t } = useTranslations();

  const cropNames = {
    orge: t('charts.barley'),
    ble: t('charts.wheat'),
    mais: t('charts.corn')
  };

  return (
    <div className="flex space-x-4 mt-4">
      {Object.entries(cropNames).map(([crop, name]) => (
        <Button
          key={crop}
          variant={selectedCrops.includes(crop) ? 'default' : 'outline'}
          size="sm"
          onClick={() => onToggleCrop(crop)}
          className="text-xs"
          style={{
            backgroundColor: selectedCrops.includes(crop) ? cropColors[crop as CropKey] : undefined,
            borderColor: cropColors[crop as CropKey]
          }}
        >
          {name}
        </Button>
      ))}
    </div>
  );
};
