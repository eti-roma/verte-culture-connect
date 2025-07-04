
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Monitor } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {theme === 'light' && <Sun className="h-4 w-4" />}
          {theme === 'dark' && <Moon className="h-4 w-4" />}
          {theme === 'system' && <Monitor className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          Clair
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          Sombre
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Monitor className="mr-2 h-4 w-4" />
          Système
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
