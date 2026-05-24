import { notFound } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { LeadCaptureForm } from "@/components/shared/LeadCaptureForm";
import { SectionBackLink } from "@/components/marketing/SectionBackLink";
import { CoachPhoto } from "@/components/marketing/coaches/CoachPhoto";
import { SectionTexture } from "@/components/marketing/landing/SectionTexture";
import { demoStore } from "@/lib/demo/store";
import {
  getCoachDisplayName,
  getCoachLocations,
  getCoachPrograms,
  getMarketingCoachBySlug,
  marketingCoaches,
} from "@/lib/marketing/coaches";
import { LANDING_SECTIONS } from "@/lib/marketing/landing-sections";
import { formatCurrency } from "@/lib/utils";

export function generateStaticParams() {
  return marketingCoaches.map((coach) => ({ slug: coach.slug }));
}

export default async function CoachDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const coach = getMarketingCoachBySlug(slug);

  if (!coach) {
    notFound();
  }

  const name = getCoachDisplayName(coach);
  const programs = getCoachPrograms(coach);
  const locations = getCoachLocations(coach);

  return (
    <div className="pt-14 md:pt-[68px]">
      <section className="relative overflow-hidden border-b border-bone bg-chalk">
        <SectionTexture pattern="grid" tone="light" />
        <div className="relative z-10 mx-auto max-w-7xl px-[var(--legacy-gutter)] py-12 md:py-16">
          <SectionBackLink
            href={LANDING_SECTIONS.coaches}
            className="text-sm text-smoke transition-colors hover:text-orange"
          >
            Back
          </SectionBackLink>
          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:items-start">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[16px] border border-bone">
              <CoachPhoto
                slug={coach.slug}
                name={name}
                sizes="(min-width: 1024px) 360px, 100vw"
                priority
              />
            </div>
            <div>
              {coach.isOwner ? (
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-orange">
                  [ Owner ]
                </p>
              ) : (
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-orange">
                  [ Coach ]
                </p>
              )}
              <h1 className="mt-3 text-[clamp(36px,5vw,56px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-pitch">
                {name}
                {coach.nickname ? (
                  <span className="mt-2 block text-[clamp(20px,2.5vw,28px)] font-bold text-smoke">
                    &ldquo;{coach.nickname}&rdquo;
                  </span>
                ) : null}
              </h1>
              <p className="mt-3 text-sm font-bold uppercase tracking-[0.12em] text-slate">
                {coach.title}
              </p>
              <blockquote className="mt-6 border-l-2 border-orange pl-5 text-[clamp(18px,2vw,22px)] font-light italic leading-[1.55] text-pitch">
                &ldquo;{coach.quote}&rdquo;
              </blockquote>
              <p className="mt-6 max-w-2xl text-[15px] leading-[1.85] text-slate">
                {coach.shortBio}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {coach.roles.map((role) => (
                  <span
                    key={role}
                    className="rounded-full border border-bone bg-field px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-slate"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-field px-[var(--legacy-gutter)] py-12 md:py-16">
        <SectionTexture pattern="dots" tone="light" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid gap-4 sm:grid-cols-3">
            {coach.highlights.map((item) => (
              <div
                key={item.label}
                className="rounded-[14px] border border-bone bg-chalk p-5 text-center"
              >
                <p className="legacy-display text-[clamp(32px,4vw,48px)] leading-none tracking-[0.02em] text-orange">
                  {item.value}
                </p>
                <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-slate">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange">
              History
            </p>
            <div className="mt-6 space-y-4">
              {coach.history.map((paragraph) => (
                <p
                  key={paragraph}
                  className="max-w-3xl text-[15px] leading-[1.85] text-slate"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-14 grid gap-10 xl:grid-cols-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange">
                Programs
              </p>
              <div className="mt-6 space-y-4">
                {programs.map((program) => (
                  <Link
                    key={program.id}
                    href={`/programs/${program.slug}`}
                    data-cursor="link"
                    className="block rounded-[14px] border border-bone bg-chalk p-5 transition-colors hover:border-orange"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-bold text-pitch">{program.name}</h2>
                        <p className="mt-1 text-sm text-slate">{program.description}</p>
                      </div>
                      <span className="text-base font-extrabold text-orange">
                        {formatCurrency(program.monthly_price)}
                        <span className="text-xs font-bold text-orange/80">/mo</span>
                      </span>
                    </div>
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.1em] text-smoke">
                      Ages {program.target_age_min}–{program.target_age_max}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange">
                Locations
              </p>
              <ul className="mt-6 space-y-4">
                {locations.map((location) => (
                  <li
                    key={location.id}
                    className="rounded-[14px] border border-bone bg-chalk p-5"
                  >
                    <Link
                      href={`/locations/${location.slug}`}
                      data-cursor="link"
                      className="text-base font-semibold text-pitch transition-colors hover:text-orange"
                    >
                      {location.name}
                    </Link>
                    <p className="mt-1 text-sm text-smoke">{location.address}</p>
                    <p className="mt-2 text-xs text-slate">{location.phone}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-[14px] border border-bone bg-chalk p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange">
                  Specialties
                </p>
                <ul className="mt-4 space-y-2">
                  {coach.specialties.map((specialty) => (
                    <li key={specialty} className="flex items-center gap-3 text-sm text-slate">
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-orange/12">
                        <Check className="h-2.5 w-2.5 text-orange" />
                      </div>
                      {specialty}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div
            id="book"
            className="mt-14 scroll-mt-28 rounded-[20px] border border-bone bg-chalk p-[clamp(24px,4vw,48px)]"
          >
            <div className="mx-auto max-w-[760px]">
              <p className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-orange">
                [ Train with {coach.firstName} ]
              </p>
              <h2 className="mt-4 text-center text-[clamp(28px,4vw,40px)] font-extrabold tracking-[-0.02em] text-pitch">
                Book a free assessment
              </h2>
              <p className="mx-auto mt-4 max-w-md text-center text-sm leading-relaxed text-slate">
                Tell us about your athlete and we&apos;ll connect you with the right
                program and location. No obligation.
              </p>
              <div className="mt-8">
                <LeadCaptureForm
                  locations={locations.length > 0 ? locations : demoStore.locations}
                  programs={programs.length > 0 ? programs : demoStore.programs}
                  defaultLocationId={locations[0]?.id}
                  defaultProgramId={programs[0]?.id}
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
