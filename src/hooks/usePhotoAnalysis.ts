
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PhotoAnalysis {
  id: string;
  image_url: string;
  analysis_result: any;
  health_score: number;
  issues_detected: string[];
  recommendations: string[];
  created_at: string;
}

export const usePhotoAnalyses = () => {
  return useQuery({
    queryKey: ['photo-analyses'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('photo_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PhotoAnalysis[];
    },
  });
};

export const useCreatePhotoAnalysis = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (file: File) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload image to Supabase Storage (simulé pour cette démo)
      const fileName = `analysis_${Date.now()}_${file.name}`;
      const imageUrl = `https://placeholder.com/400x300?text=Analyse+${Date.now()}`;

      // Simulation de l'analyse IA
      const mockAnalysis = {
        confidence: Math.random() * 0.3 + 0.7, // 70-100%
        detected_objects: ['leaves', 'stems'],
        color_analysis: {
          dominant_colors: ['green', 'yellow'],
          health_indicators: ['chlorophyll_content']
        }
      };

      const healthScore = Math.floor(Math.random() * 30 + 70); // 70-100
      
      const issues = healthScore < 80 ? [
        'Possible carence nutritionnelle détectée',
        'Couleur des feuilles légèrement jaunâtre'
      ] : [];

      const recommendations = healthScore < 80 ? [
        'Vérifier le pH de la solution nutritive',
        'Contrôler les niveaux de nutriments',
        'Augmenter légèrement la concentration en azote'
      ] : [
        'Plante en excellent état',
        'Continuer le programme actuel',
        'Surveiller l\'évolution de croissance'
      ];

      const { data, error } = await supabase
        .from('photo_analyses')
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          analysis_result: mockAnalysis,
          health_score: healthScore,
          issues_detected: issues,
          recommendations: recommendations
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photo-analyses'] });
    },
  });
};
