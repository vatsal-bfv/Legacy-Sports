"use client";

import "temporal-polyfill/global";
import "@schedule-x/theme-default/dist/index.css";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useNextCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { createViewWeek, createViewDay } from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { createCurrentTimePlugin } from "@schedule-x/current-time";
import { useLocationScope } from "@/components/app/LocationProvider";
import { ScheduleXTimeGridEvent } from "@/components/app/ScheduleXEvent";
import { createLocationColumnHeader } from "@/components/app/ScheduleXLocationHeader";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { demoStore } from "@/lib/demo/store";
import type { Location } from "@/lib/demo/types";
import type { CalendarEventExternal } from "@schedule-x/calendar";
import {
  getAnchorMonday,
  getViewerTimezone,
  sessionsToCalendarEvents,
} from "@/lib/schedule/map-sessions";

const COMMAND_SHEET_CLASS =
  "w-full border-[#2A2D34] bg-[#15171B] text-[#F5F6F7] sm:max-w-md [&_[data-slot=sheet-title]]:text-[#F5F6F7] [&_[data-slot=sheet-close]]:text-[#9DA3AE] [&_[data-slot=sheet-close]]:hover:bg-[#1A1D24] [&_[data-slot=sheet-close]]:hover:text-[#F5F6F7]";

function formatHour(h: number) {
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:00 ${period}`;
}

function formatNowTime(d: Date) {
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatToday(d: Date) {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

type ScheduleXBlockProps = {
  locations: Location[];
  events: CalendarEventExternal[];
  anchorDate: Temporal.PlainDate;
  timezone: string;
  onEventClick: (eventId: string) => void;
};

function ScheduleXBlock({
  locations,
  events,
  anchorDate,
  timezone,
  onEventClick,
}: ScheduleXBlockProps) {
  const [eventsService] = useState(() => createEventsServicePlugin());
  const [currentTimePlugin] = useState(() =>
    createCurrentTimePlugin({ fullWeekWidth: true })
  );

  const viewWeek = useMemo(() => createViewWeek(), []);
  const viewDay = useMemo(() => createViewDay(), []);
  const useDayView = locations.length === 1;

  const calendar = useNextCalendarApp(
    {
      views: useDayView ? [viewDay] : [viewWeek],
      defaultView: useDayView ? viewDay.name : viewWeek.name,
      selectedDate: anchorDate,
      firstDayOfWeek: 1,
      timezone,
      locale: "en-US",
      isDark: true,
      isResponsive: false,
      dayBoundaries: {
        start: "07:00",
        end: "20:00",
      },
      weekOptions: {
        nDays: locations.length,
        gridHeight: 680,
        gridStep: 60,
        eventOverlap: false,
        timeAxisFormatOptions: { hour: "numeric", minute: "2-digit" },
      },
      events,
      callbacks: {
        onEventClick(event) {
          onEventClick(String(event.id));
        },
      },
    },
    [eventsService, currentTimePlugin]
  );

  useEffect(() => {
    eventsService.set(events);
  }, [events, eventsService]);

  const LocationHeader = useMemo(
    () => createLocationColumnHeader(locations, anchorDate),
    [locations, anchorDate]
  );

  const customComponents = useMemo(
    () => ({
      timeGridEvent: ScheduleXTimeGridEvent,
      weekGridDate: LocationHeader,
    }),
    [LocationHeader]
  );

  if (!calendar) return null;

  return (
    <ScheduleXCalendar
      calendarApp={calendar}
      customComponents={customComponents}
    />
  );
}

const MemoScheduleXBlock = memo(ScheduleXBlock);

export function ScheduleGrid() {
  const { locationId } = useLocationScope();
  const timezone = getViewerTimezone();
  const [now, setNow] = useState(() => new Date());
  const [rosterSession, setRosterSession] = useState<
    (typeof demoStore.sessions)[0] | null
  >(null);

  const locations = useMemo(
    () =>
      demoStore.locations.filter(
        (l) => !locationId || l.id === locationId
      ),
    [locationId]
  );

  const visibleSessions = useMemo(
    () =>
      demoStore.sessions.filter(
        (s) => !locationId || s.location_id === locationId
      ),
    [locationId]
  );

  const anchorDate = useMemo(
    () =>
      locations.length === 1
        ? Temporal.Now.plainDateISO()
        : getAnchorMonday(),
    [locations.length]
  );

  const events = useMemo(
    () =>
      sessionsToCalendarEvents(
        visibleSessions,
        locations,
        demoStore.programs,
        anchorDate,
        timezone
      ),
    [visibleSessions, locations, anchorDate, timezone]
  );

  const scopeKey = `${locationId ?? "all"}-${locations.length}`;

  const handleEventClick = useCallback((eventId: string) => {
    const session = demoStore.sessions.find((s) => s.id === eventId);
    if (session) setRosterSession(session);
  }, []);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const rosterAthletes = useMemo(() => {
    if (!rosterSession) return [];
    return demoStore.athletes
      .filter(
        (a) =>
          a.program_id === rosterSession.program_id &&
          a.home_location_id === rosterSession.location_id
      )
      .slice(0, rosterSession.capacity);
  }, [rosterSession]);

  const rosterProgram = rosterSession
    ? demoStore.programs.find((p) => p.id === rosterSession.program_id)
    : null;
  const rosterLocation = rosterSession
    ? demoStore.locations.find((l) => l.id === rosterSession.location_id)
    : null;
  const rosterCoach = rosterSession
    ? demoStore.coaches.find((c) => c.id === rosterSession.coach_id)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Schedule</h1>
          <p className="mt-1 text-sm text-[#9DA3AE]">
            {locations.length === 1
              ? `${locations[0].name} · today`
              : "All locations · today"}
          </p>
        </div>
        <div className="text-right text-sm">
          <p className="text-[#9DA3AE]">{formatToday(now)}</p>
          <p className="text-lg font-semibold tabular-nums text-[#F5F6F7]">
            {formatNowTime(now)}
          </p>
        </div>
      </div>

      <div className="legacy-command-schedule overflow-hidden rounded-lg border border-[#2A2D34] bg-[#15171B]">
        <MemoScheduleXBlock
          key={scopeKey}
          locations={locations}
          events={events}
          anchorDate={anchorDate}
          timezone={timezone}
          onEventClick={handleEventClick}
        />
      </div>

      <Sheet open={!!rosterSession} onOpenChange={() => setRosterSession(null)}>
        <SheetContent
          side="right"
          className={`${COMMAND_SHEET_CLASS} z-[60]`}
        >
          <SheetHeader className="border-b border-[#2A2D34] pb-4">
            <SheetTitle>Session roster</SheetTitle>
          </SheetHeader>
          {rosterSession && (
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
              <div className="rounded-lg border border-[#2A2D34] bg-[#12141A] p-4 text-sm">
                <p className="font-medium text-[#F5F6F7]">
                  {rosterProgram?.name}
                </p>
                <p className="mt-1 text-[#9DA3AE]">
                  {rosterLocation?.name} · {rosterSession.room}
                </p>
                <p className="mt-1 text-xs text-[#9DA3AE]">
                  {formatHour(new Date(rosterSession.starts_at).getHours())} ·
                  Coach {rosterCoach?.first_name} {rosterCoach?.last_name} ·{" "}
                  {rosterAthletes.length}/{rosterSession.capacity} enrolled
                </p>
              </div>
              <ul className="space-y-1">
                {rosterAthletes.map((a) => (
                  <li key={a.id}>
                    <Link
                      href={`/command-os/athletes/${a.id}`}
                      onClick={() => setRosterSession(null)}
                      className="flex items-center gap-3 rounded-md border border-transparent px-2 py-2 transition-colors hover:border-[#2A2D34] hover:bg-[#12141A]"
                    >
                      <Image
                        src={a.photo_url}
                        alt=""
                        width={36}
                        height={36}
                        className="rounded-full ring-1 ring-[#2A2D34]"
                      />
                      <div>
                        <p className="font-medium text-[#F5F6F7]">
                          {a.first_name} {a.last_name}
                        </p>
                        <p className="text-xs capitalize text-[#9DA3AE]">
                          {a.sport}
                          {a.position ? ` · ${a.position}` : ""}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
