
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TrainingProgress {
  id: string;
  user_id: string;
  module_id: string;
  section_id?: string;
  progress_percentage: number;
  completed_at?: string;
  created_at: string;
}

export const useTrainingProgress = (moduleId?: string) => {
  return useQuery({
    queryKey: ['training-progress', moduleId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('training_progress')
        .select('*')
        .eq('user_id', user.id);

      if (moduleId) {
        query = query.eq('module_id', moduleId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as TrainingProgress[];
    },
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ moduleId, sectionId, progressPercentage }: {
      moduleId: string;
      sectionId?: string;
      progressPercentage: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('training_progress')
        .upsert({
          user_id: user.id,
          module_id: moduleId,
          section_id: sectionId,
          progress_percentage: progressPercentage,
          completed_at: progressPercentage >= 100 ? new Date().toISOString() : null
        });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-progress'] });
    },
  });
};

export const useModuleCompletion = () => {
  return useQuery({
    queryKey: ['module-completion'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: modules } = await supabase
        .from('training_modules')
        .select('id, title');

      const { data: progress } = await supabase
        .from('training_progress')
        .select('module_id, progress_percentage')
        .eq('user_id', user.id);

      if (!modules) return [];

      return modules.map(module => {
        const moduleProgress = progress?.find(p => p.module_id === module.id);
        return {
          ...module,
          completed: moduleProgress?.progress_percentage >= 100,
          progress: moduleProgress?.progress_percentage || 0
        };
      });
    },
  });
};
