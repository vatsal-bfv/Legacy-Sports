"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Activity, Footprints, Heart, Moon, Zap } from "lucide-react";
import { gsap } from "@/lib/gsap";
import {
  type AthleteWearableVital,
  type FeaturedAthlete,
  formatFeaturedSport,
  getFeaturedAthleteName,
} from "@/lib/marketing/featured-athletes";
import { AthleteHologram } from "@/components/marketing/athletes/AthleteHologram";
import { SectionTexture } from "@/components/marketing/landing/SectionTexture";

type OrbitMetric = {
  id: string;
  label: string;
  value: string;
  unit?: string;
  x: number;
  y: number;
  animation?: AthleteWearableVital["animation"];
  kind: "performance" | "wearable";
};

function buildOrbitMetrics(athlete: FeaturedAthlete): OrbitMetric[] {
  const performance: OrbitMetric[] = athlete.floatingMetrics.map((metric) => ({
    id: metric.id,
    label: metric.label,
    value: metric.value,
    x: metric.x,
    y: metric.y,
    kind: "performance",
  }));

  const wearable: OrbitMetric[] = athlete.wearableVitals.map((vital) => ({
    id: vital.id,
    label: vital.label,
    value: vital.value,
    unit: vital.unit,
    x: vital.x,
    y: vital.y,
    animation: vital.animation,
    kind: "wearable",
  }));

  return [...performance, ...wearable];
}

function MetricMotionIcon({
  animation,
}: {
  animation?: AthleteWearableVital["animation"];
}) {
  if (animation === "heart") {
    return (
      <Heart
        className="legacy-animate-heartbeat h-5 w-5 text-orange"
        aria-hidden
        fill="currentColor"
        strokeWidth={0}
      />
    );
  }

  if (animation === "pulse") {
    return <Moon className="h-5 w-5 animate-pulse text-orange/80" aria-hidden />;
  }

  if (animation === "wave") {
    return <Activity className="legacy-animate-wave h-5 w-5 text-orange" aria-hidden />;
  }

  if (animation === "step") {
    return <Footprints className="legacy-animate-step h-5 w-5 text-orange" aria-hidden />;
  }

  return <Zap className="h-4 w-4 text-orange/70" aria-hidden />;
}

function OrbitMetric({
  metric,
  reducedMotion,
}: {
  metric: OrbitMetric;
  reducedMotion: boolean;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node || reducedMotion) {
      return;
    }

    const tween = gsap.to(node, {
      y: "+=8",
      duration: 2.4 + (metric.x % 4) * 0.2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: (metric.y % 6) * 0.1,
    });

    return () => {
      tween.kill();
    };
  }, [metric.x, metric.y, reducedMotion]);

  return (
    <div
      ref={nodeRef}
      className="pointer-events-none absolute z-20 max-w-[150px] -translate-x-1/2 -translate-y-1/2 text-left md:max-w-[180px]"
      style={{ left: `${metric.x}%`, top: `${metric.y}%` }}
    >
      <div className="flex items-center gap-2">
        {metric.animation ? <MetricMotionIcon animation={metric.animation} /> : null}
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-smoke">
          {metric.label}
        </p>
      </div>
      <p className="mt-1 text-[clamp(22px,2.4vw,32px)] font-extrabold leading-none tracking-[-0.03em] text-pitch">
        {metric.value}
        {metric.unit ? (
          <span className="ml-1.5 text-sm font-semibold text-slate">{metric.unit}</span>
        ) : null}
      </p>
    </div>
  );
}

export function AthleteProfileExperience({ athlete }: { athlete: FeaturedAthlete }) {
  const fullName = getFeaturedAthleteName(athlete);
  const orbitMetrics = useMemo(() => buildOrbitMetrics(athlete), [athlete]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);

    function onChange(event: MediaQueryListEvent) {
      setReducedMotion(event.matches);
    }

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="relative h-[100svh] overflow-hidden bg-field text-pitch">
      <SectionTexture pattern="dots" tone="light" />

      <div className="relative z-10 grid h-full grid-cols-1 pt-14 md:grid-cols-[30%_70%] md:pt-[68px]">
        <aside className="flex min-h-0 flex-col gap-5 overflow-y-auto px-[var(--legacy-gutter)] py-5 md:py-6 md:pr-6">
          <Link
            href="/athletes"
            data-cursor="link"
            className="text-sm text-coal transition-colors hover:text-orange"
          >
            All success stories
          </Link>

          <div className="relative aspect-[4/5] w-full max-w-[280px] overflow-hidden">
            <Image
              src={athlete.photo_url}
              alt={`Portrait of ${fullName}, a Legacy athlete`}
              fill
              sizes="(min-width: 768px) 30vw, 280px"
              className="object-cover"
              priority
            />
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-orange">
              [ Success Story ]
            </p>
            <h1 className="mt-3 text-[clamp(28px,3.2vw,40px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-pitch">
              {fullName}
            </h1>
            <p className="mt-2 text-base font-semibold text-orange">
              {formatFeaturedSport(athlete.sport)}
            </p>
            <p className="text-base text-slate">{athlete.school}</p>
          </div>

          <p className="text-[15px] leading-[1.75] text-slate md:line-clamp-[8] lg:line-clamp-none">
            {athlete.story}
          </p>
        </aside>

        <div className="relative min-h-[50svh] min-w-0 md:min-h-0">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 55% 50% at 50% 48%, rgba(255,90,31,0.07), transparent 72%)",
            }}
          />

          <div className="relative h-full min-h-[50svh] md:min-h-0">
            <div className="absolute inset-0 z-0">
              <AthleteHologram />
            </div>

            {orbitMetrics.map((metric) => (
              <OrbitMetric
                key={metric.id}
                metric={metric}
                reducedMotion={reducedMotion}
              />
            ))}

            <p className="absolute bottom-3 right-4 z-20 max-w-[280px] text-right text-[10px] leading-snug text-smoke md:bottom-4 md:text-[11px]">
              Sample wearable and performance data shown for demonstration. Live athlete
              feeds sync through Legacy Command during enrollment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
