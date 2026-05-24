"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { AthleteGender } from "@/lib/marketing/featured-athletes";
import { AthleteHologramFallback } from "@/components/marketing/athletes/AthleteHologramFallback";
import { getWebglUnavailable } from "@/lib/marketing/scene-capabilities";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

const AthleteHologramScene = dynamic(
  () =>
    import("@/components/marketing/athletes/AthleteHologramScene").then(
      (module) => module.AthleteHologramScene
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[320px] items-center justify-center text-sm text-smoke">
        Loading…
      </div>
    ),
  }
);

export function AthleteHologram({
  gender = "male",
  variant = "card",
  compact = false,
}: {
  gender?: AthleteGender;
  variant?: "card" | "immersive";
  /** Smaller model + tighter camera for embedded command-os layouts */
  compact?: boolean;
}) {
  const preferStatic = usePrefersReducedMotion();
  const [webglFailed] = useState(() => getWebglUnavailable());

  const showFallback = preferStatic || webglFailed;
  const isImmersive = variant === "immersive";

  const scene = showFallback ? (
    <AthleteHologramFallback />
  ) : (
    <AthleteHologramScene
      autoRotate={!preferStatic}
      gender={gender}
      immersive={isImmersive}
      compact={compact && isImmersive}
    />
  );

  if (isImmersive) {
    return <div className="absolute inset-0 z-[1]">{scene}</div>;
  }

  return (
    <div className="relative h-full min-h-[320px] w-full">
      {scene}
    </div>
  );
}
