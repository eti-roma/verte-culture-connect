
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type Formation = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  module: string;
  created_at: string;
};

export const useFormation = () => {
  return useQuery({
    queryKey: ['formation'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('formation')
        .select('*')
        .order('module', { ascending: true });
      
      if (error) throw error;
      return data as Formation[];
    },
  });
};

export const useFormationByModule = (module: string) => {
  return useQuery({
    queryKey: ['formation', module],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('formation')
        .select('*')
        .eq('module', module)
        .order('title', { ascending: true });
      
      if (error) throw error;
      return data as Formation[];
    },
  });
};
