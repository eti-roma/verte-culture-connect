
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

type Producer = {
  id: string;
  name: string;
  email?: string;
  user_id?: string;
  city?: string;
  region?: string;
  address?: string;
  rating?: number | string;
  description?: string;
  speciality?: string;
  experience_years?: number | string;
  equipment?: string[];
};

interface ProducerDetailProps {
  producer: Producer;
  onBack: () => void;
}

export const ProducerDetail: React.FC<ProducerDetailProps> = ({ producer, onBack }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <Button
        variant="ghost"
        onClick={onBack}
        className="text-green-600 hover:text-green-700"
      >
        ← Retour à la carte
      </Button>
    </div>
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl">{producer.name}</CardTitle>
            <CardDescription className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{producer.email || producer.user_id}</span>
            </CardDescription>
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>
                {producer.city ? `${producer.city}, ` : ""}
                {producer.region ? `${producer.region}, ` : ""}
                {producer.address || ""}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              ⭐ {producer.rating ?? "N/A"}
            </div>
            <div className="text-sm text-gray-500">Note moyenne</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
          <p className="text-gray-600">{producer.description || "—"}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Spécialité</h4>
            <Badge className="bg-green-100 text-green-800">{producer.speciality || "—"}</Badge>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Expérience</h4>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">
                {producer.experience_years ? `${producer.experience_years} ans` : "—"}
              </span>
            </div>
          </div>
        </div>
        {producer.equipment?.length ? (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Équipements</h4>
            <div className="flex flex-wrap gap-2">
              {producer.equipment.map((item, i) => (
                <Badge key={i} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}
        <div className="flex space-x-3">
          <Button className="flex-1 bg-green-500 hover:bg-green-600">Contacter</Button>
          <Button variant="outline" className="flex-1">Planifier Visite</Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

