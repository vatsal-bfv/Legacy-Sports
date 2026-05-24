import { HERO_IDS } from "@/lib/constants";
import type { Athlete, Coach, Location, Measurable } from "@/lib/demo/types";

export type ChartPoint = { label: string; value: number };

export type PercentileBadge = {
  label: string;
  metric: string;
};

export type ProvenanceInfo = {
  locationName: string;
  coachName: string | null;
  lastVerified: string;
};

const METRIC_LABELS: Record<string, string> = {
  forty_yard: "40-yard dash",
  vertical: "vertical jump",
  squat_max: "squat max",
  bench_max: "bench max",
  broad_jump: "broad jump",
  ten_yard_split: "10-yard split",
};

const HIGHLIGHT_METRICS: {
  metric: string;
  format: (v: number) => string;
}[] = [
  { metric: "forty_yard", format: (v) => `40: ${v.toFixed(2)}s` },
  { metric: "vertical", format: (v) => `Vert: ${v}"` },
  { metric: "squat_max", format: (v) => `Squat: ${v} lbs` },
  { metric: "bench_max", format: (v) => `Bench: ${v} lbs` },
  { metric: "broad_jump", format: (v) => `Broad: ${v}"` },
  { metric: "ten_yard_split", format: (v) => `10-yd: ${v.toFixed(2)}s` },
];

export function getAthleteHighlightMetrics(
  athleteId: string,
  allMeasurables: Measurable[],
  max = 3
): string[] {
  const athleteMeasurables = allMeasurables.filter(
    (m) => m.athlete_id === athleteId && m.is_pr
  );
  const highlights: string[] = [];

  for (const { metric, format } of HIGHLIGHT_METRICS) {
    const pr = athleteMeasurables.find((m) => m.metric === metric);
    if (pr) highlights.push(format(pr.value));
    if (highlights.length >= max) break;
  }

  return highlights;
}

/** Demo-stable percentile badges when cohort data is too sparse. */
const HERO_PERCENTILE_BADGES: Record<string, PercentileBadge[]> = {
  [HERO_IDS.marcus]: [
    { label: "Top 5%", metric: "40-yard dash among 2027 QBs" },
    { label: "Top 5%", metric: "Vertical jump among 2027 QBs" },
  ],
  [HERO_IDS.deshawn]: [
    { label: "Top 10%", metric: "Improvement rate among 2026 WRs" },
  ],
  [HERO_IDS.sofia]: [
    { label: "Top 3%", metric: "GPA among multi-sport athletes" },
    { label: "Top 10%", metric: "Vertical jump among 2029 athletes" },
  ],
  [HERO_IDS.tyler]: [
    { label: "Top 15%", metric: "Squat max among 2028 point guards" },
  ],
};

export function trendYDomain(
  values: number[],
  paddingRatio = 0.12
): [number, number] {
  if (values.length === 0) return [0, 1];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min;
  const pad =
    span === 0
      ? Math.max(Math.abs(min) * 0.08, min * 0.05 || 1)
      : span * paddingRatio;
  return [min - pad, max + pad];
}

export function buildMeasurableSeries(
  measurables: Measurable[],
  metric: string
): ChartPoint[] {
  return measurables
    .filter((m) => m.metric === metric)
    .sort(
      (a, b) =>
        new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
    )
    .map((m) => ({
      label: new Date(m.recorded_at).toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
      value: m.value,
    }));
}

function getPrValue(
  athleteId: string,
  metric: string,
  measurables: Measurable[]
): number | null {
  const pr = measurables.find(
    (m) => m.athlete_id === athleteId && m.metric === metric && m.is_pr
  );
  return pr?.value ?? null;
}

function cohortPercentile(
  value: number,
  cohortValues: number[],
  higherIsBetter: boolean
): number | null {
  if (cohortValues.length < 2) return null;
  const sorted = [...cohortValues].sort((a, b) =>
    higherIsBetter ? a - b : b - a
  );
  const betterCount = sorted.filter((v) =>
    higherIsBetter ? v <= value : v >= value
  ).length;
  return Math.round((betterCount / sorted.length) * 100);
}

function formatPercentileLabel(pct: number): string {
  if (pct <= 5) return "Top 5%";
  if (pct <= 10) return "Top 10%";
  if (pct <= 25) return "Top 25%";
  return `Top ${pct}%`;
}

export function computePercentileBadges(
  athlete: Athlete,
  allAthletes: Athlete[],
  allMeasurables: Measurable[]
): PercentileBadge[] {
  const cohort = allAthletes.filter(
    (a) =>
      a.scout_visible &&
      a.sport === athlete.sport &&
      a.graduation_year === athlete.graduation_year
  );

  const badges: PercentileBadge[] = [];

  for (const [metric, higherIsBetter] of [
    ["forty_yard", false],
    ["vertical", true],
    ["squat_max", true],
  ] as const) {
    const value = getPrValue(athlete.id, metric, allMeasurables);
    if (value == null) continue;

    const cohortValues = cohort
      .map((a) => getPrValue(a.id, metric, allMeasurables))
      .filter((v): v is number => v != null);

    const pct = cohortPercentile(value, cohortValues, higherIsBetter);
    if (pct != null && pct <= 25) {
      const positionLabel = athlete.position ?? athlete.sport;
      badges.push({
        label: formatPercentileLabel(pct),
        metric: `${METRIC_LABELS[metric] ?? metric} among ${athlete.graduation_year} ${positionLabel}s`,
      });
    }
  }

  if (badges.length > 0) return badges.slice(0, 3);

  return HERO_PERCENTILE_BADGES[athlete.id] ?? [];
}

export function getProvenanceInfo(
  athlete: Athlete,
  measurables: Measurable[],
  locations: Location[],
  coaches: Coach[]
): ProvenanceInfo {
  const location =
    locations.find((l) => l.id === athlete.home_location_id)?.name ??
    "Legacy Sports Complex";

  const sorted = [...measurables].sort(
    (a, b) =>
      new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
  );
  const latest = sorted[0];
  const coach = latest
    ? coaches.find((c) => c.id === latest.recorded_by_coach_id)
    : null;

  const lastVerified = latest
    ? new Date(latest.recorded_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : new Date(athlete.updated_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

  return {
    locationName: location,
    coachName: coach ? `${coach.first_name} ${coach.last_name}` : null,
    lastVerified,
  };
}

/** Scout-facing summary — strips internal retention/coaching ops language. */
export function scoutBrief(athlete: Athlete): string {
  const summary = athlete.ai_summary.trim();
  if (!summary) {
    return `${athlete.first_name} ${athlete.last_name} is an active athlete in the Legacy Sports Complex network with verified performance data on file.`;
  }

  return summary
    .replace(
      /\b(?:recommend(?:s|ed)?|triggers? our at-risk protocol|immediate parent outreach|before habit decay sets in)\b[^.]*\./gi,
      ""
    )
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function metricsWithHistory(measurables: Measurable[]): string[] {
  const counts = new Map<string, number>();
  for (const m of measurables) {
    counts.set(m.metric, (counts.get(m.metric) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .filter(([, count]) => count >= 2)
    .map(([metric]) => metric);
}
