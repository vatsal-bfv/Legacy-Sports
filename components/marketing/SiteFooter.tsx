"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SVGProps } from "react";
import { demoStore } from "@/lib/demo/store";
import { LANDING_SECTIONS } from "@/lib/marketing/landing-sections";
import { scrollToTarget } from "@/lib/lenis";
import { SectionTexture } from "@/components/marketing/landing/SectionTexture";

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" {...props}>
      <path d="M5 4.5L19 19.5" strokeLinecap="round" />
      <path d="M19 4.5L5 19.5" strokeLinecap="round" />
    </svg>
  );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.35 20.5v-7.08h2.38l.36-2.76h-2.74V8.9c0-.8.22-1.35 1.37-1.35h1.46V5.08c-.25-.03-1.12-.08-2.13-.08-2.11 0-3.56 1.29-3.56 3.66v2h-2.4v2.76h2.4v7.08h2.86Z" />
    </svg>
  );
}

function FooterNavLink({
  href,
  children,
  className = "text-left hover:text-ghost",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome && href.startsWith("/#")) {
    return (
      <button
        type="button"
        data-cursor="link"
        onClick={() => scrollToTarget(href.slice(1), { offset: -80 })}
        className={className}
      >
        {children}
      </button>
    );
  }

  return (
    <Link href={href} data-cursor="link" className={className}>
      {children}
    </Link>
  );
}

export function SiteFooter() {
  const locations = demoStore.locations;

  return (
    <footer className="relative overflow-hidden bg-ink px-[var(--legacy-gutter)] pb-[clamp(28px,4vw,48px)] pt-[clamp(64px,8vw,96px)] text-ghost">
      <SectionTexture pattern="noise" tone="dark" />
      <div className="relative z-10">
        <div className="flex flex-col gap-12 border-b border-ghost/8 pb-14 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-[320px]">
            <span className="legacy-display text-4xl uppercase tracking-[0.1em] text-ghost">
              LEGACY
            </span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-ash">
              Sports Complex
            </span>
            <p className="mt-7 text-sm italic text-coal">Where athletes become recruits.</p>
            <div className="mt-7 flex gap-3">
              {[
                { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
                { label: "X", href: "https://x.com", icon: XIcon },
                { label: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-ghost/10 bg-ghost/6 text-coal transition-colors duration-200 hover:border-orange/30 hover:bg-orange/10 hover:text-orange"
                >
                  <item.icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-12 lg:gap-20">
            <div>
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.12em] text-orange">
                Train
              </p>
              <div className="flex flex-col gap-3 text-sm text-coal">
                <FooterNavLink href={LANDING_SECTIONS.programs}>Programs</FooterNavLink>
                <Link
                  href="/programs/hs-combine-prep"
                  data-cursor="link"
                  className="hover:text-ghost"
                >
                  HS Combine Prep
                </Link>
                <Link
                  href="/programs/college-recruit-track"
                  data-cursor="link"
                  className="hover:text-ghost"
                >
                  College Recruit
                </Link>
                <Link
                  href="/programs/team-training"
                  data-cursor="link"
                  className="hover:text-ghost"
                >
                  Team Training
                </Link>
                <FooterNavLink href="/#intake">Book a Session</FooterNavLink>
              </div>
            </div>
            <div>
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.12em] text-orange">
                Explore
              </p>
              <div className="flex flex-col gap-3 text-sm text-coal">
                <FooterNavLink href={LANDING_SECTIONS.locations}>Locations</FooterNavLink>
                {locations.slice(0, 4).map((location) => (
                  <Link
                    key={location.id}
                    href={`/locations/${location.slug}`}
                    data-cursor="link"
                    className="hover:text-ghost"
                  >
                    {location.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.12em] text-orange">
                Company
              </p>
              <div className="flex flex-col gap-3 text-sm text-coal">
                <FooterNavLink href="/#about">About Us</FooterNavLink>
                <FooterNavLink href={LANDING_SECTIONS.coaches}>Our Coaches</FooterNavLink>
                <FooterNavLink href="/#testimonials">Journal</FooterNavLink>
                <FooterNavLink href="/#intake">Contact</FooterNavLink>
                <Link href="/about" data-cursor="link" className="hover:text-ghost">
                  Press
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-8 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
          <p className="text-[11px] font-light text-ash">
            Copyright 2026 Legacy Sports Complex. All rights reserved.
          </p>
          <p className="text-sm italic text-coal">
            Owned by champions. Operated for champions.
          </p>
          <div className="flex justify-center gap-3 text-[11px] font-light text-ash lg:justify-end">
            <Link href="/" data-cursor="link" className="hover:text-ghost">
              Privacy
            </Link>
            <span>-</span>
            <Link href="/" data-cursor="link" className="hover:text-ghost">
              Terms
            </Link>
            <span>-</span>
            <Link href="/" data-cursor="link" className="hover:text-ghost">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
