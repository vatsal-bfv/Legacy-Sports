"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function LoadingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const brandRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const brand = brandRef.current;
    const progress = progressRef.current;

    if (!overlay || !brand || !progress) {
      onComplete();
      return;
    }

    if (typeof window !== "undefined") {
      const hasLoaded = window.sessionStorage.getItem("legacy_loaded") === "true";

      if (hasLoaded) {
        gsap.set(overlay, { display: "none", pointerEvents: "none" });
        onComplete();
        return;
      }
    }

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      onComplete: () => {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem("legacy_loaded", "true");
        }

        gsap.set(overlay, { display: "none", pointerEvents: "none" });
        onComplete();
      },
    });

    tl.fromTo(progress, { width: "0%" }, { width: "100%", duration: 1.2 })
      .to(
        brand,
        {
          opacity: 0,
          y: -8,
          duration: 0.35,
          ease: "legacyEase",
        },
        ">",
      )
      .to(
        overlay,
        {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.75,
          ease: "legacyEase",
        },
        ">-0.05",
      );

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-ink px-5 text-ghost"
    >
      <div ref={brandRef} className="flex flex-col items-center">
        <span className="font-display text-[52px] uppercase tracking-[0.1em]">
          LEGACY
        </span>
        <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-ash">
          Sports Complex
        </span>
        <div className="mt-8 h-px w-[200px] bg-ghost/12">
          <div ref={progressRef} className="h-full w-0 bg-orange" />
        </div>
      </div>
    </div>
  );
}
