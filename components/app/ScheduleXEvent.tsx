"use client";

import type { CalendarEventExternal } from "@schedule-x/calendar";

export function ScheduleXTimeGridEvent({
  calendarEvent,
}: {
  calendarEvent: CalendarEventExternal;
}) {
  return (
    <div className="flex h-full flex-col justify-center overflow-hidden rounded-md border border-[#3B82F6]/30 bg-[#3B82F6]/20 px-1.5 py-1">
      <p className="truncate text-xs font-medium leading-tight text-[#F5F6F7]">
        {calendarEvent.title}
      </p>
      {calendarEvent.description ? (
        <p className="truncate text-[10px] leading-tight text-[#9DA3AE]">
          {calendarEvent.description}
        </p>
      ) : null}
    </div>
  );
}
