
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
      // Simuler des questions de quiz
      const mockQuestions: QuizQuestion[] = [
        {
          id: '1',
          question: 'Quel est le pH optimal pour la plupart des cultures hydroponiques ?',
          options: ['4.0 - 5.0', '5.5 - 6.5', '7.0 - 8.0', '8.0 - 9.0'],
          correct_answer: 1,
          explanation: 'Un pH entre 5.5 et 6.5 permet une absorption optimale des nutriments par les racines.'
        },
        {
          id: '2',
          question: 'Que signifie l\'acronyme NFT ?',
          options: ['New Farming Technology', 'Nutrient Film Technique', 'Natural Food Treatment', 'No Fertilizer Technology'],
          correct_answer: 1,
          explanation: 'NFT (Nutrient Film Technique) est un système où les racines baignent dans un film nutritif continu.'
        }
      ];
      
      return mockQuestions;
    },
  });
};

export const useSubmitQuizResponse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (response: QuizResponse) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      console.log('Submitting quiz response:', response);
      return { success: true };
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

      // Simuler les résultats de quiz
      const correct = Math.floor(Math.random() * 8) + 2; // 2-10 bonnes réponses
      const total = 10;
      
      return {
        correct,
        total,
        percentage: Math.round((correct / total) * 100),
        responses: []
      };
    },
  });
};
