
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

export interface QuizResponse {
  question_id: string;
  selected_answer: number;
  is_correct: boolean;
}

export const useQuizQuestions = (moduleId: string) => {
  return useQuery({
    queryKey: ['quiz-questions', moduleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('module_id', moduleId);
      
      if (error) throw error;
      return data as QuizQuestion[];
    },
  });
};

export const useSubmitQuizResponse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (response: QuizResponse) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('quiz_responses')
        .insert({
          user_id: user.id,
          question_id: response.question_id,
          selected_answer: response.selected_answer,
          is_correct: response.is_correct
        });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz-responses'] });
    },
  });
};

export const useQuizResults = (moduleId: string) => {
  return useQuery({
    queryKey: ['quiz-results', moduleId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('quiz_responses')
        .select(`
          *,
          quiz_questions!inner(module_id)
        `)
        .eq('user_id', user.id)
        .eq('quiz_questions.module_id', moduleId);
      
      if (error) throw error;
      
      const correct = data.filter(r => r.is_correct).length;
      const total = data.length;
      
      return {
        correct,
        total,
        percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
        responses: data
      };
    },
  });
};
