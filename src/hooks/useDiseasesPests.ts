
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDiseasesPests = () => {
  return useQuery({
    queryKey: ['diseases-pests'],
    queryFn: async () => {
      console.log('Fetching diseases and pests...');
      const { data, error } = await supabase
        .from('diseases_pests')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching diseases and pests:', error);
        throw error;
      }
      console.log('Diseases and pests fetched:', data);
      return data;
    },
  });
};

export const useProblemReports = () => {
  return useQuery({
    queryKey: ['problem-reports'],
    queryFn: async () => {
      console.log('Fetching problem reports...');
      const { data, error } = await supabase
        .from('problem_reports')
        .select(`
          *,
          diseases_pests (*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching problem reports:', error);
        throw error;
      }
      console.log('Problem reports fetched:', data);
      return data;
    },
  });
};

export const useAddProblemReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (report: any) => {
      console.log('Adding problem report:', report);
      
      // S'assurer que user_id est défini
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Vous devez être connecté pour signaler un problème');
      }

      const reportWithUserId = {
        ...report,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('problem_reports')
        .insert([reportWithUserId])
        .select()
        .single();
      
      if (error) {
        console.error('Error adding problem report:', error);
        throw error;
      }
      console.log('Problem report added:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problem-reports'] });
    },
  });
};
