import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Clock } from 'lucide-react';

interface Module {
  id: string;
  titre: string;
  description: string | null;
  ordre: number;
}

interface ModuleCardProps {
  module: Module;
  onSelect: (moduleId: string) => void;
}

const ModuleCard = ({ module, onSelect }: ModuleCardProps) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 group"
      onClick={() => onSelect(module.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <Badge variant="secondary" className="text-xs">
            Module {module.ordre}
          </Badge>
        </div>
        <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
          {module.titre}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2">
          {module.description || 'Description non disponible'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>~15 min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>Formation</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleCard;