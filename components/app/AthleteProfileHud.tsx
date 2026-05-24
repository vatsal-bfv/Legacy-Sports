"use client";

import { Activity, Heart, Moon, Zap } from "lucide-react";
import type { Measurable, WearableData } from "@/lib/demo/types";
import { cn } from "@/lib/utils";

export type HudMetric = {
  id: string;
  label: string;
  value: string;
  unit?: string;
  animation?: "heart" | "pulse" | "wave";
};

function latestMeasurable(measurables: Measurable[], metric: string) {
  return measurables
    .filter((m) => m.metric === metric)
    .sort((a, b) => a.recorded_at.localeCompare(b.recorded_at))
    .slice(-1)[0];
}

function latestWearable(wearables: WearableData[], metric: string) {
  return wearables
    .filter((w) => w.metric === metric)
    .sort((a, b) => a.recorded_at.localeCompare(b.recorded_at))
    .slice(-1)[0];
}

export function buildAthleteHudColumns(
  measurables: Measurable[],
  wearables: WearableData[],
  attendedCount: number
): { left: HudMetric[]; right: HudMetric[] } {
  const left: HudMetric[] = [];
  const right: HudMetric[] = [];

  const vertical = latestMeasurable(measurables, "vertical");
  if (vertical) {
    left.push({
      id: "vertical",
      label: "Vertical",
      value: String(vertical.value),
      unit: '"',
    });
  }

  const forty = latestMeasurable(measurables, "forty_yard");
  if (forty) {
    left.push({
      id: "forty",
      label: "40-yard",
      value: forty.value.toFixed(2),
      unit: "s",
    });
  }

  const broad = latestMeasurable(measurables, "broad_jump");
  if (broad) {
    left.push({
      id: "broad",
      label: "Broad jump",
      value: String(broad.value),
      unit: broad.unit,
    });
  }

  const recovery = latestWearable(wearables, "recovery_score");
  if (recovery) {
    left.push({
      id: "recovery",
      label: "Recovery",
      value: recovery.value.toFixed(0),
      unit: "%",
      animation: "heart",
    });
  }

  const sleep = latestWearable(wearables, "sleep_hours");
  if (sleep) {
    right.push({
      id: "sleep",
      label: "Sleep",
      value: sleep.value.toFixed(1),
      unit: "h",
      animation: "pulse",
    });
  }

  const strain = latestWearable(wearables, "strain");
  if (strain) {
    right.push({
      id: "strain",
      label: "Strain",
      value: strain.value.toFixed(1),
      animation: "wave",
    });
  }

  right.push({
    id: "attendance",
    label: "Sessions",
    value: String(attendedCount),
    unit: "90d",
  });

  return { left, right };
}

/** @deprecated Use buildAthleteHudColumns */
export function buildAthleteHudMetrics(
  measurables: Measurable[],
  wearables: WearableData[],
  attendedCount: number
): HudMetric[] {
  const { left, right } = buildAthleteHudColumns(
    measurables,
    wearables,
    attendedCount
  );
  return [...left, ...right];
}

function MetricMotionIcon({
  animation,
}: {
  animation?: HudMetric["animation"];
}) {
  if (animation === "heart") {
    return (
      <Heart
        className="legacy-animate-heartbeat h-4 w-4 shrink-0 text-orange"
        aria-hidden
        fill="currentColor"
        strokeWidth={0}
      />
    );
  }

  if (animation === "pulse") {
    return (
      <Moon className="h-4 w-4 shrink-0 animate-pulse text-orange/80" aria-hidden />
    );
  }

  if (animation === "wave") {
    return (
      <Activity className="legacy-animate-wave h-4 w-4 shrink-0 text-orange" aria-hidden />
    );
  }

  return <Zap className="h-4 w-4 shrink-0 text-orange/70" aria-hidden />;
}

function MetricCell({
  metric,
  align = "left",
}: {
  metric: HudMetric;
  align?: "left" | "right";
}) {
  return (
    <div className="grid gap-1 border-b border-bone/70 py-2.5 last:border-b-0">
      <div
        className={`grid items-center gap-2 ${
          align === "right"
            ? "grid-cols-[1fr_auto] md:justify-items-end"
            : "grid-cols-[auto_1fr]"
        }`}
      >
        {align === "right" ? (
          <>
            <p className="text-[10px] font-bold uppercase leading-tight tracking-[0.1em] text-smoke">
              {metric.label}
            </p>
            <MetricMotionIcon animation={metric.animation} />
          </>
        ) : (
          <>
            <MetricMotionIcon animation={metric.animation} />
            <p className="text-[10px] font-bold uppercase leading-tight tracking-[0.1em] text-smoke">
              {metric.label}
            </p>
          </>
        )}
      </div>
      <p className="text-xl font-extrabold leading-none tracking-[-0.03em] text-pitch">
        {metric.value}
        {metric.unit ? (
          <span className="ml-1 text-xs font-semibold text-slate">{metric.unit}</span>
        ) : null}
      </p>
    </div>
  );
}

function MetricColumn({
  metrics,
  align,
}: {
  metrics: HudMetric[];
  align: "left" | "right";
}) {
  if (metrics.length === 0) return null;

  return (
    <div
      className={`grid w-full content-center ${align === "right" ? "md:text-right" : "md:text-left"}`}
    >
      {metrics.map((metric) => (
        <MetricCell key={metric.id} metric={metric} align={align} />
      ))}
    </div>
  );
}

const HUD_PANEL_CLASS =
  "rounded-[14px] border border-bone/80 bg-field/90 p-3 shadow-[0_8px_32px_rgba(17,17,17,0.08)] backdrop-blur-md";

export function AthleteProfileHudPanel({
  metrics,
  side,
  className,
}: {
  metrics: HudMetric[];
  side: "left" | "right";
  className?: string;
}) {
  if (metrics.length === 0) return null;

  return (
    <div className={cn(HUD_PANEL_CLASS, className)}>
      <MetricColumn metrics={metrics} align={side} />
    </div>
  );
}

export function AthleteProfileHud({
  left,
  right,
}: {
  left: HudMetric[];
  right: HudMetric[];
}) {
  const metrics = [...left, ...right];
  if (metrics.length === 0) return null;

  return (
    <div className={cn(HUD_PANEL_CLASS, "pointer-events-auto")}>
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange">
        Live metrics
      </p>
      <div className="mt-2 grid grid-cols-2 gap-x-3">
        {metrics.map((metric) => (
          <MetricCell key={metric.id} metric={metric} />
        ))}
      </div>
    </div>
  );
}

export function athleteHologramGender(gender: string): "male" | "female" {
  return gender === "female" ? "female" : "male";
}

export const IMMERSIVE_OVERLAY_CARD =
  "border-bone/80 bg-field/94 shadow-[0_8px_32px_rgba(17,17,17,0.1)] backdrop-blur-md";

export function ImmersiveBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-xl"
    >
      <div className="absolute inset-x-[10%] bottom-0 h-[40%] translate-y-[14%] rounded-[999px] bg-gradient-to-t from-orange/32 via-orange/11 to-transparent blur-2xl" />
      <div
        className="absolute inset-x-0 bottom-0 h-[44%] translate-y-[10%]"
        style={{
          background:
            "radial-gradient(ellipse 70% 95% at 50% 100%, rgba(255,90,31,0.26) 0%, rgba(255,90,31,0.09) 40%, transparent 64%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-field/93 via-field/22 to-field/89" />
      <div className="absolute inset-0 bg-gradient-to-r from-field/84 via-transparent to-field/84" />
    </div>
  );
}