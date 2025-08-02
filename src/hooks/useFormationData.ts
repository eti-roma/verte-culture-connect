import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Module {
  id: string;
  titre: string;
  description: string | null;
  ordre: number;
  created_at: string;
  updated_at: string;
}

interface Lecon {
  id: string;
  module_id: string;
  titre: string;
  contenu: string | null;
  type: 'texte' | 'video' | 'pdf';
  ordre: number;
  created_at: string;
  updated_at: string;
}

export const useFormation = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [lecons, setLecons] = useState<Lecon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadModules = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .order('ordre', { ascending: true });

      if (error) throw error;
      setModules(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadLecons = async (moduleId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('lecons')
        .select('*')
        .eq('module_id', moduleId)
        .order('ordre', { ascending: true });

      if (error) throw error;
      setLecons((data as Lecon[]) || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModules();
  }, []);

  return {
    modules,
    lecons,
    loading,
    error,
    loadModules,
    loadLecons
  };
};