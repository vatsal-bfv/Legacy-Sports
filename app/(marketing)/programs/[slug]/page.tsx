import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { demoStore } from "@/lib/demo/store";
import { LeadCaptureForm } from "@/components/shared/LeadCaptureForm";
import { SectionBackLink } from "@/components/marketing/SectionBackLink";
import { CoachPhoto } from "@/components/marketing/coaches/CoachPhoto";
import { SectionTexture } from "@/components/marketing/landing/SectionTexture";
import {
  getCoachDisplayName,
  getCoachLocations,
  getMarketingCoachesForProgram,
} from "@/lib/marketing/coaches";
import {
  getLocationOfferingsForProgram,
  getProgramBySlug,
  getProgramMarketingDetail,
} from "@/lib/marketing/programs";
import { LANDING_SECTIONS } from "@/lib/marketing/landing-sections";
import { formatCurrency } from "@/lib/utils";

export function generateStaticParams() {
  return demoStore.programs.map((program) => ({ slug: program.slug }));
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = getProgramBySlug(slug);

  if (!program) {
    notFound();
  }

  const detail = getProgramMarketingDetail(slug);
  const locationOfferings = getLocationOfferingsForProgram(program.id);
  const assignedCoaches = getMarketingCoachesForProgram(slug);

  return (
    <div className="pt-14 md:pt-[68px]">
      <section className="relative overflow-hidden border-b border-bone bg-chalk">
        <SectionTexture pattern="grid" tone="light" />
        <div className="relative z-10 mx-auto max-w-7xl px-[var(--legacy-gutter)] py-12 md:py-16">
          <SectionBackLink
            href={LANDING_SECTIONS.programs}
            className="text-sm text-smoke transition-colors hover:text-orange"
          >
            Back
          </SectionBackLink>
          <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.14em] text-orange">
            [ {program.name} ]
          </p>
          <h1 className="mt-3 max-w-3xl text-[clamp(36px,5vw,56px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-pitch">
            {detail.tagline}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate">
            {program.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex h-10 items-center rounded-[8px] border border-bone bg-field px-4 text-[11px] font-bold uppercase tracking-[0.1em] text-slate">
              Ages {program.target_age_min}–{program.target_age_max}
            </span>
            <span className="inline-flex h-10 items-center rounded-[8px] border border-bone bg-field px-4 text-[11px] font-bold uppercase tracking-[0.1em] text-slate">
              {detail.sessionLength} sessions
            </span>
            <span className="inline-flex h-10 items-center rounded-[8px] border border-orange/30 bg-orange/10 px-4 text-lg font-extrabold text-orange">
              {formatCurrency(program.monthly_price)}
              <span className="ml-1 text-[11px] font-bold uppercase tracking-[0.1em] text-orange/80">
                / month
              </span>
            </span>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-field px-[var(--legacy-gutter)] py-12 md:py-16">
        <SectionTexture pattern="dots" tone="light" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange">
                Overview
              </p>
              <p className="mt-4 max-w-2xl text-[15px] leading-[1.85] text-slate">
                {detail.overview}
              </p>

              <ul className="mt-8 space-y-3">
                {detail.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-3 text-sm text-slate">
                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-orange/12">
                      <Check className="h-2.5 w-2.5 text-orange" />
                    </div>
                    {highlight}
                  </li>
                ))}
              </ul>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[14px] border border-bone bg-chalk p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange">
                    Avg. age
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-pitch">
                    {detail.averageParticipantAge}
                  </p>
                  <p className="mt-1 text-xs text-smoke">years old</p>
                </div>
                <div className="rounded-[14px] border border-bone bg-chalk p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange">
                    Seats open
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-pitch">
                    {detail.seatsAvailable}
                  </p>
                  <p className="mt-1 text-xs text-smoke">
                    of {detail.seatsTotal} total
                  </p>
                </div>
                <div className="rounded-[14px] border border-bone bg-chalk p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange">
                    Frequency
                  </p>
                  <p className="mt-2 text-lg font-extrabold text-pitch">
                    {detail.sessionsPerWeek}
                  </p>
                  <p className="mt-1 text-xs text-smoke">per week</p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[16px] border border-bone bg-chalk">
              <div className="relative aspect-[4/3]">
                <Image
                  src={detail.image}
                  alt={`Athletes training in the ${program.name} program`}
                  fill
                  sizes="(min-width: 1024px) 420px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="mt-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange">
              Age batches
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {detail.ageBatches.map((batch) => (
                <div
                  key={batch.label}
                  className="rounded-[14px] border border-bone bg-chalk p-5"
                >
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-orange">
                    {batch.label}
                  </p>
                  <p className="mt-2 text-lg font-extrabold text-pitch">{batch.ages}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate">
                    {batch.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 grid gap-10 xl:grid-cols-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange">
                Locations &amp; schedule
              </p>
              <div className="mt-6 space-y-4">
                {locationOfferings.map(({ location, schedule }) => (
                  <div
                    key={location.id}
                    className="rounded-[14px] border border-bone bg-chalk p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <Link
                          href={`/locations/${location.slug}`}
                          data-cursor="link"
                          className="text-base font-semibold text-pitch transition-colors hover:text-orange"
                        >
                          {location.name}
                        </Link>
                        <p className="mt-1 text-sm text-smoke">{location.address}</p>
                      </div>
                      <span className="rounded-full border border-bone bg-field px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-slate">
                        {schedule.length} session{schedule.length === 1 ? "" : "s"}/wk
                      </span>
                    </div>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {schedule.map((time) => (
                        <li
                          key={`${location.id}-${time}`}
                          className="rounded-[6px] border border-bone bg-field px-2.5 py-1 text-xs font-semibold text-pitch"
                        >
                          {time}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange">
                Assigned coaches
              </p>
              <ul className="mt-6 space-y-4">
                {assignedCoaches.map((coach) => {
                  const name = getCoachDisplayName(coach);
                  const coachLocations = getCoachLocations(coach).filter((location) =>
                    locationOfferings.some(
                      (offering) => offering.location.id === location.id
                    )
                  );

                  return (
                    <li key={coach.slug}>
                      <Link
                        href={`/coaches/${coach.slug}`}
                        data-cursor="link"
                        className="flex gap-4 rounded-[14px] border border-bone bg-chalk p-5 transition-colors hover:border-orange"
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-bone">
                          <CoachPhoto slug={coach.slug} name={name} sizes="56px" />
                        </div>
                        <div>
                          <p className="font-semibold text-pitch">{name}</p>
                          <p className="mt-0.5 text-xs uppercase tracking-[0.1em] text-smoke">
                            {coach.title}
                          </p>
                          {coachLocations.length > 0 ? (
                            <p className="mt-1 text-sm text-slate">
                              {coachLocations.map((location) => location.name).join(" · ")}
                            </p>
                          ) : null}
                          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate">
                            {coach.shortBio}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div
            id="book"
            className="mt-14 scroll-mt-28 rounded-[20px] border border-bone bg-chalk p-[clamp(24px,4vw,48px)]"
          >
            <div className="mx-auto max-w-[760px]">
              <p className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-orange">
                [ Start in {program.name} ]
              </p>
              <h2 className="mt-4 text-center text-[clamp(28px,4vw,40px)] font-extrabold tracking-[-0.02em] text-pitch">
                Book a free assessment
              </h2>
              <p className="mx-auto mt-4 max-w-md text-center text-sm leading-relaxed text-slate">
                We&apos;ll match your athlete with the right location, batch, and coach.
                No obligation.
              </p>
              <div className="mt-8">
                <LeadCaptureForm
                  locations={demoStore.locations}
                  programs={demoStore.programs}
                  defaultProgramId={program.id}
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
