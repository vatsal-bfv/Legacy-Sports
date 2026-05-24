"use client";

import "temporal-polyfill/global";

import { useMemo } from "react";

/** Day-of-week column headers for a 7-day facility schedule. */
export function createWeekDayColumnHeader(anchorMonday: Temporal.PlainDate) {
  return function ScheduleXWeekDayHeader({ date }: { date: string }) {
    const label = useMemo(() => {
      const columnDate = Temporal.PlainDate.from(date);
      const weekday = columnDate.toLocaleString("en-US", { weekday: "short" });
      const dateLabel = columnDate.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
      });
      return { weekday, dateLabel };
    }, [date]);

    const isToday =
      Temporal.PlainDate.from(date).equals(Temporal.Now.plainDateISO());

    return (
      <div className="flex flex-col items-center gap-0.5 py-1">
        <span
          className={`text-sm font-semibold ${isToday ? "text-orange" : "text-pitch"}`}
        >
          {label.weekday}
        </span>
        <span className="text-[10px] text-slate">{label.dateLabel}</span>
      </div>
    );
  };
}
