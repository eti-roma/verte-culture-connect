
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { cropColors, CropKey, ProductionDataPoint, ProductionChartType } from './ProductionChartConfig';
import { useTranslations } from '@/hooks/useTranslations';

interface ProductionChartRendererProps {
  data: ProductionDataPoint[];
  selectedCrops: string[];
  chartType: ProductionChartType;
}

export const ProductionChartRenderer: React.FC<ProductionChartRendererProps> = ({
  data,
  selectedCrops,
  chartType
}) => {
  const { t } = useTranslations();

  const cropNames = {
    orge: t('charts.barley'),
    ble: t('charts.wheat'),
    mais: t('charts.corn')
  };

  const commonProps = {
    data,
    margin: { top: 5, right: 30, left: 20, bottom: 5 }
  };

  const lines = Object.entries(cropColors).map(([crop, color]) => 
    selectedCrops.includes(crop) ? (
      chartType === 'line' ? (
        <Line 
          key={crop}
          type="monotone" 
          dataKey={crop} 
          stroke={color} 
          strokeWidth={3}
          name={cropNames[crop as keyof typeof cropNames]}
          dot={{ fill: color, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
        />
      ) : chartType === 'area' ? (
        <Area
          key={crop}
          type="monotone"
          dataKey={crop}
          stackId="1"
          stroke={color}
          fill={color}
          fillOpacity={0.6}
          name={cropNames[crop as keyof typeof cropNames]}
        />
      ) : (
        <Bar
          key={crop}
          dataKey={crop}
          fill={color}
          name={cropNames[crop as keyof typeof cropNames]}
          radius={[2, 2, 0, 0]}
        />
      )
    ) : null
  );

  const tooltipStyle = {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  };

  if (chartType === 'area') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value, name) => [`${value}%`, name]}
            labelFormatter={(label) => `${t('charts.date')}: ${new Date(label).toLocaleDateString()}`}
            contentStyle={tooltipStyle}
          />
          <Legend />
          {lines}
        </AreaChart>
      </ResponsiveContainer>
    );
  } else if (chartType === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value, name) => [`${value}%`, name]}
            labelFormatter={(label) => `${t('charts.date')}: ${new Date(label).toLocaleDateString()}`}
            contentStyle={tooltipStyle}
          />
          <Legend />
          {lines}
        </BarChart>
      </ResponsiveContainer>
    );
  } else {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value, name) => [`${value}%`, name]}
            labelFormatter={(label) => `${t('charts.date')}: ${new Date(label).toLocaleDateString()}`}
            contentStyle={tooltipStyle}
          />
          <Legend />
          {lines}
        </LineChart>
      </ResponsiveContainer>
    );
  }
};
