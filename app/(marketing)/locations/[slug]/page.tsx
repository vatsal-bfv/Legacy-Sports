import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { demoStore } from "@/lib/demo/store";
import { LeadCaptureForm } from "@/components/shared/LeadCaptureForm";
import { SectionTexture } from "@/components/marketing/landing/SectionTexture";
import { LocationSchematic } from "@/components/marketing/locations/LocationSchematic";
import { getLocationSchematic } from "@/lib/marketing/location-schematics";

const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export function generateStaticParams() {
  return demoStore.locations.map((location) => ({ slug: location.slug }));
}

export default async function LocationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = demoStore.locations.find((entry) => entry.slug === slug);
  if (!location) {
    notFound();
  }

  const schematic = getLocationSchematic(slug);
  if (!schematic) {
    notFound();
  }

  const coaches = demoStore.coaches.filter(
    (coach) => coach.primary_location_id === location.id
  );

  const orderedHours = DAY_ORDER.map((day) => ({
    day,
    hours: location.hours[day] ?? "Closed",
  }));

  return (
    <div className="pt-14 md:pt-[68px]">
      <section className="relative overflow-hidden border-b border-bone bg-chalk">
        <SectionTexture pattern="grid" tone="light" />
        <div className="relative z-10 mx-auto max-w-7xl px-[var(--legacy-gutter)] py-12 md:py-16">
          <Link
            href="/locations"
            data-cursor="link"
            className="text-sm text-smoke transition-colors hover:text-orange"
          >
            All locations
          </Link>
          <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.14em] text-orange">
            [ {location.name} ]
          </p>
          <h1 className="mt-3 max-w-3xl text-[clamp(36px,5vw,56px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-pitch">
            {location.name} facility
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate">
            {location.address}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`tel:${location.phone.replace(/\D/g, "")}`}
              className="inline-flex h-10 items-center rounded-[8px] border border-bone bg-field px-4 text-sm font-semibold text-pitch transition-colors hover:border-gravel"
            >
              {location.phone}
            </a>
            <span className="inline-flex h-10 items-center rounded-[8px] border border-bone bg-field px-4 text-[11px] font-bold uppercase tracking-[0.1em] text-slate">
              {location.square_footage.toLocaleString()} sq ft
            </span>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-field px-[var(--legacy-gutter)] py-12 md:py-16">
        <SectionTexture pattern="dots" tone="light" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,260px)_minmax(0,1fr)_minmax(0,280px)] xl:items-start">
            <aside className="order-2 space-y-6 xl:order-1">
              <div className="rounded-[16px] border border-bone bg-chalk p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange">
                  Hours
                </p>
                <ul className="mt-4 space-y-2">
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

              <div className="rounded-[16px] border border-bone bg-chalk p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange">
                  Facility
                </p>
                <p className="mt-3 text-2xl font-extrabold text-pitch">
                  {location.square_footage.toLocaleString()}
                  <span className="ml-1 text-sm font-semibold text-smoke">sq ft</span>
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {location.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-full border border-bone bg-field px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-slate capitalize"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </aside>

            <div className="order-1 min-w-0 xl:order-2">
              <LocationSchematic schematic={schematic} />
            </div>

            <aside className="order-3 space-y-6">
              <div className="overflow-hidden rounded-[16px] border border-bone bg-chalk">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={location.photo_urls[0]}
                    alt={`${location.name} facility exterior`}
                    fill
                    sizes="(min-width: 1280px) 280px, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="border-t border-bone p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange">
                    On site
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate">
                    Pro-grade turf, strength floor, and athlete development zones —
                    mapped in the schematic.
                  </p>
                </div>
              </div>

              {coaches.length > 0 ? (
                <div className="rounded-[16px] border border-bone bg-chalk p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange">
                    Coaches
                  </p>
                  <ul className="mt-4 space-y-3">
                    {coaches.map((coach) => (
                      <li key={coach.id} className="text-sm">
                        <p className="font-semibold text-pitch">
                          {coach.first_name} {coach.last_name}
                        </p>
                        <p className="mt-0.5 text-slate capitalize">
                          {coach.specialties.join(" · ")}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </aside>
          </div>

          <div
            id="book"
            className="mt-12 scroll-mt-28 rounded-[20px] border border-bone bg-chalk p-[clamp(24px,4vw,48px)]"
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
                  locations={demoStore.locations}
                  programs={demoStore.programs}
                  defaultLocationId={location.id}
                  variant="landing"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
