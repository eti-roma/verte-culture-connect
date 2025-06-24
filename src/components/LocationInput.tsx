
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LocationInput = ({
  value,
  onChange,
  locating
}: {
  value: string;
  onChange: (value: string) => void;
  locating: boolean;
}) => {
  const [isManual, setIsManual] = useState(false);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          required
          type="text"
          placeholder="Ville"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={!isManual && locating}
          className={!isManual && !value && locating ? "bg-gray-100" : ""}
          minLength={2}
          maxLength={64}
        />
        {locating && !isManual && (
          <span className="absolute right-3 top-2.5 text-xs text-emerald-700 animate-pulse">
            Localisation…
          </span>
        )}
      </div>
      
      {!isManual && !value && !locating && (
        <div className="text-xs text-gray-600">
          <p>La géolocalisation n'est pas disponible.</p>
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-xs text-emerald-700"
            onClick={() => setIsManual(true)}
          >
            Saisir manuellement
          </Button>
        </div>
      )}
      
      {!isManual && value && (
        <Button
          type="button"
          variant="link"
          className="h-auto p-0 text-xs text-emerald-700"
          onClick={() => setIsManual(true)}
        >
          Modifier manuellement
        </Button>
      )}
    </div>
  );
};

export default LocationInput;
