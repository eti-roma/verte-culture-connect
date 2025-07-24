
import { useEffect } from 'react';

interface ErrorInfo {
  message: string;
  stack?: string;
  url?: string;
  lineNumber?: number;
  columnNumber?: number;
  timestamp: Date;
  userAgent: string;
}

export const useErrorTracking = () => {

  const logError = (error: ErrorInfo) => {
    // Enregistrer l'erreur localement
    const errors = JSON.parse(localStorage.getItem('app-errors') || '[]');
    errors.push(error);
    
    // Garder seulement les 50 dernières erreurs
    if (errors.length > 50) {
      errors.splice(0, errors.length - 50);
    }
    
    localStorage.setItem('app-errors', JSON.stringify(errors));
    
    console.error('Error tracked:', error);
  };

  const getStoredErrors = (): ErrorInfo[] => {
    return JSON.parse(localStorage.getItem('app-errors') || '[]');
  };

  const clearErrors = () => {
    localStorage.removeItem('app-errors');
  };

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      logError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename,
        lineNumber: event.lineno,
        columnNumber: event.colno,
        timestamp: new Date(),
        userAgent: navigator.userAgent
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        timestamp: new Date(),
        userAgent: navigator.userAgent
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return { logError, getStoredErrors, clearErrors };
};
