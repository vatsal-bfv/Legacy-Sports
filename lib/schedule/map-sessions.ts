import "temporal-polyfill/global";

import type { Coach, Program, Session } from "@/lib/demo/types";
import type { CalendarEventExternal } from "@schedule-x/calendar";

export function getViewerTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/** Monday of the week containing `reference` (ISO week). */
export function getAnchorMonday(
  reference: Temporal.PlainDate = Temporal.Now.plainDateISO()
): Temporal.PlainDate {
  return reference.subtract({ days: reference.dayOfWeek - 1 });
}

export type ScheduleCalendarEventMeta = {
  coachName: string;
  room: string;
  programName: string;
  sessionId: string;
};

export function sessionsToCalendarEvents(
  sessions: Session[],
  anchorMonday: Temporal.PlainDate,
  timezone: string,
  programs: Program[],
  coaches: Coach[]
): CalendarEventExternal[] {
  return sessions.map((session) => {
    const columnDate = anchorMonday.add({ days: session.day_of_week - 1 });
    const start = columnDate.toZonedDateTime({
      timeZone: timezone,
      plainTime: Temporal.PlainTime.from({
        hour: session.hour,
        minute: 0,
      }),
    });
    const end = start.add({ minutes: session.duration_minutes });

    const program = programs.find((p) => p.id === session.program_id);
    const coach = coaches.find((c) => c.id === session.coach_id);
    const coachName = coach
      ? `${coach.first_name} ${coach.last_name}`
      : "Staff";

    return {
      id: session.id,
      title: program?.name ?? "Session",
      description: `${coachName}|${session.room}`,
      start,
      end,
      _options: { disableDND: true, disableResize: true },
    };
  });
}

export function parseEventDescription(description?: string) {
  if (!description) return { coachName: "", room: "" };
  const [coachName, room] = description.split("|");
  return { coachName: coachName ?? "", room: room ?? "" };
}

/** Build ISO timestamps for the current calendar week (attendance / legacy use). */
export function sessionTimesForWeek(
  session: Session,
  anchorMonday: Temporal.PlainDate,
  timezone: string
) {
  const start = anchorMonday
    .add({ days: session.day_of_week - 1 })
    .toZonedDateTime({
      timeZone: timezone,
      plainTime: Temporal.PlainTime.from({ hour: session.hour, minute: 0 }),
    });
  const end = start.add({ minutes: session.duration_minutes });
  return {
    starts_at: start.toInstant().toString(),
    ends_at: end.toInstant().toString(),
  };
}
