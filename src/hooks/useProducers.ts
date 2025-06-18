
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProducers = () => {
  return useQuery({
    queryKey: ['producers'],
    queryFn: async () => {
      console.log('Fetching producers...');
      const { data, error } = await supabase
        .from('producers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching producers:', error);
        throw error;
      }
      console.log('Producers fetched:', data);
      return data;
    },
  });
};

export const useAddProducer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (producer: any) => {
      console.log('Adding producer:', producer);
      
      // S'assurer que user_id est défini
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Vous devez être connecté pour ajouter un producteur');
      }

      const producerWithUserId = {
        ...producer,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('producers')
        .insert([producerWithUserId])
        .select()
        .single();
      
      if (error) {
        console.error('Error adding producer:', error);
        throw error;
      }
      console.log('Producer added:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['producers'] });
    },
  });
};
