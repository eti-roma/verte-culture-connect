
import React from 'react';
import { Button } from '@/components/ui/button';
import { paramConfig, ParameterKey } from './ChartConfig';

interface ParameterSelectorProps {
  selectedParams: ParameterKey[];
  onToggleParam: (param: ParameterKey) => void;
}

export const ParameterSelector: React.FC<ParameterSelectorProps> = ({ 
  selectedParams, 
  onToggleParam 
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {Object.entries(paramConfig).map(([param, config]) => {
        const IconComponent = config.icon;
        const paramKey = param as ParameterKey;
        
        return (
          <Button
            key={param}
            variant={selectedParams.includes(paramKey) ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToggleParam(paramKey)}
            className="text-xs flex items-center space-x-1"
            style={{
              backgroundColor: selectedParams.includes(paramKey) ? config.color : undefined,
              borderColor: config.color
            }}
          >
            <IconComponent className="w-3 h-3" />
            <span>{config.name}</span>
          </Button>
        );
      })}
    </div>
  );
};
