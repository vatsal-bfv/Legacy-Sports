"use client";

import type { CalendarEventExternal } from "@schedule-x/calendar";
import { parseEventDescription } from "@/lib/schedule/map-sessions";

export function ScheduleXTimeGridEvent({
  calendarEvent,
}: {
  calendarEvent: CalendarEventExternal;
}) {
  const { coachName, room } = parseEventDescription(calendarEvent.description);

  return (
    <div className="flex h-full flex-col justify-center overflow-hidden rounded-md border border-orange/30 bg-orange/20 px-1.5 py-1">
      <p className="truncate text-xs font-medium leading-tight text-pitch">
        {calendarEvent.title}
      </p>
      {coachName ? (
        <p className="truncate text-[10px] font-medium leading-tight text-pitch/90">
          {coachName}
        </p>
      ) : null}
      {room ? (
        <p className="truncate text-[10px] leading-tight text-slate">{room}</p>
      ) : null}
    </div>
  );
}
