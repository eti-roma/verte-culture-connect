
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, User, Calendar } from 'lucide-react';

export const ProducerMap = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedProducer, setSelectedProducer] = useState<number | null>(null);

  const producers = [
    {
      id: 1,
      name: 'Ferme Bio Verte',
      owner: 'Jean Dupont',
      location: 'Lyon, France',
      distance: '2.3 km',
      speciality: 'Orge hydroponique',
      experience: '5 ans',
      rating: 4.8,
      contact: 'jean.dupont@email.com',
      description: 'Spécialisé dans la production d\'orge hydroponique bio, avec 15 cycles par an.',
      equipment: ['Système NFT', 'Éclairage LED', 'Contrôle climatique automatisé']
    },
    {
      id: 2,
      name: 'HydroFourrage Plus',
      owner: 'Marie Martin',
      location: 'Marseille, France',
      distance: '5.7 km',
      speciality: 'Blé et maïs',
      experience: '8 ans',
      rating: 4.9,
      contact: 'marie.martin@email.com',
      description: 'Production intensive de blé et maïs hydroponique pour l\'alimentation animale.',
      equipment: ['Système DWC', 'Serre automatisée', 'Monitoring IoT']
    },
    {
      id: 3,
      name: 'Eco Fourrage',
      owner: 'Pierre Moreau',
      location: 'Toulouse, France',
      distance: '8.2 km',
      speciality: 'Légumineuses',
      experience: '3 ans',
      rating: 4.6,
      contact: 'pierre.moreau@email.com',
      description: 'Nouvelle exploitation focalisée sur les légumineuses hydroponiques.',
      equipment: ['Système Ebb & Flow', 'Panneaux solaires', 'Récupération d\'eau']
    }
  ];

  if (selectedProducer) {
    const producer = producers.find(p => p.id === selectedProducer);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedProducer(null)}
            className="text-green-600 hover:text-green-700"
          >
            ← Retour à la carte
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{producer?.name}</CardTitle>
                <CardDescription className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{producer?.owner}</span>
                </CardDescription>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{producer?.location} • {producer?.distance}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">⭐ {producer?.rating}</div>
                <div className="text-sm text-gray-500">Note moyenne</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{producer?.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Spécialité</h4>
                <Badge className="bg-green-100 text-green-800">{producer?.speciality}</Badge>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Expérience</h4>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{producer?.experience}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Équipements</h4>
              <div className="flex flex-wrap gap-2">
                {producer?.equipment.map((item, index) => (
                  <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <Button className="flex-1 bg-green-500 hover:bg-green-600">
                Contacter
              </Button>
              <Button variant="outline" className="flex-1">
                Planifier Visite
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Producteurs à Proximité</h2>
        <p className="text-lg text-gray-600">
          Découvrez et connectez-vous avec d'autres producteurs de fourrage hydroponique
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par localisation..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="bg-green-500 hover:bg-green-600">
              Rechercher
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {producers.map((producer) => (
          <Card 
            key={producer.id}
            className="hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
            onClick={() => setSelectedProducer(producer.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{producer.name}</CardTitle>
                  <CardDescription className="flex items-center space-x-1 mt-1">
                    <User className="w-3 h-3" />
                    <span>{producer.owner}</span>
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">⭐ {producer.rating}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{producer.location} • {producer.distance}</span>
              </div>
              
              <div className="space-y-2">
                <Badge className="bg-green-100 text-green-800">{producer.speciality}</Badge>
                <div className="text-sm text-gray-600">
                  Expérience: {producer.experience}
                </div>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full hover:bg-green-50 hover:text-green-600"
              >
                Voir Profil
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <MapPin className="w-12 h-12 text-blue-600 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-900">Rejoignez le Réseau</h3>
            <p className="text-gray-600">
              Inscrivez votre exploitation pour être visible par d'autres producteurs
            </p>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              Ajouter Mon Exploitation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
