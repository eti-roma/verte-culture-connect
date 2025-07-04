
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { paramConfig, ChartDataPoint, ParameterKey, ChartType } from './ChartConfig';
import { useTranslations } from '@/hooks/useTranslations';

interface ParametersChartRendererProps {
  data: ChartDataPoint[];
  selectedParams: ParameterKey[];
  chartType: ChartType;
}

export const ParametersChartRenderer: React.FC<ParametersChartRendererProps> = ({
  data,
  selectedParams,
  chartType
}) => {
  const { t } = useTranslations();

  const commonProps = {
    data,
    margin: { top: 5, right: 30, left: 20, bottom: 5 }
  };

  const elements = Object.entries(paramConfig).map(([param, config]) => {
    const paramKey = param as ParameterKey;
    return selectedParams.includes(paramKey) ? (
      chartType === 'area' ? (
        <Area
          key={param}
          type="monotone"
          dataKey={param}
          stroke={config.color}
          fill={config.color}
          fillOpacity={0.3}
          name={t(config.name)}
          strokeWidth={2}
        />
      ) : (
        <Line
          key={param}
          type="monotone"
          dataKey={param}
          stroke={config.color}
          strokeWidth={2.5}
          name={t(config.name)}
          dot={{ fill: config.color, strokeWidth: 2, r: 3 }}
          activeDot={{ r: 5, stroke: config.color, strokeWidth: 2 }}
        />
      )
    ) : null;
  });

  const ChartComponent = chartType === 'area' ? AreaChart : LineChart;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ChartComponent {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
        <XAxis 
          dataKey="time" 
          tick={{ fontSize: 12 }}
          stroke="currentColor"
          opacity={0.7}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          stroke="currentColor"
          opacity={0.7}
        />
        <Tooltip 
          formatter={(value, name) => {
            const param = Object.keys(paramConfig).find(p => 
              t(paramConfig[p as ParameterKey].name) === name
            ) as ParameterKey | undefined;
            const config = param ? paramConfig[param] : null;
            return [
              `${typeof value === 'number' ? value.toFixed(1) : value}${config?.unit || ''}`, 
              name
            ];
          }}
          labelFormatter={(label) => `${t('charts.time')}: ${label}`}
          contentStyle={{
            backgroundColor: 'var(--background)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            color: 'var(--foreground)'
          }}
        />
        {elements}
      </ChartComponent>
    </ResponsiveContainer>
  );
};
