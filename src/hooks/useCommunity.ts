
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCommunityPosts = () => {
  return useQuery({
    queryKey: ['community-posts'],
    queryFn: async () => {
      console.log('Fetching community posts...');
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          comments (
            *
          ),
          likes (
            user_id
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching community posts:', error);
        throw error;
      }
      console.log('Community posts fetched:', data);
      return data;
    },
  });
};

export const useAddPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (post: any) => {
      console.log('Adding post:', post);
      
      // S'assurer que user_id est défini
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Vous devez être connecté pour publier');
      }

      const postWithUserId = {
        ...post,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('community_posts')
        .insert([postWithUserId])
        .select()
        .single();
      
      if (error) {
        console.error('Error adding post:', error);
        throw error;
      }
      console.log('Post added:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
    },
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (comment: any) => {
      console.log('Adding comment:', comment);
      
      // S'assurer que user_id est défini
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Vous devez être connecté pour commenter');
      }

      const commentWithUserId = {
        ...comment,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('comments')
        .insert([commentWithUserId])
        .select()
        .single();
      
      if (error) {
        console.error('Error adding comment:', error);
        throw error;
      }
      console.log('Comment added:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
    },
  });
};
