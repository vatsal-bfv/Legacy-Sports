"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AthleteHologramFallback } from "@/components/marketing/athletes/AthleteHologramFallback";

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

export function AthleteHologram() {
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
    <div className="relative h-full min-h-[320px] w-full">
      {showFallback ? (
        <AthleteHologramFallback />
      ) : (
        <AthleteHologramScene autoRotate={!preferStatic} />
      )}
    </div>
  );
}
