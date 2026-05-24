"use client";

import "temporal-polyfill/global";

import { useMemo } from "react";
import type { Location } from "@/lib/demo/types";

export function createLocationColumnHeader(
  locations: Location[],
  anchorMonday: Temporal.PlainDate
) {
  return function ScheduleXLocationHeader({ date }: { date: string }) {
    const label = useMemo(() => {
      const columnDate = Temporal.PlainDate.from(date);
      const dayOffset = anchorMonday.until(columnDate).days;
      return (
        locations[dayOffset]?.name ??
        columnDate.toLocaleString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
    }, [date]);

    return (
      <div className="flex flex-col items-center gap-0.5 py-1">
        <span className="text-sm font-semibold text-pitch">{label}</span>
        {locations.length > 1 ? (
          <span className="text-[10px] text-slate">Today&apos;s sessions</span>
        ) : null}
      </div>
    );
  };
}
