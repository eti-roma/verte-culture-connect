
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
      if (!user) return { totalModules: 4, completedModules: 0 };

      const { data: modules } = await supabase
        .from('training_modules')
        .select('id');
      
      const { data: progress } = await supabase
        .from('training_progress')
        .select('module_id')
        .eq('user_id', user.id)
        .eq('progress_percentage', 100);

      return {
        totalModules: modules?.length || 4,
        completedModules: progress?.length || 0
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

      if (moduleId === 'all') {
        // Get overall completion statistics
        const { data, error } = await supabase
          .from('training_progress')
          .select(`
            *,
            training_modules!training_progress_module_id_fkey (*)
          `)
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        const totalModules = 4; // From our sample data
        const completedModules = data?.filter(p => p.progress_percentage === 100).length || 0;
        
        return {
          totalModules,
          completedModules,
          progressData: data
        };
      }

      // Get progress for specific module
      const { data, error } = await supabase
        .from('training_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
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

      const { error } = await supabase
        .from('training_progress')
        .upsert({
          user_id: user.id,
          module_id: moduleId,
          section_id: sectionId,
          progress_percentage: progressPercentage,
          completed_at: progressPercentage === 100 ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-progress'] });
      queryClient.invalidateQueries({ queryKey: ['module-completion'] });
    },
  });
};
