import { demoStore } from "@/lib/demo/store";
import { HERO_IDS } from "@/lib/constants";
import type { Athlete, Session } from "@/lib/demo/types";

const HERO_ID_ORDER = Object.values(HERO_IDS);
const HERO_ID_SET = new Set<string>(HERO_ID_ORDER);

export function getSessionRoster(session: Session): Athlete[] {
  const fromAttendance = demoStore.attendance
    .filter(
      (a) => a.session_id === session.id && a.status !== "no_show"
    )
    .map((a) => demoStore.athletes.find((x) => x.id === a.athlete_id))
    .filter((a): a is Athlete => Boolean(a));

  const seen = new Set(fromAttendance.map((a) => a.id));
  const fromProgram = demoStore.athletes
    .filter(
      (a) =>
        a.home_location_id === session.location_id &&
        a.program_id === session.program_id &&
        !seen.has(a.id)
    )
    .sort((a, b) => b.star_rating - a.star_rating);

  return [...fromAttendance, ...fromProgram].slice(0, session.capacity);
}

export function sessionHasFiveStarAthlete(session: Session): boolean {
  return getSessionRoster(session).some((a) => a.star_rating === 5);
}

export function getFiveStarAthletes(locationId?: string | null): Athlete[] {
  return demoStore.athletes
    .filter(
      (a) =>
        a.star_rating === 5 &&
        (!locationId || a.home_location_id === locationId)
    )
    .sort((a, b) => a.last_name.localeCompare(b.last_name));
}

/** Five-star athletes for the schedule filter — hero athletes first, then the rest. */
export function getScheduleAthleteFilterList(): Athlete[] {
  const all = getFiveStarAthletes();
  const heroes = HERO_ID_ORDER.map((id) => all.find((a) => a.id === id)).filter(
    (a): a is Athlete => Boolean(a)
  );
  const rest = all
    .filter((a) => !HERO_ID_SET.has(a.id))
    .sort((a, b) => a.last_name.localeCompare(b.last_name));

  return [...heroes, ...rest];
}

export function sessionIncludesAthlete(
  session: Session,
  athleteId: string
): boolean {
  return getSessionRoster(session).some((a) => a.id === athleteId);
}

export function getAthleteSessionsAtLocation(
  athleteId: string,
  locationId: string
): Session[] {
  return demoStore.sessions.filter(
    (s) =>
      s.location_id === locationId &&
      getSessionRoster(s).some((a) => a.id === athleteId)
  );
}
