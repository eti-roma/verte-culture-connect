
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChartType } from './ChartConfig';

interface ChartTypeToggleProps {
  chartType: ChartType;
  onToggle: (type: ChartType) => void;
}

export const ChartTypeToggle: React.FC<ChartTypeToggleProps> = ({ chartType, onToggle }) => {
  return (
    <div className="flex space-x-2">
      <Button
        variant={chartType === 'area' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onToggle('area')}
      >
        Area
      </Button>
      <Button
        variant={chartType === 'line' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onToggle('line')}
      >
        Line
      </Button>
    </div>
  );
};
