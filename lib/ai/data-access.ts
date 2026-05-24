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
    const a = locs[0]?.name ?? "Suwanee";
    const b = locs[1]?.name ?? "Lawrenceville";
    const aKey = a.toLowerCase().replace(/\s+/g, "_");
    const bKey = b.toLowerCase().replace(/\s+/g, "_");
    return [
      { month: "Jan", [aKey]: 94, [bKey]: 91 },
      { month: "Feb", [aKey]: 93, [bKey]: 90 },
      { month: "Mar", [aKey]: 95, [bKey]: 88 },
      { month: "Apr", [aKey]: 94, [bKey]: 87 },
      { month: "May", [aKey]: 96, [bKey]: 86 },
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
    star_rating: a.star_rating,
  };
}

export function findAthleteByName(name: string) {
  const q = name.toLowerCase().trim();
  return demoStore.athletes.filter((a) => {
    const full = `${a.first_name} ${a.last_name}`.toLowerCase();
    return full.includes(q) || a.first_name.toLowerCase().includes(q);
  });
}

export function listLocations() {
  return demoStore.locations.map((l) => ({
    id: l.id,
    name: l.name,
    slug: l.slug,
    address: l.address,
    square_footage: l.square_footage,
  }));
}

export function listPrograms() {
  return demoStore.programs.map((p) => ({
    id: p.id,
    name: p.name,
    monthly_price: p.monthly_price,
    description: p.description,
    target_age_min: p.target_age_min,
    target_age_max: p.target_age_max,
  }));
}

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function getSessions(filters?: {
  location_id?: string;
  coach_id?: string;
  program_id?: string;
  day_of_week?: number;
}) {
  return demoStore.sessions
    .filter((s) => {
      if (filters?.location_id && s.location_id !== filters.location_id)
        return false;
      if (filters?.coach_id && s.coach_id !== filters.coach_id) return false;
      if (filters?.program_id && s.program_id !== filters.program_id)
        return false;
      if (
        filters?.day_of_week != null &&
        s.day_of_week !== filters.day_of_week
      )
        return false;
      return true;
    })
    .map((s) => {
      const loc = demoStore.locations.find((l) => l.id === s.location_id);
      const coach = demoStore.coaches.find((c) => c.id === s.coach_id);
      const program = demoStore.programs.find((p) => p.id === s.program_id);
      return {
        id: s.id,
        location: loc?.name ?? "",
        location_id: s.location_id,
        coach: coach ? `${coach.first_name} ${coach.last_name}` : "",
        program: program?.name ?? "",
        day: DAY_NAMES[s.day_of_week - 1] ?? "",
        hour: s.hour,
        room: s.room,
        capacity: s.capacity,
      };
    });
}

export function getLeads(filters?: {
  status?: string;
  location_id?: string;
  assigned_coach_id?: string;
}) {
  return demoStore.leads
    .filter((l) => {
      if (filters?.status && l.status !== filters.status) return false;
      if (
        filters?.location_id &&
        l.interested_location_id !== filters.location_id
      )
        return false;
      if (
        filters?.assigned_coach_id &&
        l.assigned_coach_id !== filters.assigned_coach_id
      )
        return false;
      return true;
    })
    .map((l) => ({
      id: l.id,
      name: `${l.first_name} ${l.last_name}`,
      athlete_name: l.athlete_name,
      status: l.status,
      source: l.source,
      location:
        demoStore.locations.find((x) => x.id === l.interested_location_id)
          ?.name ?? "",
      program:
        demoStore.programs.find((x) => x.id === l.interested_program_id)
          ?.name ?? "",
      created_at: l.created_at,
    }));
}

export function getMessages(filters?: {
  athlete_id?: string;
  lead_id?: string;
  limit?: number;
}) {
  const limit = filters?.limit ?? 20;
  return demoStore.messages
    .filter((m) => {
      if (filters?.athlete_id && m.athlete_id !== filters.athlete_id)
        return false;
      if (filters?.lead_id && m.lead_id !== filters.lead_id) return false;
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, limit)
    .map((m) => ({
      id: m.id,
      created_at: m.created_at,
      channel: m.channel,
      direction: m.direction,
      from_party: m.from_party,
      to_party: m.to_party,
      body: m.body.slice(0, 500),
      ai_generated: m.ai_generated,
      athlete_id: m.athlete_id,
      lead_id: m.lead_id,
    }));
}

export function listScoutUsers() {
  return demoStore.scoutUsers.map((s) => ({
    id: s.id,
    name: s.name,
    organization: s.organization,
    role: s.role,
    geographic_focus: s.geographic_focus,
    interested_positions: s.interested_positions,
  }));
}

export function getAthleteProfile(athleteId: string) {
  const athlete = demoStore.athletes.find((a) => a.id === athleteId);
  if (!athlete) return null;
  const program = demoStore.programs.find((p) => p.id === athlete.program_id);
  return {
    ...athleteToListItem(athlete),
    position: athlete.position,
    graduation_year: athlete.graduation_year,
    gpa: athlete.gpa,
    school: athlete.school,
    program: program?.name ?? "",
    parent_name: athlete.parent_name,
    parent_email: athlete.parent_email,
    ai_summary: athlete.ai_summary,
    recruit_status: athlete.recruit_status,
  };
}
