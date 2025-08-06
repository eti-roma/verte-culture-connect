
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

export const useModuleCompletion = () => {
  return useQuery({
    queryKey: ['module-completion'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { totalModules: 0, completedModules: 0 };

      // Get total modules count
      const { data: modules } = await supabase
        .from('training_modules')
        .select('id');

      // Get completed modules (modules where all sections are completed)
      const { data: completedModules } = await supabase
        .from('training_progress')
        .select('module_id')
        .eq('user_id', user.id)
        .eq('progress_percentage', 100);

      const totalModules = modules?.length || 0;
      const uniqueCompletedModules = new Set(completedModules?.map(cm => cm.module_id) || []).size;

      return {
        totalModules,
        completedModules: uniqueCompletedModules
      };
    },
  });
};

export const useTrainingProgress = (moduleId: string) => {
  return useQuery({
    queryKey: ['training-progress', moduleId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Get progress for this module
      const { data: progress } = await supabase
        .from('training_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_id', moduleId);

      if (!progress || progress.length === 0) {
        return {
          progress_percentage: 0,
          completed_at: null
        };
      }

      // Calculate average progress for the module
      const avgProgress = progress.reduce((sum, p) => sum + p.progress_percentage, 0) / progress.length;
      const isCompleted = progress.every(p => p.progress_percentage === 100);

      return {
        progress_percentage: Math.round(avgProgress),
        completed_at: isCompleted ? progress[0].completed_at : null
      };
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

      // Update or insert progress
      const { data, error } = await supabase
        .from('training_progress')
        .upsert({
          user_id: user.id,
          module_id: moduleId,
          section_id: sectionId,
          progress_percentage: progressPercentage,
          completed_at: progressPercentage === 100 ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,module_id,section_id'
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-progress'] });
      queryClient.invalidateQueries({ queryKey: ['module-completion'] });
    },
  });
};
