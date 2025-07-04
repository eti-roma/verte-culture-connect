
import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export const OnlineStatusIndicator = () => {
  const isOnline = useOnlineStatus();

  return (
    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
      isOnline 
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }`}>
      {isOnline ? (
        <>
          <Wifi className="w-3 h-3" />
          <span>En ligne</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3" />
          <span>Hors ligne</span>
        </>
      )}
    </div>
  );
};
