
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

interface Analysis {
  id: string;
  health_score: number;
  created_at: string;
  recommendations?: string[];
}

interface RecentAnalysesProps {
  analyses: Analysis[] | undefined;
}

export const RecentAnalyses = ({ analyses }: RecentAnalysesProps) => {
  const { t } = useTranslations();

  if (!analyses || analyses.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Camera className="w-5 h-5 text-blue-600" />
          <span>{t('dashboard.recentAnalyses')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analyses.slice(0, 3).map((analysis, index) => (
            <div key={analysis.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{t('dashboard.analysis')} #{index + 1}</span>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  analysis.health_score >= 85 ? 'bg-green-100 text-green-800' :
                  analysis.health_score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {analysis.health_score}/100
                </span>
              </div>
              <div className="text-xs text-gray-600">
                {new Date(analysis.created_at).toLocaleDateString()}
              </div>
              {analysis.recommendations && analysis.recommendations.length > 0 && (
                <div className="mt-2 text-xs">
                  <span className="font-medium">{t('dashboard.recommendation')}</span>
                  <p className="text-gray-600">{analysis.recommendations[0]}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
