
import React from 'react';
import { Button } from '@/components/ui/button';
import { Leaf, BookOpen, MapPin, Camera, Users, BarChart3, Bug } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation = ({ activeTab, setActiveTab }: NavigationProps) => {
  const navItems = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: Leaf },
    { id: 'formation', label: 'Formation', icon: BookOpen },
    { id: 'map', label: 'Producteurs', icon: MapPin },
    { id: 'ai-tracking', label: 'Suivi IA', icon: Camera },
    { id: 'parameters', label: 'Paramètres', icon: BarChart3 },
    { id: 'diseases', label: 'Maladies', icon: Bug },
    { id: 'community', label: 'Communauté', icon: Users },
  ];

  return (
    <header className="bg-white shadow-lg border-b-4 border-green-500">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">HydroFourrage Pro</h1>
              <p className="text-sm text-gray-600">Production de fourrage hydroponique intelligente</p>
            </div>
          </div>
        </div>
        
        <nav className="flex flex-wrap gap-2 pb-4">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg'
                    : 'hover:bg-green-50 text-gray-700 hover:text-green-600'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
