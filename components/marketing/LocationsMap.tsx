"use client";

import dynamic from "next/dynamic";
import { demoStore } from "@/lib/demo/store";

const LocationsMapLeaflet = dynamic(
  () =>
    import("@/components/marketing/LocationsMapLeaflet").then(
      (m) => m.LocationsMapLeaflet
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#12141A] text-sm text-[#9DA3AE]">
        Loading map…
      </div>
    ),
  }
);

export function LocationsMap() {
  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-[#2A2D34] bg-[#12141A]">
      <LocationsMapLeaflet locations={demoStore.locations} />
      <p className="pointer-events-none absolute bottom-3 right-3 z-[1000] rounded-md bg-[#0A0B0D]/80 px-2 py-1 text-xs text-[#9DA3AE] backdrop-blur-sm">
        Atlanta Metro - {demoStore.locations.length} locations
      </p>
    </div>
  );
}
