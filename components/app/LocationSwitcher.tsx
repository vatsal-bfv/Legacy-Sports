"use client";

import { useLocationScope } from "@/components/app/LocationProvider";
import { demoStore } from "@/lib/demo/store";
import { MapPin } from "lucide-react";

export function LocationSwitcher() {
  const { locationId, setLocationId } = useLocationScope();
  const locations = demoStore.locations;

  return (
    <div className="flex items-center gap-2">
      <MapPin className="h-4 w-4 text-smoke" />
      <select
        value={locationId ?? "all"}
        onChange={(e) =>
          setLocationId(e.target.value === "all" ? null : e.target.value)
        }
        className="rounded-[8px] border-[1.5px] border-bone bg-field px-3 py-1.5 text-sm text-pitch focus:border-orange focus:outline-none focus:ring-4 focus:ring-orange/10"
      >
        <option value="all">All locations</option>
        {locations.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name}
          </option>
        ))}
      </select>
    </div>
  );
}
