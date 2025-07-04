
import React from 'react';
import { Button } from '@/components/ui/button';
import { Activity, BarChart3 } from 'lucide-react';
import { ProductionChartType } from './ProductionChartConfig';

interface ProductionChartTypeToggleProps {
  chartType: ProductionChartType;
  onToggle: (type: ProductionChartType) => void;
}

export const ProductionChartTypeToggle: React.FC<ProductionChartTypeToggleProps> = ({ 
  chartType, 
  onToggle 
}) => {
  return (
    <div className="flex space-x-2">
      <Button
        variant={chartType === 'line' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onToggle('line')}
      >
        <Activity className="w-4 h-4" />
      </Button>
      <Button
        variant={chartType === 'area' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onToggle('area')}
      >
        <BarChart3 className="w-4 h-4" />
      </Button>
      <Button
        variant={chartType === 'bar' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onToggle('bar')}
      >
        <BarChart3 className="w-4 h-4" />
      </Button>
    </div>
  );
};
