
export type ProductionChartType = 'line' | 'area' | 'bar';

export const cropColors = {
  orge: '#22c55e',
  ble: '#3b82f6', 
  mais: '#f59e0b'
} as const;

export const generateProductionData = () => [
  { date: '2024-01-01', orge: 85, ble: 78, mais: 82, temperature: 22, humidity: 68 },
  { date: '2024-01-07', orge: 88, ble: 82, mais: 85, temperature: 24, humidity: 70 },
  { date: '2024-01-14', orge: 92, ble: 86, mais: 88, temperature: 23, humidity: 72 },
  { date: '2024-01-21', orge: 89, ble: 84, mais: 91, temperature: 25, humidity: 69 },
  { date: '2024-01-28', orge: 94, ble: 88, mais: 93, temperature: 22, humidity: 71 },
  { date: '2024-02-04', orge: 91, ble: 90, mais: 89, temperature: 24, humidity: 68 }
];

export type ProductionDataPoint = ReturnType<typeof generateProductionData>[0];
export type CropKey = keyof typeof cropColors;
