"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { LocationSchematic } from "@/lib/marketing/location-schematics";
import { LocationSchematicFallback } from "@/components/marketing/locations/LocationSchematicFallback";

const LocationSchematicScene = dynamic(
  () =>
    import("@/components/marketing/locations/LocationSchematicScene").then(
      (module) => module.LocationSchematicScene
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[420px] items-center justify-center bg-field text-sm text-smoke">
        Loading 3D schematic…
      </div>
    ),
  }
);

export function LocationSchematic({
  schematic,
}: {
  schematic: LocationSchematic;
}) {
  const [preferStatic, setPreferStatic] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPreferStatic(media.matches);

    function onChange(event: MediaQueryListEvent) {
      setPreferStatic(event.matches);
    }

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebglFailed(true);
      }
    } catch {
      setWebglFailed(true);
    }
  }, []);

  const showFallback = preferStatic || webglFailed;

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
          Drag to orbit
        </p>
      </div>

      <div className="relative aspect-[4/3] min-h-[320px] w-full sm:min-h-[420px] lg:min-h-[480px]">
        {showFallback ? (
          <LocationSchematicFallback schematic={schematic} />
        ) : (
          <LocationSchematicScene schematic={schematic} autoRotate={!preferStatic} />
        )}
      </div>

      <div className="border-t border-bone bg-chalk px-4 py-3 sm:px-5">
        <p className="text-sm leading-relaxed text-slate">{schematic.caption}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {schematic.zones.map((zone) => (
            <span
              key={zone.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-bone bg-field px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-slate"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: zone.color }}
                aria-hidden
              />
              {zone.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
