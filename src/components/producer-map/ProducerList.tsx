
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, User } from "lucide-react";

type Producer = {
  id: string;
  name: string;
  email?: string;
  user_id?: string;
  city?: string;
  region?: string;
  speciality?: string;
  experience_years?: number | string;
  rating?: number | string;
};

interface ProducerListProps {
  producers: Producer[];
  onSelect: (id: string) => void;
}

export const ProducerList: React.FC<ProducerListProps> = ({ producers, onSelect }) => {
  if (producers.length === 0)
    return (
      <div className="col-span-full text-center text-gray-400 py-8">
        Aucun producteur trouvé.
      </div>
    );

  return (
    <>
      {producers.map(producer => (
        <Card
          key={producer.id}
          className="hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
          onClick={() => onSelect(producer.id)}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{producer.name}</CardTitle>
                <CardDescription className="flex items-center space-x-1 mt-1">
                  <User className="w-3 h-3" />
                  <span>{producer.email || producer.user_id}</span>
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  ⭐ {producer.rating ?? "N/A"}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2 text-gray-600 text-sm">
              <MapPin className="w-4 h-4" />
              <span>
                {producer.city ? `${producer.city}, ` : ""}
                {producer.region ?? ""}
              </span>
            </div>
            <div className="space-y-2">
              <Badge className="bg-green-100 text-green-800">
                {producer.speciality || "—"}
              </Badge>
              <div className="text-sm text-gray-600">
                Expérience: {producer.experience_years ? `${producer.experience_years} ans` : "—"}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full hover:bg-green-50 hover:text-green-600"
              tabIndex={-1}
            >
              Voir Profil
            </Button>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

