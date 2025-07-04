
import { Thermometer, Droplets, Activity } from 'lucide-react';

export const paramConfig = {
  temperature: {
    color: '#ef4444',
    name: 'charts.temperature',
    icon: Thermometer,
    unit: '°C',
    scale: 1
  },
  humidity: {
    color: '#06b6d4',
    name: 'charts.humidity',
    icon: Droplets,
    unit: '%',
    scale: 1
  },
  ph: {
    color: '#8b5cf6',
    name: 'charts.ph',
    icon: Activity,
    unit: '',
    scale: 10 // Multiplier pour mieux visualiser
  },
  conductivity: {
    color: '#f59e0b',
    name: 'Conductivité',
    icon: Activity,
    unit: 'mS/cm',
    scale: 10
  }
} as const;

export const generateChartData = () => [
  { time: '06:00', temperature: 20.5, humidity: 65, ph: 6.2, conductivity: 1.8 },
  { time: '07:00', temperature: 21.2, humidity: 66, ph: 6.3, conductivity: 1.9 },
  { time: '08:00', temperature: 22.1, humidity: 68, ph: 6.1, conductivity: 1.7 },
  { time: '09:00', temperature: 23.5, humidity: 69, ph: 6.4, conductivity: 2.0 },
  { time: '10:00', temperature: 24.8, humidity: 70, ph: 6.2, conductivity: 1.8 },
  { time: '11:00', temperature: 25.9, humidity: 72, ph: 6.3, conductivity: 1.9 },
  { time: '12:00', temperature: 26.5, humidity: 73, ph: 6.1, conductivity: 1.7 },
  { time: '13:00', temperature: 27.2, humidity: 74, ph: 6.4, conductivity: 2.1 },
  { time: '14:00', temperature: 27.8, humidity: 75, ph: 6.2, conductivity: 1.8 },
  { time: '15:00', temperature: 27.1, humidity: 72, ph: 6.3, conductivity: 1.9 },
  { time: '16:00', temperature: 26.3, humidity: 71, ph: 6.1, conductivity: 1.7 },
  { time: '17:00', temperature: 25.1, humidity: 69, ph: 6.4, conductivity: 2.0 },
  { time: '18:00', temperature: 24.2, humidity: 68, ph: 6.2, conductivity: 1.8 },
  { time: '19:00', temperature: 23.1, humidity: 67, ph: 6.3, conductivity: 1.9 },
  { time: '20:00', temperature: 22.3, humidity: 66, ph: 6.1, conductivity: 1.7 },
  { time: '21:00', temperature: 21.5, humidity: 65, ph: 6.4, conductivity: 2.0 },
];

export type ChartDataPoint = ReturnType<typeof generateChartData>[0];
export type ParameterKey = keyof typeof paramConfig;
export type ChartType = 'area' | 'line';
