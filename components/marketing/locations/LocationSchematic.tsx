"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { LocationSchematic } from "@/lib/marketing/location-schematics";
import { LocationSchematicFallback } from "@/components/marketing/locations/LocationSchematicFallback";
import { getWebglUnavailable } from "@/lib/marketing/scene-capabilities";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

const LocationSchematicScene = dynamic(
  () =>
    import("@/components/marketing/locations/LocationSchematicScene").then(
      (module) => module.LocationSchematicScene
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[420px] items-center justify-center bg-field/40 text-sm text-smoke">
        Loading 3D schematic…
      </div>
    ),
  }
);

export function LocationSchematic({
  schematic,
  variant = "card",
  selectedZoneId = null,
  hoveredZoneId = null,
  onZoneSelect,
  onZoneHover,
}: {
  schematic: LocationSchematic;
  variant?: "card" | "immersive";
  selectedZoneId?: string | null;
  hoveredZoneId?: string | null;
  onZoneSelect?: (zoneId: string) => void;
  onZoneHover?: (zoneId: string | null) => void;
}) {
  const preferStatic = usePrefersReducedMotion();
  const [webglFailed] = useState(() => getWebglUnavailable());

  const showFallback = preferStatic || webglFailed;
  const isImmersive = variant === "immersive";

  const scene = showFallback ? (
    <LocationSchematicFallback
      schematic={schematic}
      selectedZoneId={selectedZoneId}
      onZoneSelect={onZoneSelect}
      onZoneHover={onZoneHover}
    />
  ) : (
    <LocationSchematicScene
      schematic={schematic}
      autoRotate={!preferStatic && !selectedZoneId}
      immersive={isImmersive}
      selectedZoneId={selectedZoneId}
      hoveredZoneId={hoveredZoneId}
      onZoneSelect={onZoneSelect}
      onZoneHover={onZoneHover}
    />
  );

  if (isImmersive) {
    return <div className="absolute inset-0">{scene}</div>;
  }

  return (
    <div className="overflow-hidden rounded-[16px] border border-bone bg-field shadow-[0_24px_64px_rgba(17,17,17,0.06)]">
      <div className="flex items-center justify-between border-b border-bone bg-chalk px-4 py-3 sm:px-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange">
            Facility schematic
          </p>
          <p className="mt-0.5 text-sm font-semibold text-pitch">{schematic.name}</p>
        </div>
        <p className="hidden text-[10px] font-bold uppercase tracking-[0.1em] text-smoke sm:block">
          Drag to orbit · Click rooms
        </p>
      </div>

      <div className="relative aspect-[4/3] min-h-[320px] w-full sm:min-h-[420px] lg:min-h-[480px]">
        {scene}
      </div>

      <div className="border-t border-bone bg-chalk px-4 py-3 sm:px-5">
        <p className="text-sm leading-relaxed text-slate">{schematic.caption}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {schematic.zones.map((zone) => (
            <button
              key={zone.id}
              type="button"
              onClick={() => onZoneSelect?.(zone.id)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] transition-colors ${
                selectedZoneId === zone.id
                  ? "border-orange bg-orange/10 text-orange"
                  : "border-bone bg-field text-slate hover:border-orange/40"
              }`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: zone.color }}
                aria-hidden
              />
              {zone.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
