
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface ProducerSearchBarProps {
  searchLocation: string;
  setSearchLocation: (value: string) => void;
  onSearch?: () => void;
}

export const ProducerSearchBar: React.FC<ProducerSearchBarProps> = ({
  searchLocation,
  setSearchLocation,
  onSearch,
}) => (
  <div className="flex space-x-2">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        placeholder="Rechercher par localisation ou producteur..."
        value={searchLocation}
        onChange={(e) => setSearchLocation(e.target.value)}
        className="pl-10"
      />
    </div>
    <Button
      className="bg-green-500 hover:bg-green-600"
      type="button"
      onClick={onSearch}
    >
      Rechercher
    </Button>
  </div>
);

