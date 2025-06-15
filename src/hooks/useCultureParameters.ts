
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCultureParameters = () => {
  return useQuery({
    queryKey: ['culture-parameters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('culture_parameters')
        .select('*')
        .order('recorded_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useAddCultureParameter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (parameter: any) => {
      const { data, error } = await supabase
        .from('culture_parameters')
        .insert([parameter])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['culture-parameters'] });
    },
  });
};
