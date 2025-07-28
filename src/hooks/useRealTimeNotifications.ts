
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export const useRealTimeNotifications = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Simuler l'écoute des changements temps réel
    // En attendant que la table notifications soit disponible dans les types
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_posts' // Utiliser une table existante pour le moment
        },
        (payload) => {
          console.log('Nouveau post communautaire:', payload);
          
          // Invalider le cache des notifications
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
          queryClient.invalidateQueries({ queryKey: ['unread-notifications-count'] });
          
          console.log('Nouvelle activité - Un nouveau post a été publié dans la communauté');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};

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
        
        // Simuler la notification au lieu d'insérer dans la DB
        console.log('Notification simulée:', randomNotification);
        
        // Invalider les caches
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['unread-notifications-count'] });
      }
    }, 30000); // Toutes les 30 secondes

    return () => clearInterval(interval);
  }, [queryClient]);
};
