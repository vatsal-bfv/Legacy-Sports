"use client";

import { createContext, useContext, useState } from "react";

const LocationContext = createContext<{
  locationId: string | null;
  setLocationId: (id: string | null) => void;
}>({ locationId: null, setLocationId: () => {} });

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [locationId, setLocationId] = useState<string | null>(null);
  return (
    <LocationContext.Provider value={{ locationId, setLocationId }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationScope() {
  return useContext(LocationContext);
}
