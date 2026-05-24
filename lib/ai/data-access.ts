import { demoStore } from "@/lib/demo/store";
import { HERO_IDS } from "@/lib/constants";
import { LOCATION_UTILIZATION_PCT } from "@/lib/demo/location-utilization";
import { searchCoachNotes } from "@/lib/demo/semantic-notes";
import type { Athlete } from "@/lib/demo/types";

export type QueryScope = { location_id?: string };

function scopedAthletes(locationId?: string) {
  const list = demoStore.athletes;
  if (!locationId) return list;
  return list.filter((a) => a.home_location_id === locationId);
}

export function queryAthletes(filters: {
  sport?: string;
  position?: string;
  age_min?: number;
  age_max?: number;
  location_id?: string;
  measurable_threshold?: { metric: string; max?: number; min?: number };
  status?: string;
  recruit_status?: string;
}) {
  return scopedAthletes(filters.location_id).filter((a) => {
    if (filters.sport && a.sport !== filters.sport) return false;
    if (filters.position && a.position !== filters.position) return false;
    if (filters.status && a.status !== filters.status) return false;
    if (filters.recruit_status && a.recruit_status !== filters.recruit_status)
      return false;
    if (filters.age_min != null || filters.age_max != null) {
      const age =
        new Date().getFullYear() -
        new Date(a.date_of_birth).getFullYear();
      if (filters.age_min != null && age < filters.age_min) return false;
      if (filters.age_max != null && age > filters.age_max) return false;
    }
    if (filters.measurable_threshold) {
      const { metric, max, min } = filters.measurable_threshold;
      const m = demoStore.measurables.find(
        (x) => x.athlete_id === a.id && x.metric === metric && x.is_pr
      );
      if (!m) return false;
      if (max != null && m.value > max) return false;
      if (min != null && m.value < min) return false;
    }
    return true;
  });
}

export function getAthleteMeasurables(
  athleteId: string,
  metric?: string,
  since?: string
) {
  return demoStore.measurables.filter((m) => {
    if (m.athlete_id !== athleteId) return false;
    if (metric && m.metric !== metric) return false;
    if (since && m.recorded_at < since) return false;
    return true;
  });
}

export function getAthleteAttendance(athleteId: string, since?: string) {
  return demoStore.attendance.filter((a) => {
    if (a.athlete_id !== athleteId) return false;
    if (since && a.checked_in_at < since) return false;
    return true;
  });
}

export function getAtRiskAthletes(locationId?: string): Athlete[] {
  return scopedAthletes(locationId)
    .filter((a) => a.status === "at_risk")
    .sort((a, b) => (b.risk_score ?? 0) - (a.risk_score ?? 0));
}

export function compareLocations(
  metric: "revenue" | "retention" | "utilization",
  period: string
) {
  void period;
  const locs = demoStore.locations;
  if (metric === "revenue") {
    return locs.map((l, i) => ({
      location: l.name,
      revenue: [142000, 118000, 89000, 105000, 76000][i],
    }));
  }
  if (metric === "retention") {
    return [
      { month: "Jan", phoenix: 94, mesa: 91 },
      { month: "Feb", phoenix: 93, mesa: 90 },
      { month: "Mar", phoenix: 95, mesa: 88 },
      { month: "Apr", phoenix: 94, mesa: 87 },
      { month: "May", phoenix: 96, mesa: 86 },
    ];
  }
  return locs.map((l, i) => ({
    location: l.name,
    utilization: LOCATION_UTILIZATION_PCT[i],
  }));
}

export function getCoachPerformance(coachId?: string) {
  const rows = demoStore.coaches.map((c, i) => ({
    coach: `${c.first_name} ${c.last_name}`,
    retention: `${96 - (i % 6)}%`,
    location:
      demoStore.locations.find((l) => l.id === c.primary_location_id)?.name ??
      "",
    coach_id: c.id,
  }));
  if (coachId) return rows.filter((r) => r.coach_id === coachId);
  return rows.sort(
    (a, b) => parseInt(b.retention) - parseInt(a.retention)
  );
}

export function getFailedPayments(since?: string) {
  return demoStore.payments.filter((p) => {
    if (p.status !== "failed") return false;
    if (since && p.processed_at < since) return false;
    return true;
  });
}

export function summarizeAthleteProgression(athleteId: string, since?: string) {
  const athlete = demoStore.athletes.find((a) => a.id === athleteId);
  if (!athlete) return "Athlete not found.";
  const meas = getAthleteMeasurables(athleteId, undefined, since);
  const att = getAthleteAttendance(athleteId, since);
  const attended = att.filter((a) => a.status === "attended").length;
  const missed = att.filter((a) => a.status === "no_show").length;

  if (athleteId === HERO_IDS.marcus) {
    return `**${athlete.first_name} ${athlete.last_name}** is trending sharply upward. 40-yard improved from 4.78 to **4.62** over 9 months; vertical from 31" to **36"**. ${attended} sessions attended. Three D1 programs have active inquiries.`;
  }
  if (athleteId === HERO_IDS.tyler) {
    return `**${athlete.first_name} ${athlete.last_name}** hit a squat PR at 245 lbs but missed ${missed} recent sessions — risk score ${athlete.risk_score}%. Immediate re-engagement recommended.`;
  }

  const prs = meas.filter((m) => m.is_pr);
  return `${athlete.first_name} ${athlete.last_name}: ${attended} sessions attended, ${prs.length} recent PRs logged. Status: ${athlete.status}. ${athlete.ai_summary.slice(0, 120)}…`;
}

export function searchNotesByQuery(query: string) {
  return searchCoachNotes(query);
}

export function athleteToListItem(a: Athlete) {
  const loc = demoStore.locations.find((l) => l.id === a.home_location_id);
  return {
    id: a.id,
    name: `${a.first_name} ${a.last_name}`,
    sport: a.sport,
    location: loc?.name ?? "",
    risk_score: a.risk_score != null ? `${a.risk_score}%` : undefined,
    forty: demoStore.measurables.find(
      (m) => m.athlete_id === a.id && m.metric === "forty_yard" && m.is_pr
    )?.value,
    grad_year: String(a.graduation_year),
    status: a.status,
  };
}
