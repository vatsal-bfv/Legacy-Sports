"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import type { Location, Program } from "@/lib/demo/types";
import { LeadCaptureForm } from "@/components/shared/LeadCaptureForm";
import { SectionBackLink } from "@/components/marketing/SectionBackLink";
import { CoachPhoto } from "@/components/marketing/coaches/CoachPhoto";
import { LocationSchematic } from "@/components/marketing/locations/LocationSchematic";
import { LANDING_SECTIONS } from "@/lib/marketing/landing-sections";
import { getCoachDisplayName, type MarketingCoach } from "@/lib/marketing/coaches";
import type { LocationSchematic as LocationSchematicData } from "@/lib/marketing/location-schematics";
import type { getProgramsForLocation } from "@/lib/marketing/programs";
import { formatCurrency } from "@/lib/utils";

const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

type LocationProgramEntry = ReturnType<typeof getProgramsForLocation>[number];

export function LocationDetailExperience({
  location,
  schematic,
  coaches,
  locationPrograms,
  allLocations,
  allPrograms,
}: {
  location: Location;
  schematic: LocationSchematicData;
  coaches: MarketingCoach[];
  locationPrograms: LocationProgramEntry[];
  allLocations: Location[];
  allPrograms: Program[];
}) {
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);

  const orderedHours = useMemo(
    () =>
      DAY_ORDER.map((day) => ({
        day,
        hours: location.hours[day] ?? "Closed",
      })),
    [location.hours]
  );

  const selectedZone = useMemo(
    () => schematic.zones.find((zone) => zone.id === selectedZoneId) ?? null,
    [schematic.zones, selectedZoneId]
  );

  const previewZone = useMemo(() => {
    if (selectedZone) {
      return selectedZone;
    }
    if (hoveredZoneId) {
      return schematic.zones.find((zone) => zone.id === hoveredZoneId) ?? null;
    }
    return null;
  }, [hoveredZoneId, schematic.zones, selectedZone]);

  return (
    <>
      <section className="relative h-[100svh] w-full overflow-hidden">
        <LocationSchematic
          schematic={schematic}
          variant="immersive"
          selectedZoneId={selectedZoneId}
          hoveredZoneId={hoveredZoneId}
          onZoneSelect={setSelectedZoneId}
          onZoneHover={setHoveredZoneId}
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-field/88 via-field/25 to-field/78"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-field/80 via-transparent to-field/55"
        />

        <div className="pointer-events-none relative z-10 flex h-full flex-col pt-14 md:pt-[68px]">
          <div className="flex flex-1 flex-col gap-4 p-[var(--legacy-gutter)] md:gap-6">
            <div className="pointer-events-auto flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-xl">
                <SectionBackLink
                  href={LANDING_SECTIONS.locations}
                  className="text-sm text-coal transition-colors hover:text-orange"
                >
                  Back
                </SectionBackLink>
                <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-orange">
                  [ {location.name} ]
                </p>
                <h1 className="mt-2 text-[clamp(32px,5vw,52px)] font-extrabold leading-[1.02] tracking-[-0.03em] text-pitch">
                  {location.name} facility
                </h1>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-slate md:text-base">
                  {location.address}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={`tel:${location.phone.replace(/\D/g, "")}`}
                    className="inline-flex h-9 items-center rounded-[8px] border border-bone/80 bg-field/85 px-3.5 text-sm font-semibold text-pitch backdrop-blur-sm transition-colors hover:border-orange/40"
                  >
                    {location.phone}
                  </a>
                  <span className="inline-flex h-9 items-center rounded-[8px] border border-bone/80 bg-field/85 px-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-slate backdrop-blur-sm">
                    {location.square_footage.toLocaleString()} sq ft
                  </span>
                </div>
              </div>

              <p className="pointer-events-none hidden max-w-[220px] text-right text-[10px] font-bold uppercase tracking-[0.12em] text-smoke md:block">
                Drag to orbit · Click a room block
              </p>
            </div>

            <div className="relative z-20 flex flex-1 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="pointer-events-auto grid max-w-[280px] gap-3">
                <div className="rounded-[14px] border border-bone/80 bg-field/82 p-4 backdrop-blur-md">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange">
                    Hours
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {orderedHours.map(({ day, hours }) => (
                      <li
                        key={day}
                        className="flex items-center justify-between gap-4 text-sm"
                      >
                        <span className="font-semibold text-pitch">{day}</span>
                        <span className="text-slate">{hours}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[14px] border border-bone/80 bg-field/82 p-4 backdrop-blur-md">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange">
                    Amenities
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {location.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="rounded-full border border-bone bg-field/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-slate capitalize"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pointer-events-auto w-full max-w-[360px] lg:ml-auto">
                {previewZone ? (
                  <div className="overflow-hidden rounded-[16px] border border-bone/80 bg-field/90 shadow-[0_24px_64px_rgba(17,17,17,0.12)] backdrop-blur-md">
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={previewZone.imageUrl}
                        alt={`${previewZone.label} at ${location.name}`}
                        fill
                        sizes="360px"
                        className="object-cover"
                        priority={Boolean(selectedZone)}
                      />
                      {selectedZone ? (
                        <button
                          type="button"
                          onClick={() => setSelectedZoneId(null)}
                          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-bone/80 bg-field/90 text-pitch transition-colors hover:text-orange"
                          aria-label="Close room preview"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      ) : null}
                    </div>
                    <div className="border-t border-bone/80 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange">
                        {previewZone.label}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-slate">
                        {previewZone.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[16px] border border-dashed border-bone/90 bg-field/72 p-5 backdrop-blur-md">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange">
                      Explore the facility
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate">
                      Hover or click any block in the 3D schematic to preview that room.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {schematic.zones.map((zone) => (
                        <button
                          key={zone.id}
                          type="button"
                          onClick={() => setSelectedZoneId(zone.id)}
                          onMouseEnter={() => setHoveredZoneId(zone.id)}
                          onMouseLeave={() => setHoveredZoneId(null)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-bone bg-field/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-slate transition-colors hover:border-orange/40 hover:text-orange"
                        >
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: zone.color }}
                            aria-hidden
                          />
                          {zone.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {coaches.length > 0 ? (
              <div className="pointer-events-auto relative z-20 max-w-[320px] rounded-[14px] border border-bone/80 bg-field/82 p-4 backdrop-blur-md">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange">
                  Coaches on site
                </p>
                <ul className="mt-3 space-y-2.5">
                  {coaches.map((coach) => {
                    const name = getCoachDisplayName(coach);

                    return (
                      <li key={coach.slug}>
                        <Link
                          href={`/coaches/${coach.slug}`}
                          data-cursor="link"
                          className="group flex items-center gap-3 rounded-[10px] transition-colors"
                        >
                          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-bone/80 bg-chalk">
                            <CoachPhoto slug={coach.slug} name={name} sizes="36px" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-pitch transition-colors group-hover:text-orange">
                              {name}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-slate">
                              {coach.title}
                            </p>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="relative bg-field px-[var(--legacy-gutter)] py-12 md:py-16">
        {locationPrograms.length > 0 ? (
          <div className="mx-auto max-w-7xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange">
              Programs at {location.name}
            </p>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {locationPrograms.map(({ program, schedule, coaches: programCoaches }) => (
                <div
                  key={program.id}
                  className="rounded-[16px] border border-bone bg-chalk p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/programs/${program.slug}`}
                        data-cursor="link"
                        className="text-lg font-bold text-pitch transition-colors hover:text-orange"
                      >
                        {program.name}
                      </Link>
                      <p className="mt-1 text-sm text-slate">{program.description}</p>
                    </div>
                    <span className="text-lg font-extrabold text-orange">
                      {formatCurrency(program.monthly_price)}
                      <span className="text-xs font-bold text-orange/80">/mo</span>
                    </span>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {schedule.map((time) => (
                      <li
                        key={`${program.id}-${time}`}
                        className="rounded-[6px] border border-bone bg-field px-2.5 py-1 text-xs font-semibold text-pitch"
                      >
                        {time}
                      </li>
                    ))}
                  </ul>
                  {programCoaches.length > 0 ? (
                    <p className="mt-4 text-xs text-smoke">
                      Coaches:{" "}
                      {programCoaches.map((coach, index) => (
                        <span key={coach.slug}>
                          {index > 0 ? ", " : null}
                          <Link
                            href={`/coaches/${coach.slug}`}
                            data-cursor="link"
                            className="font-semibold text-slate transition-colors hover:text-orange"
                          >
                            {getCoachDisplayName(coach)}
                          </Link>
                        </span>
                      ))}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div
          id="book"
          className={`mx-auto max-w-7xl scroll-mt-28 rounded-[20px] border border-bone bg-chalk p-[clamp(24px,4vw,48px)] ${locationPrograms.length > 0 ? "mt-12" : ""}`}
        >
          <div className="mx-auto max-w-[760px]">
            <p className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-orange">
              [ Book a tour ]
            </p>
            <h2 className="mt-4 text-center text-[clamp(28px,4vw,40px)] font-extrabold tracking-[-0.02em] text-pitch">
              Start at {location.name}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-center text-sm leading-relaxed text-slate">
              We&apos;ll match your athlete with the right program and coach at this
              location. No obligation.
            </p>
            <div className="mt-8">
              <LeadCaptureForm
                locations={allLocations}
                programs={allPrograms}
                defaultLocationId={location.id}
                variant="landing"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
