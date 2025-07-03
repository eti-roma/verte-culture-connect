
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export const useRealTimeNotifications = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          console.log('Nouvelle notification:', payload);
          
          // Invalider le cache des notifications
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
          queryClient.invalidateQueries({ queryKey: ['unread-notifications-count'] });
          
          // Afficher un toast pour la nouvelle notification
          if (payload.new) {
            toast({
              title: payload.new.title,
              description: payload.new.message,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);
};

// Hook pour simuler l'ajout de notifications périodiques
export const useSimulateNotifications = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const interval = setInterval(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Simuler l'ajout de notifications aléatoirement
      if (Math.random() < 0.1) { // 10% de chance toutes les 30 secondes
        const notifications = [
          {
            title: 'Contrôle pH recommandé',
            message: 'Il est temps de vérifier le pH de votre solution nutritive.',
            type: 'warning' as const
          },
          {
            title: 'Nouvelle récolte prête',
            message: 'Vos cultures de laitue sont prêtes à être récoltées !',
            type: 'success' as const
          },
          {
            title: 'Température élevée détectée',
            message: 'La température de votre serre dépasse 28°C.',
            type: 'warning' as const
          }
        ];

        const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
        
        await supabase
          .from('notifications')
          .insert({
            user_id: user.id,
            ...randomNotification
          });
      }
    }, 30000); // Toutes les 30 secondes

    return () => clearInterval(interval);
  }, [queryClient]);
};
