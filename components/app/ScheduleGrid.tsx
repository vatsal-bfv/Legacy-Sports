"use client";

import "temporal-polyfill/global";
import "@schedule-x/theme-default/dist/index.css";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react";
import { useNextCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { createViewWeek } from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { createCurrentTimePlugin } from "@schedule-x/current-time";
import { useLocationScope } from "@/components/app/LocationProvider";
import { ScheduleXTimeGridEvent } from "@/components/app/ScheduleXEvent";
import { createWeekDayColumnHeader } from "@/components/app/ScheduleXLocationHeader";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { demoStore } from "@/lib/demo/store";
import type { CalendarEventExternal } from "@schedule-x/calendar";
import {
  getAnchorMonday,
  getViewerTimezone,
  sessionsToCalendarEvents,
} from "@/lib/schedule/map-sessions";
import { ScheduleAthletePicker } from "@/components/app/ScheduleAthletePicker";
import {
  getScheduleAthleteFilterList,
  getSessionRoster,
  sessionIncludesAthlete,
} from "@/lib/schedule/session-roster";

const COMMAND_SHEET_CLASS =
  "w-full border-bone bg-chalk text-pitch sm:max-w-md [&_[data-slot=sheet-title]]:text-pitch [&_[data-slot=sheet-close]]:text-slate [&_[data-slot=sheet-close]]:hover:bg-bone [&_[data-slot=sheet-close]]:hover:text-pitch";

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function formatHour(h: number) {
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:00 ${period}`;
}

function formatWeekRange(anchorMonday: Temporal.PlainDate) {
  const end = anchorMonday.add({ days: 6 });
  const startLabel = anchorMonday.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
  });
  const endLabel = end.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${startLabel} – ${endLabel}`;
}

type ScheduleXBlockProps = {
  events: CalendarEventExternal[];
  anchorDate: Temporal.PlainDate;
  timezone: string;
  onEventClick: (eventId: string) => void;
};

function ScheduleXBlock({
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

  const calendar = useNextCalendarApp(
    {
      views: [viewWeek],
      defaultView: viewWeek.name,
      selectedDate: anchorDate,
      firstDayOfWeek: 1,
      timezone,
      locale: "en-US",
      isDark: false,
      isResponsive: false,
      dayBoundaries: {
        start: "07:00",
        end: "20:00",
      },
      weekOptions: {
        nDays: 7,
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

  const WeekDayHeader = useMemo(() => createWeekDayColumnHeader(), []);

  const customComponents = useMemo(
    () => ({
      timeGridEvent: ScheduleXTimeGridEvent,
      weekGridDate: WeekDayHeader,
    }),
    [WeekDayHeader]
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
  const { locationId: scopeLocationId, setLocationId } = useLocationScope();
  const timezone = getViewerTimezone();

  const [userFacilityId, setUserFacilityId] = useState(
    () => demoStore.locations[0].id
  );
  const facilityId = scopeLocationId ?? userFacilityId;
  const [weekAnchor, setWeekAnchor] = useState(() => getAnchorMonday());
  const [selectedAthleteId, setSelectedAthleteId] = useState("");
  const [rosterSession, setRosterSession] = useState<
    (typeof demoStore.sessions)[0] | null
  >(null);

  const scheduleAthletes = useMemo(() => getScheduleAthleteFilterList(), []);

  const facility = demoStore.locations.find((l) => l.id === facilityId);

  const facilitySessions = useMemo(
    () => demoStore.sessions.filter((s) => s.location_id === facilityId),
    [facilityId]
  );

  const effectiveAthleteId = useMemo(() => {
    if (!selectedAthleteId) return "";
    return facilitySessions.some((s) =>
      sessionIncludesAthlete(s, selectedAthleteId)
    )
      ? selectedAthleteId
      : "";
  }, [selectedAthleteId, facilitySessions]);

  const selectedAthlete = effectiveAthleteId
    ? demoStore.athletes.find((a) => a.id === effectiveAthleteId)
    : null;

  const handleFacilityChange = useCallback(
    (locationId: string) => {
      setUserFacilityId(locationId);
      setLocationId(locationId);
      setSelectedAthleteId("");
    },
    [setLocationId]
  );

  const handleAthleteChange = useCallback(
    (athleteId: string) => {
      setSelectedAthleteId(athleteId);
      if (!athleteId) return;

      const athlete = demoStore.athletes.find((a) => a.id === athleteId);
      if (!athlete) return;

      setUserFacilityId(athlete.home_location_id);
      setLocationId(athlete.home_location_id);
    },
    [setLocationId]
  );

  const visibleSessions = useMemo(() => {
    if (!effectiveAthleteId) return facilitySessions;
    return facilitySessions.filter((s) =>
      sessionIncludesAthlete(s, effectiveAthleteId)
    );
  }, [facilitySessions, effectiveAthleteId]);

  const events = useMemo(
    () =>
      sessionsToCalendarEvents(
        visibleSessions,
        weekAnchor,
        timezone,
        demoStore.programs,
        demoStore.coaches
      ),
    [visibleSessions, weekAnchor, timezone]
  );

  const handleEventClick = useCallback((eventId: string) => {
    const session = demoStore.sessions.find((s) => s.id === eventId);
    if (session) setRosterSession(session);
  }, []);

  const rosterAthletes = useMemo(() => {
    if (!rosterSession) return [];
    return getSessionRoster(rosterSession);
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

  const calendarKey = `${facilityId}-${weekAnchor.toString()}-${effectiveAthleteId || "all"}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Schedule</h1>
          <p className="mt-1 text-sm text-slate">
            {selectedAthlete
              ? `${selectedAthlete.first_name} ${selectedAthlete.last_name} · ${facility?.name ?? "Facility"}`
              : `${facility?.name ?? "Facility"} · 7-day view`}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-smoke" />
          <select
            value={facilityId}
            onChange={(e) => handleFacilityChange(e.target.value)}
            className="rounded-[8px] border-[1.5px] border-bone bg-field px-3 py-1.5 text-sm text-pitch focus:border-orange focus:outline-none focus:ring-4 focus:ring-orange/10"
          >
            {demoStore.locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 rounded-[8px] border border-bone bg-field">
          <button
            type="button"
            onClick={() => setWeekAnchor((w) => w.subtract({ weeks: 1 }))}
            className="rounded-l-[8px] p-2 text-slate transition-colors hover:bg-bone hover:text-pitch"
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[10rem] px-2 text-center text-sm font-medium text-pitch">
            {formatWeekRange(weekAnchor)}
          </span>
          <button
            type="button"
            onClick={() => setWeekAnchor((w) => w.add({ weeks: 1 }))}
            className="rounded-r-[8px] p-2 text-slate transition-colors hover:bg-bone hover:text-pitch"
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setWeekAnchor(getAnchorMonday())}
          className="rounded-[8px] border border-bone bg-field px-3 py-1.5 text-sm text-pitch transition-colors hover:bg-bone"
        >
          This week
        </button>

        <div className="ml-auto">
          <ScheduleAthletePicker
            athletes={scheduleAthletes}
            value={effectiveAthleteId}
            onChange={handleAthleteChange}
          />
        </div>
      </div>

      {selectedAthlete && (
        <div className="flex items-center gap-3 rounded-lg border border-orange/30 bg-orange/10 px-4 py-3">
          <Image
            src={selectedAthlete.photo_url}
            alt=""
            width={40}
            height={40}
            className="rounded-full ring-1 ring-bone"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-pitch">
              Showing {visibleSessions.length} session
              {visibleSessions.length === 1 ? "" : "s"} for{" "}
              {selectedAthlete.first_name} {selectedAthlete.last_name}
            </p>
            <p className="text-xs capitalize text-slate">
              {selectedAthlete.sport}
              {selectedAthlete.position
                ? ` · ${selectedAthlete.position}`
                : ""}
            </p>
          </div>
          <Link
            href={`/command-os/athletes/${selectedAthlete.id}`}
            className="shrink-0 text-sm font-medium text-orange hover:underline"
          >
            View profile
          </Link>
        </div>
      )}

      <div className="legacy-command-schedule overflow-hidden rounded-lg border border-bone bg-chalk">
        {visibleSessions.length === 0 ? (
          <div className="flex h-[400px] items-center justify-center text-sm text-slate">
            {effectiveAthleteId
              ? "This athlete has no sessions at this facility."
              : "No sessions scheduled for this facility."}
          </div>
        ) : (
          <MemoScheduleXBlock
            key={calendarKey}
            events={events}
            anchorDate={weekAnchor}
            timezone={timezone}
            onEventClick={handleEventClick}
          />
        )}
      </div>

      <Sheet open={!!rosterSession} onOpenChange={() => setRosterSession(null)}>
        <SheetContent
          side="right"
          className={`${COMMAND_SHEET_CLASS} z-[60]`}
        >
          <SheetHeader className="border-b border-bone pb-4">
            <SheetTitle>Session roster</SheetTitle>
          </SheetHeader>
          {rosterSession && (
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
              <div className="rounded-lg border border-bone bg-field p-4 text-sm">
                <p className="font-medium text-pitch">
                  {rosterProgram?.name}
                </p>
                <p className="mt-1 text-slate">
                  {rosterLocation?.name} · {rosterSession.room}
                </p>
                <p className="mt-1 text-xs text-slate">
                  {DAY_NAMES[rosterSession.day_of_week - 1]}{" "}
                  {formatHour(rosterSession.hour)} · Coach{" "}
                  {rosterCoach?.first_name} {rosterCoach?.last_name} ·{" "}
                  {rosterAthletes.length}/{rosterSession.capacity} enrolled
                </p>
              </div>
              <ul className="space-y-1">
                {rosterAthletes.map((a) => (
                  <li key={a.id}>
                    <Link
                      href={`/command-os/athletes/${a.id}`}
                      onClick={() => setRosterSession(null)}
                      className="flex items-center gap-3 rounded-md border border-transparent px-2 py-2 transition-colors hover:border-bone hover:bg-field"
                    >
                      <Image
                        src={a.photo_url}
                        alt=""
                        width={36}
                        height={36}
                        className="rounded-full ring-1 ring-bone"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-pitch">
                          {a.first_name} {a.last_name}
                          {a.star_rating === 5 ? (
                            <Star className="ml-1 inline h-3 w-3 fill-orange text-orange" />
                          ) : null}
                        </p>
                        <p className="text-xs capitalize text-slate">
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
