import React from 'react';
import { LanguageSelector } from '@/components/LanguageSelector';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-950 transition-colors duration-300 relative px-4">
      <div className="absolute top-4 right-4">
        <LanguageSelector showLabel={false} size="sm" />
      </div>
      
      <div className="w-full max-w-lg">
        <div className="bg-white dark:bg-card shadow-lg rounded-lg p-8 w-full space-y-6 border border-border">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {subtitle}
            </p>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;