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
    color: "#3B82F6",
    format: (v) => `${v}"`,
  },
  squat_max: {
    title: "Squat max",
    color: "#1A2332",
    format: (v) => `${v} lbs`,
  },
  bench_max: {
    title: "Bench max",
    color: "#1A2332",
    format: (v) => `${v} lbs`,
  },
};

function ScoutCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function ProgressionChart({
  metric,
  measurables,
}: {
  metric: string;
  measurables: Measurable[];
}) {
  const config = METRIC_DISPLAY[metric] ?? {
    title: metric.replace(/_/g, " "),
    color: "#1A2332",
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
      <div className="border-b border-gray-100 px-5 py-4">
        <h3 className="font-semibold capitalize">{config.title}</h3>
        <p className="text-xs text-gray-500">Verified progression · Legacy network</p>
      </div>
      <div className="px-2 pb-4 pt-2">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="label" stroke="#6B7280" fontSize={12} />
            <YAxis
              stroke="#6B7280"
              fontSize={12}
              domain={domain}
              tickFormatter={(v) => config.format(Number(v))}
              width={48}
            />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #E5E7EB",
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
      <div className="relative aspect-video bg-gray-100">
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
        <p className="font-medium">{clip.title}</p>
        <p className="mt-1 text-xs text-gray-500">
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
              className="rounded bg-[#1A2332]/10 px-2 py-0.5 text-xs text-[#1A2332]"
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
  const prMeasurables = measurables.filter((m) => m.is_pr);
  const brief = scoutBrief(athlete);

  return (
    <div className="relative mx-auto max-w-5xl px-6 py-12">
      <p className="pointer-events-none absolute right-6 top-6 rotate-12 text-xs text-gray-400 opacity-50">
        Data licensed from Legacy Sports Complex
      </p>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <Image
          src={athlete.photo_url}
          alt=""
          width={160}
          height={160}
          className="shrink-0 rounded-xl border border-gray-200 shadow-sm"
        />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="scout">Legacy Verified</Badge>
            <Badge className="capitalize bg-blue-50 text-blue-700">
              {athlete.recruit_status}
            </Badge>
          </div>
          <h1 className="mt-3 text-3xl font-bold">
            {athlete.first_name} {athlete.last_name}
          </h1>
          <p className="mt-1 text-gray-600">
            {athlete.school} · Class of {athlete.graduation_year} · GPA{" "}
            {athlete.gpa}
          </p>
          <p className="mt-1 capitalize text-gray-500">
            {athlete.sport}
            {athlete.position ? ` · ${athlete.position}` : ""}
            {program ? ` · ${program.name}` : ""}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-[#1A2332]/15 bg-[#1A2332]/5 px-4 py-3 text-sm text-[#1A2332]">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <BadgeCheck className="h-4 w-4 shrink-0" />
              Tested at Legacy {provenance.locationName}
            </span>
            {provenance.coachName && (
              <span className="text-gray-600">
                Coach-recorded · {provenance.coachName}
              </span>
            )}
            <span className="text-gray-600">
              Last verified {provenance.lastVerified}
            </span>
          </div>

          {percentileBadges.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {percentileBadges.map((b) => (
                <span
                  key={`${b.label}-${b.metric}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800"
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  {b.label} · {b.metric}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <ScoutCard>
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-lg font-semibold">AI scout brief</h2>
              <p className="text-xs text-gray-500">
                Generated from verified measurables and training history
              </p>
            </div>
            <div className="px-5 py-4">
              <p className="leading-relaxed text-gray-700">{brief}</p>
            </div>
          </ScoutCard>

          {prMeasurables.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold">Personal records</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {prMeasurables.map((m) => (
                  <div
                    key={m.id}
                    className="min-w-[120px] rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm"
                  >
                    <p className="text-xs capitalize text-gray-500">
                      {m.metric.replace(/_/g, " ")}
                    </p>
                    <p className="text-xl font-bold">
                      {m.value} {m.unit}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {historyMetrics.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold">Performance progression</h2>
              <p className="mt-1 text-sm text-gray-500">
                Longitudinal data collected at Legacy facilities — not
                self-reported
              </p>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {historyMetrics.map((metric) => (
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
              <h2 className="text-lg font-semibold">Verified video</h2>
              <p className="mt-1 text-sm text-gray-500">
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
              <Shield className="mt-0.5 h-5 w-5 shrink-0 text-[#1A2332]" />
              <div>
                <p className="font-medium text-[#1A2332]">Licensed data only</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Coach notes, billing, parent contact, and internal
                  communications are not shared with licensed partners.
                </p>
              </div>
            </div>
          </ScoutCard>

          <ScoutCard className="p-5">
            <p className="text-sm font-medium text-gray-900">Quick actions</p>
            <div className="mt-4 flex flex-col gap-2">
              <Button variant="scout" className="w-full">
                Save to my list
              </Button>
              <Button
                variant="outline"
                className="w-full border-gray-300 text-gray-900"
              >
                Request introduction
              </Button>
            </div>
          </ScoutCard>
        </aside>
      </div>
    </div>
  );
}
