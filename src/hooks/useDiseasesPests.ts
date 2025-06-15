
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDiseasesPests = () => {
  return useQuery({
    queryKey: ['diseases-pests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('diseases_pests')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
};

export const useProblemReports = () => {
  return useQuery({
    queryKey: ['problem-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('problem_reports')
        .select(`
          *,
          diseases_pests (*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useAddProblemReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (report: any) => {
      const { data, error } = await supabase
        .from('problem_reports')
        .insert([report])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problem-reports'] });
    },
  });
};
