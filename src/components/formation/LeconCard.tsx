import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlayCircle, FileText, Download, ExternalLink } from 'lucide-react';

interface Lecon {
  id: string;
  titre: string;
  contenu: string | null;
  type: 'texte' | 'video' | 'pdf';
  ordre: number;
}

interface LeconCardProps {
  lecon: Lecon;
}

const LeconCard = ({ lecon }: LeconCardProps) => {
  const getIcon = () => {
    switch (lecon.type) {
      case 'video':
        return <PlayCircle className="w-5 h-5 text-red-500" />;
      case 'pdf':
        return <Download className="w-5 h-5 text-blue-500" />;
      case 'texte':
        return <FileText className="w-5 h-5 text-green-500" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getBadgeColor = () => {
    switch (lecon.type) {
      case 'video':
        return 'bg-red-100 text-red-700 hover:bg-red-200';
      case 'pdf':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
      case 'texte':
        return 'bg-green-100 text-green-700 hover:bg-green-200';
      default:
        return 'secondary';
    }
  };

  const handleAccess = () => {
    if (lecon.contenu) {
      if (lecon.type === 'video' && lecon.contenu.includes('youtube.com')) {
        // Convert to embed URL for YouTube
        const videoId = lecon.contenu.split('watch?v=')[1]?.split('&')[0];
        if (videoId) {
          window.open(`https://www.youtube.com/embed/${videoId}`, '_blank');
        } else {
          window.open(lecon.contenu, '_blank');
        }
      } else {
        window.open(lecon.contenu, '_blank');
      }
    }
  };

  return (
    <Card className="hover:shadow-md transition-all duration-300 border hover:border-primary/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getIcon()}
            <div className="flex flex-col">
              <CardTitle className="text-base font-semibold">
                {lecon.titre}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getBadgeColor()}>
                  {lecon.type === 'video' ? 'Vidéo' : 
                   lecon.type === 'pdf' ? 'PDF' : 'Texte'}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Leçon {lecon.ordre}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Button 
          onClick={handleAccess}
          disabled={!lecon.contenu}
          className="w-full"
          variant={lecon.contenu ? "default" : "secondary"}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          {lecon.type === 'video' ? 'Voir la vidéo' : 
           lecon.type === 'pdf' ? 'Télécharger PDF' : 'Lire le contenu'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default LeconCard;