
import React from "react";
import { Input } from "@/components/ui/input";

const LocationInput = ({
  value,
  locating
}: {
  value: string;
  locating: boolean;
}) => (
  <div className="relative">
    <Input
      required
      type="text"
      placeholder="Ville"
      value={value}
      readOnly
      disabled
      className="bg-gray-100 cursor-not-allowed"
      minLength={2}
      maxLength={64}
    />
    {locating && (
      <span className="absolute right-3 top-2.5 text-xs text-emerald-700 animate-pulse">
        Localisation…
      </span>
    )}
    {(!("geolocation" in navigator)) && (
      <div className="text-xs text-orange-500 pl-1">La détection automatique n’est pas possible sur ce navigateur.</div>
    )}
  </div>
);

export default LocationInput;
