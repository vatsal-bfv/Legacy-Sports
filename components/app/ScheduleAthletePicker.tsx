"use client";

import { useState } from "react";
import { ChevronsUpDown, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { demoStore } from "@/lib/demo/store";
import type { Athlete } from "@/lib/demo/types";
import { cn } from "@/lib/utils";

export const SCHEDULE_ATHLETE_PICKER_PLACEHOLDER =
  "Select an athlete to view their schedule";

function athleteInitials(athlete: Athlete) {
  return `${athlete.first_name[0] ?? ""}${athlete.last_name[0] ?? ""}`.toUpperCase();
}

function athleteLocationName(athlete: Athlete) {
  return (
    demoStore.locations.find((l) => l.id === athlete.home_location_id)?.name ??
    ""
  );
}

function AthleteAvatar({
  athlete,
  size = "sm",
}: {
  athlete: Athlete;
  size?: "sm" | "default";
}) {
  return (
    <Avatar size={size} className="ring-1 ring-bone">
      <AvatarImage src={athlete.photo_url} alt="" />
      <AvatarFallback className="bg-bone text-[10px] text-pitch">
        {athleteInitials(athlete)}
      </AvatarFallback>
    </Avatar>
  );
}

type ScheduleAthletePickerProps = {
  athletes: Athlete[];
  value: string;
  onChange: (athleteId: string) => void;
};

export function ScheduleAthletePicker({
  athletes,
  value,
  onChange,
}: ScheduleAthletePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = value
    ? athletes.find((a) => a.id === value) ??
      demoStore.athletes.find((a) => a.id === value)
    : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={SCHEDULE_ATHLETE_PICKER_PLACEHOLDER}
            className={cn(
              "h-9 max-w-[22rem] min-w-[14rem] justify-between border-bone bg-field font-normal hover:bg-bone",
              selected ? "text-pitch" : "text-slate"
            )}
          />
        }
      >
        <span className="flex min-w-0 items-center gap-2">
          {selected ? (
            <>
              <AthleteAvatar athlete={selected} />
              <span className="truncate">
                {selected.first_name} {selected.last_name}
              </span>
            </>
          ) : (
            <>
              <Star className="size-4 shrink-0 fill-orange text-orange" />
              <span className="truncate text-left">
                {SCHEDULE_ATHLETE_PICKER_PLACEHOLDER}
              </span>
            </>
          )}
        </span>
        <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent
        className="w-[min(22rem,calc(100vw-2rem))] border-bone bg-chalk p-0"
        align="end"
      >
        <Command className="rounded-lg bg-chalk">
          <CommandInput placeholder="Search athletes…" />
          <CommandList>
            <CommandEmpty>No athletes found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="view all facility sessions"
                onSelect={() => {
                  onChange("");
                  setOpen(false);
                }}
                className="text-slate data-selected:text-pitch"
              >
                <Star className="size-4 fill-orange text-orange" />
                <span>{SCHEDULE_ATHLETE_PICKER_PLACEHOLDER}</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator className="bg-bone" />
            <CommandGroup>
              {athletes.map((athlete) => {
                const location = athleteLocationName(athlete);
                return (
                  <CommandItem
                    key={athlete.id}
                    value={`${athlete.first_name} ${athlete.last_name} ${athlete.sport} ${location}`}
                    onSelect={() => {
                      onChange(athlete.id);
                      setOpen(false);
                    }}
                  >
                    <AthleteAvatar athlete={athlete} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-pitch">
                        {athlete.first_name} {athlete.last_name}
                      </p>
                      <p className="truncate text-xs capitalize text-slate">
                        {athlete.sport}
                        {location ? ` · ${location}` : ""}
                      </p>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
