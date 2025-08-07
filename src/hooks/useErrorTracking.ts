import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useErrorTracking = () => {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
      toast({
        title: "Une erreur s'est produite",
        description: "L'application a rencontré un problème",
        variant: "destructive",
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      toast({
        title: "Erreur de connexion",
        description: "Problème de réseau ou de base de données",
        variant: "destructive",
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [toast]);
};