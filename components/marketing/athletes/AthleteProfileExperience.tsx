"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Activity, Footprints, Heart, Moon, Zap } from "lucide-react";
import {
  type AthleteWearableVital,
  type FeaturedAthlete,
  formatFeaturedSport,
  getFeaturedAthleteName,
} from "@/lib/marketing/featured-athletes";
import { SectionBackLink } from "@/components/marketing/SectionBackLink";
import { AthleteHologram } from "@/components/marketing/athletes/AthleteHologram";
import { LANDING_SECTIONS } from "@/lib/marketing/landing-sections";

type ProfileMetric = {
  id: string;
  label: string;
  value: string;
  unit?: string;
  animation?: AthleteWearableVital["animation"];
};

function buildProfileMetrics(athlete: FeaturedAthlete): ProfileMetric[] {
  const performance: ProfileMetric[] = athlete.floatingMetrics.map((metric) => ({
    id: metric.id,
    label: metric.label,
    value: metric.value,
  }));

  const wearable: ProfileMetric[] = athlete.wearableVitals.map((vital) => ({
    id: vital.id,
    label: vital.label,
    value: vital.value,
    unit: vital.unit,
    animation: vital.animation,
  }));

  return [...performance, ...wearable];
}

function splitMetricColumns(metrics: ProfileMetric[]) {
  const midpoint = Math.ceil(metrics.length / 2);
  return {
    left: metrics.slice(0, midpoint),
    right: metrics.slice(midpoint),
  };
}

function MetricMotionIcon({
  animation,
}: {
  animation?: AthleteWearableVital["animation"];
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
    return <Moon className="h-4 w-4 shrink-0 animate-pulse text-orange/80" aria-hidden />;
  }

  if (animation === "wave") {
    return <Activity className="legacy-animate-wave h-4 w-4 shrink-0 text-orange" aria-hidden />;
  }

  if (animation === "step") {
    return <Footprints className="legacy-animate-step h-4 w-4 shrink-0 text-orange" aria-hidden />;
  }

  return <Zap className="h-4 w-4 shrink-0 text-orange/70" aria-hidden />;
}

function MetricCell({
  metric,
  align = "left",
}: {
  metric: ProfileMetric;
  align?: "left" | "right";
}) {
  return (
    <div className="grid gap-1.5 border-b border-bone/70 py-3 last:border-b-0 md:py-3.5">
      <div
        className={`grid items-center gap-2 ${
          align === "right"
            ? "grid-cols-[1fr_auto] md:justify-items-end"
            : "grid-cols-[auto_1fr]"
        }`}
      >
        {align === "right" ? (
          <>
            <p className="text-[10px] font-bold uppercase leading-tight tracking-[0.1em] text-smoke md:text-[11px]">
              {metric.label}
            </p>
            <MetricMotionIcon animation={metric.animation} />
          </>
        ) : (
          <>
            <MetricMotionIcon animation={metric.animation} />
            <p className="text-[10px] font-bold uppercase leading-tight tracking-[0.1em] text-smoke md:text-[11px]">
              {metric.label}
            </p>
          </>
        )}
      </div>
      <p className="text-[clamp(20px,2vw,28px)] font-extrabold leading-none tracking-[-0.03em] text-pitch">
        {metric.value}
        {metric.unit ? (
          <span className="ml-1.5 text-sm font-semibold text-slate">{metric.unit}</span>
        ) : null}
      </p>
    </div>
  );
}

function MetricColumn({
  metrics,
  align,
}: {
  metrics: ProfileMetric[];
  align: "left" | "right";
}) {
  return (
    <div
      className={`grid w-full max-w-[172px] content-center xl:max-w-[188px] ${align === "right" ? "md:text-right" : "md:text-left"}`}
    >
      {metrics.map((metric) => (
        <MetricCell key={metric.id} metric={metric} align={align} />
      ))}
    </div>
  );
}

export function AthleteProfileExperience({ athlete }: { athlete: FeaturedAthlete }) {
  const fullName = getFeaturedAthleteName(athlete);
  const { left: leftMetrics, right: rightMetrics } = useMemo(() => {
    return splitMetricColumns(buildProfileMetrics(athlete));
  }, [athlete]);

  return (
    <section className="relative isolate min-h-[120svh] w-full overflow-x-hidden bg-field text-pitch">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div className="absolute inset-x-[8%] bottom-0 h-[42%] translate-y-[18%] rounded-[999px] bg-gradient-to-t from-orange/40 via-orange/14 to-transparent blur-2xl" />
        <div
          className="absolute inset-x-0 bottom-0 h-[46%] translate-y-[12%]"
          style={{
            background:
              "radial-gradient(ellipse 78% 95% at 50% 100%, rgba(255,90,31,0.34) 0%, rgba(255,90,31,0.12) 38%, transparent 62%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-field/88 via-field/18 to-field/78" />
        <div className="absolute inset-0 bg-gradient-to-r from-field/78 via-transparent to-field/78" />
      </div>

      <AthleteHologram gender={athlete.gender} variant="immersive" />

      <div className="pointer-events-none relative z-10 flex min-h-[120svh] flex-col pt-14 pb-12 md:pt-[68px] md:pb-16">
        <div className="flex flex-1 flex-col gap-4 p-[var(--legacy-gutter)] md:gap-6">
          <div className="pointer-events-auto flex w-full items-start justify-between gap-4">
            <div className="max-w-xl min-w-0 flex-1">
              <SectionBackLink
                href={LANDING_SECTIONS.athletes}
                className="text-sm text-coal transition-colors hover:text-orange"
              >
                Back
              </SectionBackLink>
              <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-orange">
                [ Success Story ]
              </p>
              <h1 className="mt-2 text-[clamp(32px,5vw,52px)] font-extrabold leading-[1.02] tracking-[-0.03em] text-pitch">
                {fullName}
              </h1>
              <p className="mt-2 text-base font-semibold text-orange">
                {formatFeaturedSport(athlete.sport)}
              </p>
              <p className="text-base text-slate">{athlete.school}</p>
            </div>

            <div className="relative h-[156px] w-[124px] shrink-0 overflow-hidden rounded-[14px] border-2 border-bone/80 bg-chalk shadow-[0_12px_40px_rgba(17,17,17,0.12)] md:h-[220px] md:w-[176px] md:rounded-[16px]">
              <Image
                src={athlete.photo_url}
                alt={`Portrait of ${fullName}`}
                fill
                sizes="(min-width: 768px) 176px, 124px"
                className="object-cover"
                priority
              />
              <div
                aria-hidden
                className="pointer-events-none absolute bottom-0 right-0 h-[46%] w-[46%] rounded-br-[14px] md:rounded-br-[16px]"
                style={{
                  backgroundImage: [
                    "repeating-linear-gradient(45deg, rgba(17,17,17,0.16) 0 1px, transparent 1px 7px)",
                    "repeating-linear-gradient(-45deg, rgba(17,17,17,0.16) 0 1px, transparent 1px 7px)",
                    "linear-gradient(135deg, rgba(255,90,31,0.22) 0%, rgba(255,90,31,0.08) 100%)",
                  ].join(", "),
                  maskImage:
                    "linear-gradient(135deg, transparent 4%, rgba(0,0,0,0.45) 36%, black 68%)",
                  WebkitMaskImage:
                    "linear-gradient(135deg, transparent 4%, rgba(0,0,0,0.45) 36%, black 68%)",
                }}
              />
            </div>
          </div>

          <div className="relative z-20 flex flex-1 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="pointer-events-auto hidden max-w-[220px] rounded-[14px] border border-bone/80 bg-field/82 p-4 backdrop-blur-md md:block">
              <MetricColumn metrics={leftMetrics} align="left" />
            </div>

            <div className="hidden min-w-0 flex-1 lg:block" aria-hidden />

            <div className="pointer-events-auto hidden max-w-[220px] rounded-[14px] border border-bone/80 bg-field/82 p-4 backdrop-blur-md md:block">
              <MetricColumn metrics={rightMetrics} align="right" />
            </div>
          </div>

          <div className="pointer-events-auto max-w-[420px] rounded-[16px] border border-bone/80 bg-field/82 p-4 backdrop-blur-md md:p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange">
              Athlete story
            </p>
            <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-slate md:line-clamp-none md:text-[15px] md:leading-[1.75]">
              {athlete.story}
            </p>
          </div>

          <div className="pointer-events-auto rounded-[14px] border border-bone/80 bg-field/82 p-4 backdrop-blur-md md:hidden">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange">
              Performance metrics
            </p>
            <div className="mt-3 grid grid-cols-2 gap-x-4">
              {[...leftMetrics, ...rightMetrics].map((metric) => (
                <MetricCell key={metric.id} metric={metric} />
              ))}
            </div>
          </div>

          <p className="pointer-events-none text-right text-[10px] leading-snug text-smoke md:text-[11px]">
            Sample wearable and performance data shown for demonstration. Live athlete feeds
            sync through Legacy Command during enrollment.
          </p>
        </div>
      </div>
    </section>
  );
}
