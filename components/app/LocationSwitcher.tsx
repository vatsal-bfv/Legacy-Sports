"use client";

import { useLocationScope } from "@/components/app/LocationProvider";
import { demoStore } from "@/lib/demo/store";
import { MapPin } from "lucide-react";

export function LocationSwitcher() {
  const { locationId, setLocationId } = useLocationScope();
  const locations = demoStore.locations;

  return (
    <div className="flex items-center gap-2">
      <MapPin className="h-4 w-4 text-[#9DA3AE]" />
      <select
        value={locationId ?? "all"}
        onChange={(e) =>
          setLocationId(e.target.value === "all" ? null : e.target.value)
        }
        className="rounded-md border border-[#2A2D34] bg-[#12141A] px-3 py-1.5 text-sm text-[#F5F6F7]"
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
