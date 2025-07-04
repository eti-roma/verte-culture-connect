
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  created_at: string;
}

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Simuler des notifications jusqu'à ce que la table soit disponible
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'pH anormal détecté',
          message: 'Le pH de votre culture a dépassé les valeurs optimales',
          type: 'warning',
          read: false,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Récolte prête',
          message: 'Vos cultures sont prêtes à être récoltées',
          type: 'success',
          read: false,
          created_at: new Date(Date.now() - 3600000).toISOString()
        }
      ];

      return mockNotifications;
    },
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      console.log('Marking notification as read:', notificationId);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ title, message, type = 'info' }: {
      title: string;
      message: string;
      type?: 'info' | 'warning' | 'success' | 'error';
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      console.log('Creating notification:', { title, message, type });
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useUnreadNotificationsCount = () => {
  return useQuery({
    queryKey: ['unread-notifications-count'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      // Simuler le compteur de notifications non lues
      return Math.floor(Math.random() * 5);
    },
  });
};
