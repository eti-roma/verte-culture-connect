
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCultureParameters = () => {
  return useQuery({
    queryKey: ['culture-parameters'],
    queryFn: async () => {
      console.log('Fetching culture parameters...');
      const { data, error } = await supabase
        .from('culture_parameters')
        .select('*')
        .order('recorded_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching culture parameters:', error);
        throw error;
      }
      console.log('Culture parameters fetched:', data);
      return data;
    },
  });
};

export const useAddCultureParameter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (parameter: any) => {
      console.log('Adding culture parameter:', parameter);
      
      // S'assurer que user_id est défini
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Vous devez être connecté pour ajouter des paramètres');
      }

      const parameterWithUserId = {
        ...parameter,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('culture_parameters')
        .insert([parameterWithUserId])
        .select()
        .single();
      
      if (error) {
        console.error('Error adding culture parameter:', error);
        throw error;
      }
      console.log('Culture parameter added:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['culture-parameters'] });
    },
  });
};
