
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { useProducers } from '@/hooks/useProducers';
import { Button } from '@/components/ui/button';

import { ProducerDetail } from './producer-map/ProducerDetail';
import { ProducerList } from './producer-map/ProducerList';
import { ProducerSearchBar } from './producer-map/ProducerSearchBar';

export const ProducerMap = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedProducer, setSelectedProducer] = useState<string | null>(null);

  const { data: producers, isLoading, error } = useProducers();

  const filteredProducers = producers
    ? producers.filter((producer: any) =>
        producer.city?.toLowerCase().includes(searchLocation.toLowerCase()) ||
        producer.region?.toLowerCase().includes(searchLocation.toLowerCase()) ||
        producer.name?.toLowerCase().includes(searchLocation.toLowerCase())
      )
    : [];

  if (isLoading) {
    return <div className="flex items-center justify-center py-8">Chargement…</div>;
  }
  if (error) {
    return (
      <div className="flex flex-col items-center py-8">
        <span className="text-red-600 font-medium mb-2">Erreur lors du chargement des producteurs.</span>
        <Button variant="outline" onClick={() => window.location.reload()}>Réessayer</Button>
      </div>
    );
  }

  if (selectedProducer && producers) {
    const producer = producers.find((p: any) => p.id === selectedProducer);
    if (!producer) return <div className="text-red-700 p-6">Producteur introuvable.</div>;
    return <ProducerDetail producer={producer} onBack={() => setSelectedProducer(null)} />;
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
          <ProducerSearchBar
            searchLocation={searchLocation}
            setSearchLocation={setSearchLocation}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProducerList producers={filteredProducers} onSelect={setSelectedProducer} />
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

