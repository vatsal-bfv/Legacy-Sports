"use client";

import type { ReactNode } from "react";
import {
  AthleteProfileHud,
  AthleteProfileHudPanel,
  athleteHologramGender,
  IMMERSIVE_OVERLAY_CARD,
  ImmersiveBackdrop,
  type HudMetric,
} from "@/components/app/AthleteProfileHud";
import { AthleteHologram } from "@/components/marketing/athletes/AthleteHologram";
import { cn } from "@/lib/utils";

export function AthleteOverviewStage({
  gender,
  leftMetrics,
  rightMetrics,
  children,
  className,
}: {
  gender: string;
  leftMetrics: HudMetric[];
  rightMetrics: HudMetric[];
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative isolate min-h-[min(68vh,640px)] overflow-hidden rounded-xl",
        className
      )}
    >
      <ImmersiveBackdrop />

      <div className="absolute inset-0 z-[1]">
        <AthleteHologram gender={athleteHologramGender(gender)} variant="immersive" />
      </div>

      <div className="pointer-events-none relative z-10 flex min-h-[min(68vh,640px)] flex-col p-4 lg:p-5">
        <div className="flex flex-1 flex-col justify-center gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="pointer-events-auto hidden max-w-[210px] md:block">
            <AthleteProfileHudPanel metrics={leftMetrics} side="left" />
          </div>

          <div className="hidden min-w-0 flex-1 lg:block" aria-hidden />

          <div className="pointer-events-auto hidden max-w-[210px] md:block">
            <AthleteProfileHudPanel metrics={rightMetrics} side="right" />
          </div>

          <div className="pointer-events-auto md:hidden">
            <AthleteProfileHud left={leftMetrics} right={rightMetrics} />
          </div>
        </div>

        <div className="pointer-events-auto mx-auto mt-auto flex w-full justify-center pb-1 pt-2">
          {children}
        </div>
      </div>
    </div>
  );
}

export { IMMERSIVE_OVERLAY_CARD };
