"use client";

import type { CalendarEventExternal } from "@schedule-x/calendar";

export function ScheduleXTimeGridEvent({
  calendarEvent,
}: {
  calendarEvent: CalendarEventExternal;
}) {
  return (
    <div className="flex h-full flex-col justify-center overflow-hidden rounded-md border border-orange/30 bg-orange/20 px-1.5 py-1">
      <p className="truncate text-xs font-medium leading-tight text-pitch">
        {calendarEvent.title}
      </p>
      {calendarEvent.description ? (
        <p className="truncate text-[10px] leading-tight text-slate">
          {calendarEvent.description}
        </p>
      ) : null}
    </div>
  );
}
