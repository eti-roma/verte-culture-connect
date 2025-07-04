
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProductionHistory } from '@/hooks/useDashboardData';
import { useTranslations } from '@/hooks/useTranslations';
import { TrendingUp } from 'lucide-react';
import { ProductionChartTypeToggle } from './charts/ProductionChartTypeToggle';
import { CropSelector } from './charts/CropSelector';
import { ProductionStatistics } from './charts/ProductionStatistics';
import { ProductionChartRenderer } from './charts/ProductionChartRenderer';
import { generateProductionData, ProductionChartType } from './charts/ProductionChartConfig';

export const EnhancedProductionChart = () => {
  const { data: productionData, isLoading } = useProductionHistory();
  const { t } = useTranslations();
  const [chartType, setChartType] = useState<ProductionChartType>('line');
  const [selectedCrops, setSelectedCrops] = useState(['orge', 'ble', 'mais']);

  const data = productionData || generateProductionData();

  const toggleCrop = (crop: string) => {
    setSelectedCrops(prev => 
      prev.includes(crop) 
        ? prev.filter(c => c !== crop)
        : [...prev, crop]
    );
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
          <ProductionChartTypeToggle chartType={chartType} onToggle={setChartType} />
        </div>
        
        <CropSelector selectedCrops={selectedCrops} onToggleCrop={toggleCrop} />
      </CardHeader>
      <CardContent>
        <ProductionChartRenderer 
          data={data}
          selectedCrops={selectedCrops}
          chartType={chartType}
        />
        
        <ProductionStatistics 
          data={data}
          selectedCrops={selectedCrops}
        />
      </CardContent>
    </Card>
  );
};
