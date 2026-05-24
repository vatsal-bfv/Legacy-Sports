"use client";

import { useMemo } from "react";
import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BadgeCheck, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Athlete, Measurable, VideoClip } from "@/lib/demo/types";
import {
  buildMeasurableSeries,
  computePercentileBadges,
  getProvenanceInfo,
  metricsWithHistory,
  scoutBrief,
  trendYDomain,
} from "@/lib/scout/profile-helpers";
import { demoStore } from "@/lib/demo/store";
import {
  ScoutCard,
  ScoutSectionLabel,
} from "@/components/scout/ScoutCard";
import { SectionTexture } from "@/components/marketing/landing/SectionTexture";

const METRIC_DISPLAY: Record<
  string,
  { title: string; color: string; format: (v: number) => string }
> = {
  forty_yard: {
    title: "40-yard dash",
    color: "#FF5A1F",
    format: (v) => `${v.toFixed(2)}s`,
  },
  vertical: {
    title: "Vertical jump",
    color: "#111111",
    format: (v) => `${v}"`,
  },
  squat_max: {
    title: "Squat max",
    color: "#4A4744",
    format: (v) => `${v} lbs`,
  },
  bench_max: {
    title: "Bench max",
    color: "#4A4744",
    format: (v) => `${v} lbs`,
  },
  broad_jump: {
    title: "Broad jump",
    color: "#FF5A1F",
    format: (v) => `${v}"`,
  },
  ten_yard_split: {
    title: "10-yard split",
    color: "#FF5A1F",
    format: (v) => `${v.toFixed(2)}s`,
  },
  weight: {
    title: "Weight",
    color: "#8C8880",
    format: (v) => `${v} lbs`,
  },
};

function ProgressionChart({
  metric,
  measurables,
}: {
  metric: string;
  measurables: Measurable[];
}) {
  const config = METRIC_DISPLAY[metric] ?? {
    title: metric.replace(/_/g, " "),
    color: "#111111",
    format: (v: number) => String(v),
  };
  const data = useMemo(
    () => buildMeasurableSeries(measurables, metric),
    [measurables, metric]
  );
  const domain = useMemo(
    () =>
      trendYDomain(
        data.map((d) => d.value),
        metric === "forty_yard" ? 0.25 : 0.12
      ),
    [data, metric]
  );

  if (data.length < 2) return null;

  return (
    <ScoutCard>
      <div className="border-b border-bone px-5 py-4">
        <h3 className="font-semibold capitalize text-pitch">{config.title}</h3>
        <p className="text-xs text-smoke">
          Verified progression · Legacy network
        </p>
      </div>
      <div className="px-2 pb-4 pt-2">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E2DB" />
            <XAxis dataKey="label" stroke="#8C8880" fontSize={12} />
            <YAxis
              stroke="#8C8880"
              fontSize={12}
              domain={domain}
              tickFormatter={(v) => config.format(Number(v))}
              width={48}
            />
            <Tooltip
              contentStyle={{
                background: "#F0EEE9",
                border: "1px solid #E5E2DB",
                borderRadius: 8,
              }}
              formatter={(value) => [config.format(Number(value)), config.title]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={config.color}
              strokeWidth={2}
              dot={{ r: 4, fill: config.color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ScoutCard>
  );
}

function VideoClipCard({ clip }: { clip: VideoClip }) {
  return (
    <ScoutCard className="overflow-hidden">
      <div className="relative aspect-video bg-bone">
        <video
          className="h-full w-full object-cover"
          poster={clip.thumbnail_url}
          controls
          preload="metadata"
        >
          <source src={clip.video_url} type="video/mp4" />
        </video>
      </div>
      <div className="p-4">
        <p className="font-semibold text-pitch">{clip.title}</p>
        <p className="mt-1 text-xs text-smoke">
          {new Date(clip.recorded_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {clip.ai_tags.map((t) => (
            <span
              key={t}
              className="rounded bg-orange/10 px-2 py-0.5 text-xs text-orange"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </ScoutCard>
  );
}

export function ScoutAthleteProfile({
  athlete,
  measurables,
  videos,
}: {
  athlete: Athlete;
  measurables: Measurable[];
  videos: VideoClip[];
}) {
  const program = demoStore.programs.find((p) => p.id === athlete.program_id);
  const provenance = getProvenanceInfo(
    athlete,
    measurables,
    demoStore.locations,
    demoStore.coaches
  );
  const percentileBadges = computePercentileBadges(
    athlete,
    demoStore.athletes,
    demoStore.measurables
  );
  const historyMetrics = metricsWithHistory(measurables);
  const chartMetrics = useMemo(() => {
    const priority = [
      "forty_yard",
      "vertical",
      "ten_yard_split",
      "broad_jump",
      "squat_max",
      "bench_max",
      "weight",
    ];
    return [
      ...priority.filter((m) => historyMetrics.includes(m)),
      ...historyMetrics.filter((m) => !priority.includes(m)),
    ];
  }, [historyMetrics]);
  const prMeasurables = measurables.filter((m) => m.is_pr);
  const brief = scoutBrief(athlete);

  return (
    <div className="relative px-[var(--legacy-gutter)] py-[clamp(48px,8vw,80px)]">
      <SectionTexture pattern="dots" tone="light" />

      <p className="pointer-events-none absolute right-[var(--legacy-gutter)] top-[clamp(48px,8vw,80px)] rotate-12 text-[10px] font-bold uppercase tracking-[0.12em] text-smoke opacity-40">
        Licensed · Legacy Sports Complex
      </p>

      <div className="relative mx-auto max-w-5xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <Image
            src={athlete.photo_url}
            alt=""
            width={160}
            height={160}
            className="shrink-0 rounded-[14px] border border-bone shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
          />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="scout">Legacy Verified</Badge>
              <Badge className="capitalize bg-bone text-slate">
                {athlete.recruit_status}
              </Badge>
            </div>
            <h1 className="mt-3 text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-pitch">
              {athlete.first_name} {athlete.last_name}
            </h1>
            <p className="mt-2 text-slate">
              {athlete.school} · Class of {athlete.graduation_year} · GPA{" "}
              {athlete.gpa}
            </p>
            <p className="mt-1 capitalize text-smoke">
              {athlete.sport}
              {athlete.position ? ` · ${athlete.position}` : ""}
              {program ? ` · ${program.name}` : ""}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[14px] border border-bone bg-chalk px-4 py-3 text-sm text-slate">
              <span className="inline-flex items-center gap-1.5 font-semibold text-pitch">
                <BadgeCheck className="h-4 w-4 shrink-0 text-orange" />
                Tested at Legacy {provenance.locationName}
              </span>
              {provenance.coachName && (
                <span>
                  Coach-recorded · {provenance.coachName}
                </span>
              )}
              <span>Last verified {provenance.lastVerified}</span>
            </div>

            {percentileBadges.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {percentileBadges.map((b) => (
                  <span
                    key={`${b.label}-${b.metric}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-orange/20 bg-orange/10 px-3 py-1 text-xs font-semibold text-orange"
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                    {b.label} · {b.metric}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <ScoutCard>
              <div className="border-b border-bone px-5 py-4">
                <ScoutSectionLabel>AI Scout Brief</ScoutSectionLabel>
                <p className="mt-2 text-xs text-smoke">
                  Generated from verified measurables and training history
                </p>
              </div>
              <div className="px-5 py-5">
                <p className="leading-relaxed text-slate">{brief}</p>
              </div>
            </ScoutCard>

            {prMeasurables.length > 0 && (
              <section>
                <h2 className="text-lg font-extrabold tracking-[-0.02em] text-pitch">
                  Personal records
                </h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {prMeasurables.map((m) => (
                    <ScoutCard
                      key={m.id}
                      className="min-w-[120px] px-4 py-3"
                    >
                      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-smoke">
                        {m.metric.replace(/_/g, " ")}
                      </p>
                      <p className="legacy-display mt-1 text-2xl uppercase text-pitch">
                        {m.value} {m.unit}
                      </p>
                    </ScoutCard>
                  ))}
                </div>
              </section>
            )}

            {historyMetrics.length > 0 && (
              <section>
                <h2 className="text-lg font-extrabold tracking-[-0.02em] text-pitch">
                  Performance progression
                </h2>
                <p className="mt-1 text-sm text-slate">
                  Longitudinal data collected at Legacy facilities — not
                  self-reported
                </p>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  {chartMetrics.map((metric) => (
                    <ProgressionChart
                      key={metric}
                      metric={metric}
                      measurables={measurables}
                    />
                  ))}
                </div>
              </section>
            )}

            {videos.length > 0 && (
              <section>
                <h2 className="text-lg font-extrabold tracking-[-0.02em] text-pitch">
                  Verified video
                </h2>
                <p className="mt-1 text-sm text-slate">
                  Training footage with AI-tagged movement analysis
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {videos.map((v) => (
                    <VideoClipCard key={v.id} clip={v} />
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-4">
            <ScoutCard className="p-5">
              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
                <div>
                  <p className="font-semibold text-pitch">Licensed data only</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate">
                    Coach notes, billing, parent contact, and internal
                    communications are not shared with licensed partners.
                  </p>
                </div>
              </div>
            </ScoutCard>

            <ScoutCard className="p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate">
                Quick actions
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Button variant="scout" className="h-12 w-full">
                  Save to my list
                </Button>
                <Button
                  variant="outline"
                  className="h-12 w-full border-bone bg-field text-pitch hover:border-orange hover:bg-chalk hover:text-pitch"
                >
                  Request introduction
                </Button>
              </div>
            </ScoutCard>
          </aside>
        </div>
      </div>
    </div>
  );
}
