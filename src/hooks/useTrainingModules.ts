
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTrainingModules = () => {
  return useQuery({
    queryKey: ['training-modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_modules')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      return data;
    },
  });
};

export const useTrainingSections = (moduleId: string) => {
  return useQuery({
    queryKey: ['training-sections', moduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_sections')
        .select(`
          *,
          training_resources (*)
        `)
        .eq('module_id', moduleId)
        .order('order_index');
      
      if (error) throw error;
      return data;
    },
  });
};
