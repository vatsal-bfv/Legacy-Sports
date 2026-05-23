import "temporal-polyfill/global";

import type { Location, Program, Session } from "@/lib/demo/types";
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

export function sessionsToCalendarEvents(
  sessions: Session[],
  locations: Location[],
  programs: Program[],
  anchorMonday: Temporal.PlainDate,
  timezone: string
): CalendarEventExternal[] {
  const locationIndex = new Map(locations.map((l, i) => [l.id, i]));

  return sessions
    .filter((s) => locationIndex.has(s.location_id))
    .map((session) => {
      const idx = locationIndex.get(session.location_id)!;
      const columnDate = anchorMonday.add({ days: idx });
      const startLocal = new Date(session.starts_at);
      const endLocal = new Date(session.ends_at);

      const start = columnDate.toZonedDateTime({
        timeZone: timezone,
        plainTime: Temporal.PlainTime.from({
          hour: startLocal.getHours(),
          minute: startLocal.getMinutes(),
        }),
      });
      const end = columnDate.toZonedDateTime({
        timeZone: timezone,
        plainTime: Temporal.PlainTime.from({
          hour: endLocal.getHours(),
          minute: endLocal.getMinutes(),
        }),
      });

      const program = programs.find((p) => p.id === session.program_id);

      return {
        id: session.id,
        title: program?.name ?? "Session",
        description: session.room,
        start,
        end,
        _options: { disableDND: true, disableResize: true },
      };
    });
}
