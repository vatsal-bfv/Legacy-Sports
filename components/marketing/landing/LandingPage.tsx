"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import Lenis from "lenis";
import {
  ArrowRight,
  Check,
  Cpu,
  Crosshair,
  Gauge,
  Radar,
  Rocket,
  ShieldCheck,
  UsersRound,
  Zap,
} from "lucide-react";
import type { Location, Program } from "@/lib/demo/types";
import { LeadCaptureForm } from "@/components/shared/LeadCaptureForm";
import { CoachPhoto } from "@/components/marketing/coaches/CoachPhoto";
import { coachCards } from "@/lib/marketing/coaches";
import {
  athleteCards,
  commandFeatures,
  credentialCards,
  familyTestimonials,
  heroMarqueeItems,
  programCards,
  statItems,
  testimonialMarqueeItems,
  trustSignals,
} from "@/lib/marketing/landing-data";
import {
  Draggable,
  gsap,
  ScrollTrigger,
  SplitText,
  useGSAP,
} from "@/lib/gsap";
import { scrollToTarget, setLenis } from "@/lib/lenis";
import { cn } from "@/lib/utils";
import { CustomCursor } from "./CustomCursor";
import { LoadingScreen } from "./LoadingScreen";
import { Marquee } from "./Marquee";
import { SectionTexture } from "./SectionTexture";

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}

function formatCounter(value: number, suffix = "") {
  return `${Math.round(value).toLocaleString("en-US")}${suffix}`;
}

function formatAmenity(amenity: string) {
  return amenity.replace(/\b\w/g, (char) => char.toUpperCase());
}

function getWeekdayHours(location: Location) {
  return `Mon-Fri - ${location.hours.Mon ?? "6am-9pm"}`;
}

function scrollToSection(target: string) {
  scrollToTarget(target, { offset: -80 });
}

function useRail(
  sectionRef: RefObject<HTMLElement | null>,
  railRef: RefObject<HTMLDivElement | null>,
  thumbRef: RefObject<HTMLDivElement | null>,
  cardSelector: string,
  reducedMotion: boolean
) {
  useEffect(() => {
    const rail = railRef.current;
    const thumb = thumbRef.current;

    if (!rail || !thumb) {
      return;
    }

    const updateProgress = () => {
      const maxScroll = rail.scrollWidth - rail.clientWidth;
      const thumbWidth =
        maxScroll <= 0
          ? 100
          : Math.max((rail.clientWidth / rail.scrollWidth) * 100, 12);
      const travel = 100 - thumbWidth;
      const left = maxScroll <= 0 ? 0 : (rail.scrollLeft / maxScroll) * travel;

      thumb.style.width = `${thumbWidth}%`;
      thumb.style.left = `${left}%`;
    };

    const resizeObserver = new ResizeObserver(updateProgress);
    resizeObserver.observe(rail);
    window.addEventListener("resize", updateProgress);
    rail.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    let draggable: Draggable | undefined;

    if (!reducedMotion) {
      draggable = Draggable.create(rail, {
        type: "scroll",
        inertia: true,
        edgeResistance: 0.85,
        minimumMovement: 4,
        allowNativeTouchScrolling: true,
        dragClickables: true,
        lockAxis: true,
        cursor: "grab",
        activeCursor: "grabbing",
      })[0];
    }

    return () => {
      draggable?.kill();
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateProgress);
      rail.removeEventListener("scroll", updateProgress);
    };
  }, [railRef, thumbRef, reducedMotion]);

  useGSAP(
    () => {
      const section = sectionRef.current;

      if (!section || reducedMotion) {
        return;
      }

      const cards = gsap.utils.toArray<HTMLElement>(cardSelector, section);

      gsap.fromTo(
        cards,
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "legacyEase",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );
}

function HeroSection({
  introReady,
  reducedMotion,
}: {
  introReady: boolean;
  reducedMotion: boolean;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const preLabelRef = useRef<HTMLParagraphElement | null>(null);
  const subheadRef = useRef<HTMLParagraphElement | null>(null);
  const trustBarRef = useRef<HTMLDivElement | null>(null);
  const scrollBarRef = useRef<HTMLDivElement | null>(null);
  const ctaRefs = useRef<HTMLButtonElement[]>([]);
  const lineRefs = useRef<HTMLSpanElement[]>([]);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setShowVideo(media.matches && !reducedMotion);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [reducedMotion]);

  useGSAP(
    () => {
      if (!introReady) {
        return;
      }

      const splitLines: SplitText[] = [];

      if (reducedMotion) {
        gsap.set(
          [preLabelRef.current, subheadRef.current, trustBarRef.current, ...ctaRefs.current],
          { opacity: 1, x: 0, y: 0 }
        );
      } else {
        const tl = gsap.timeline();

        tl.fromTo(
          preLabelRef.current,
          { opacity: 0, x: -16 },
          { opacity: 1, x: 0, duration: 0.7, ease: "legacyEase" },
          0.35
        );

        lineRefs.current.forEach((line, index) => {
          const split = new SplitText(line, { type: "chars" });
          splitLines.push(split);

          tl.fromTo(
            split.chars,
            { y: 100, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.85,
              stagger: 0.018,
              ease: "legacyEase",
            },
            0.55 + index * 0.42
          );
        });

        tl.fromTo(
          subheadRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: "legacyEase" },
          1.25
        ).fromTo(
          ctaRefs.current,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "legacyEase",
            stagger: 0.1,
          },
          1.45
        ).fromTo(
          trustBarRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: "legacyEase" },
          1.65
        );
      }

      if (scrollBarRef.current) {
        gsap.fromTo(
          scrollBarRef.current,
          { yPercent: -50 },
          {
            yPercent: 200,
            duration: 1.8,
            repeat: -1,
            ease: "none",
          }
        );
      }

      return () => {
        splitLines.forEach((split) => split.revert());
      };
    },
    { scope: sectionRef, dependencies: [introReady, reducedMotion] }
  );

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative min-h-[100dvh] overflow-hidden bg-ink text-ghost"
    >
      <Image
        src="https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=1600"
        alt="A wide shot of the Legacy Sports Complex training floor"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      {showVideo ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover object-center"
          poster="https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=1600"
        >
          <source
            src="https://videos.pexels.com/video-files/4761414/4761414-uhd_2560_1440_25fps.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      ) : null}

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,11,13,0.20)_0%,rgba(10,11,13,0.08)_25%,rgba(10,11,13,0.60)_65%,rgba(10,11,13,0.96)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,11,13,0.55)_0%,rgba(10,11,13,0)_50%)]" />
      <SectionTexture pattern="grid" tone="dark" className="z-[1] opacity-80" />

      <div className="relative z-10 flex min-h-[100dvh] flex-col justify-end px-[var(--legacy-gutter)] pb-[132px] pt-24">
        <p
          ref={preLabelRef}
          className="absolute left-[var(--legacy-gutter)] top-[clamp(80px,11%,110px)] text-[11px] font-bold uppercase tracking-[0.16em] text-orange"
        >
          [ ATLANTA&apos;S PREMIER ATHLETE DEVELOPMENT SYSTEM ]
        </p>

        <div className="max-w-[760px]">
          {["WHERE", "ATHLETES", "BECOME."].map((line, index) => (
            <div key={line} className="overflow-hidden">
              <span
                ref={(element) => {
                  if (element) {
                    lineRefs.current[index] = element;
                  }
                }}
                className={cn(
                  "legacy-display block text-[clamp(80px,11.5vw,160px)] uppercase leading-[0.9] tracking-[0.02em]",
                  index === 2 ? "text-orange" : "text-ghost"
                )}
              >
                {line}
              </span>
            </div>
          ))}

          <p
            ref={subheadRef}
            className="mt-6 max-w-[480px] text-[clamp(15px,1.6vw,18px)] font-light leading-[1.65] text-coal"
          >
            Five Georgia locations. 1,200+ athletes trained.
            <br />
            Owned by the pros. Powered by AI.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            <button
              ref={(element) => {
                if (element) {
                  ctaRefs.current[0] = element;
                }
              }}
              type="button"
              data-cursor="link"
              onClick={() => scrollToSection("#intake")}
              className="inline-flex h-14 items-center justify-center rounded-md bg-orange px-9 text-[11px] font-bold uppercase tracking-[0.12em] text-field shadow-[0_8px_32px_rgba(255,90,31,0.30)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:bg-ember hover:shadow-[0_14px_40px_rgba(255,90,31,0.38)]"
            >
              Book A Free Assessment
            </button>
            <button
              ref={(element) => {
                if (element) {
                  ctaRefs.current[1] = element;
                }
              }}
              type="button"
              data-cursor="link"
              onClick={() => scrollToSection("#programs")}
              className="inline-flex h-14 items-center justify-center rounded-md border border-ghost/25 bg-transparent px-9 text-[11px] font-bold uppercase tracking-[0.12em] text-ghost transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-ghost/70 hover:bg-ghost/6"
            >
              Explore Programs <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={trustBarRef}
        className="absolute inset-x-0 bottom-[38px] z-10 flex h-14 items-center justify-between border-t border-ghost/8 px-[var(--legacy-gutter)]"
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ash">
          Edition 001 - SS 2026 Intake Open
        </p>
        <div className="hidden flex-col items-center sm:flex">
          <span className="mb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-ash">
            Scroll
          </span>
          <div className="relative h-9 w-px overflow-hidden bg-ghost/20">
            <div ref={scrollBarRef} className="absolute left-0 top-0 h-1/2 w-px bg-orange" />
          </div>
        </div>
        <p className="text-right text-[11px] font-normal tracking-[0.08em] text-ash">
          <span className="text-sm font-extrabold text-orange">3</span> Spots Remaining -
          {" "}
          Suwanee Intake
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 h-[38px] bg-orange">
        <Marquee
          items={heroMarqueeItems}
          duration={38}
          className="flex h-full items-center"
          itemClassName="text-[11px] font-bold tracking-[0.1em] text-field"
        />
      </div>
    </section>
  );
}

function StatStrip({ reducedMotion }: { reducedMotion: boolean }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const statRefs = useRef<HTMLSpanElement[]>([]);

  useGSAP(
    () => {
      const section = sectionRef.current;

      if (!section || reducedMotion) {
        statRefs.current.forEach((ref, index) => {
          ref.textContent = formatCounter(statItems[index].value, statItems[index].suffix);
        });
        return;
      }

      let played = false;

      ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
        once: true,
        onEnter: () => {
          if (played) {
            return;
          }

          played = true;

          statRefs.current.forEach((ref, index) => {
            const item = statItems[index];
            const counter = { value: 0 };

            gsap.to(counter, {
              value: item.value,
              duration: 1.8,
              delay: index * 0.15,
              ease: "power2.out",
              onUpdate: () => {
                ref.textContent = formatCounter(counter.value, item.suffix);
              },
            });
          });
        },
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-field px-[var(--legacy-gutter)] py-[clamp(72px,9vw,112px)]"
    >
      <SectionTexture pattern="dots" tone="light" />
      <div className="relative z-10">
      <p className="text-center text-[11px] font-bold uppercase tracking-[0.16em] text-orange">
        [ TRUSTED BY GEORGIA&apos;S MOST COMMITTED ATHLETES ]
      </p>
      <div className="mt-16 grid grid-cols-2 gap-y-12 lg:grid-cols-4 lg:gap-y-0">
        {statItems.map((item, index) => (
          <div
            key={item.label}
            className={cn(
              "relative text-center",
              index < statItems.length - 1 && "lg:border-r lg:border-bone"
            )}
          >
            <span
              ref={(element) => {
                if (element) {
                  statRefs.current[index] = element;
                }
              }}
              className="legacy-display block text-[clamp(64px,9vw,112px)] leading-none tracking-[0.02em] text-orange"
            >
              {formatCounter(item.value, item.suffix)}
            </span>
            <span className="mt-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-slate">
              {item.label}
            </span>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}

function BrandStatement({ reducedMotion }: { reducedMotion: boolean }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const watermarkRef = useRef<HTMLDivElement | null>(null);
  const paragraphRefs = useRef<HTMLParagraphElement[]>([]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const watermark = watermarkRef.current;
      const cards = gsap.utils.toArray<HTMLElement>(".brand-card", section);

      if (!section) {
        return;
      }

      if (!reducedMotion && watermark) {
        gsap.fromTo(
          watermark,
          { y: 40 },
          {
            y: -40,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.8,
            },
          }
        );

        gsap.fromTo(
          cards,
          { x: 40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "legacyEase",
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              once: true,
            },
          }
        );

        gsap.fromTo(
          paragraphRefs.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "legacyEase",
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
              once: true,
            },
          }
        );
      }
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden bg-ink px-[var(--legacy-gutter)] py-[clamp(100px,13vw,160px)] text-ghost scroll-mt-24"
    >
      <SectionTexture pattern="diagonal" tone="dark" />
      <div
        ref={watermarkRef}
        className="pointer-events-none absolute right-[var(--legacy-gutter)] top-1/2 z-[1] hidden -translate-y-1/2 whitespace-nowrap legacy-display text-[clamp(120px,20vw,280px)] tracking-[0.06em] text-ghost/4 lg:block"
      >
        LEGACY
      </div>

      <div className="relative z-10 grid gap-16 lg:grid-cols-[5fr_7fr] lg:gap-20">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-orange">
            [ 001 ]
          </span>
          <h2 className="mt-7 max-w-[340px] text-[clamp(24px,3.2vw,40px)] font-extrabold leading-[1.2] tracking-[-0.025em] text-ghost">
            The training ground for Georgia&apos;s next generation.
          </h2>
          <p
            ref={(element) => {
              if (element) {
                paragraphRefs.current[0] = element;
              }
            }}
            className="mt-6 max-w-[540px] text-[15px] font-light leading-[1.85] text-coal"
          >
            Legacy is not a gym. It is a complete development system - performance
            training, technical skills, recovery, recruiting exposure, and now an AI
            operating layer that tracks every athlete&apos;s trajectory from their first
            session to their college commitment.
          </p>
          <button
            type="button"
            data-cursor="link"
            onClick={() => scrollToSection("#coaches")}
            className="group relative mt-10 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.1em] text-orange"
          >
            Meet Our Coaches
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            <span className="absolute inset-x-0 bottom-[-3px] h-px origin-left scale-x-0 bg-orange transition-transform duration-300 group-hover:scale-x-100" />
          </button>
        </div>

        <div className="rounded-[14px] bg-steel p-px">
          <div className="grid gap-px">
            {credentialCards.map((card) => {
              const Icon =
                card.icon === "bolt" ? Zap : card.icon === "target" ? Crosshair : Cpu;

              return (
                <div
                  key={card.title}
                  className="brand-card flex items-start gap-5 bg-charcoal px-8 py-7"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-orange/10">
                    <Icon className="h-[22px] w-[22px] text-orange" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold tracking-[-0.01em] text-ghost">
                      {card.title}
                    </h3>
                    <p className="mt-1.5 max-w-[540px] text-[13px] leading-[1.6] text-coal">
                      {card.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgramsSection({ reducedMotion }: { reducedMotion: boolean }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const thumbRef = useRef<HTMLDivElement | null>(null);

  useRail(sectionRef, railRef, thumbRef, ".program-rail-card", reducedMotion);

  return (
    <section
      id="programs"
      ref={sectionRef}
      className="relative overflow-hidden bg-ink px-[var(--legacy-gutter)] py-[clamp(80px,10vw,140px)] text-ghost scroll-mt-24"
    >
      <SectionTexture pattern="grid" tone="dark" />
      <div className="relative z-10">
      <div className="mb-14">
        <div>
          <p className="legacy-section-label mb-4">[ PROGRAMS ]</p>
          <h2 className="text-[clamp(28px,4vw,48px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-ghost">
            <span className="block">Every level.</span>
            <span className="block">Every sport.</span>
            <span className="block text-orange">One system.</span>
          </h2>
        </div>
      </div>

      <div
        ref={railRef}
        data-cursor="drag"
        className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex w-max flex-nowrap snap-x snap-mandatory gap-5">
        {programCards.map((program) => {
          const Icon =
            program.icon === "rocket"
              ? Rocket
              : program.icon === "gauge"
                ? Gauge
                : program.icon === "radar"
                  ? Radar
                  : program.icon === "shield"
                    ? ShieldCheck
                    : UsersRound;

          return (
            <Link
              key={program.number}
              href={`/programs/${program.slug}`}
              data-cursor="link"
              className="program-rail-card group relative flex min-h-[380px] w-[clamp(260px,28vw,360px)] shrink-0 snap-start flex-col rounded-[14px] border border-steel bg-charcoal p-7 pb-6 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1.5 hover:border-orange hover:shadow-[0_16px_48px_rgba(0,0,0,0.25),0_0_0_1.5px_var(--legacy-orange)]"
            >
              <span className="pointer-events-none absolute right-6 top-4 legacy-display text-[64px] leading-none tracking-[0.02em] text-steel/40 transition-opacity duration-300 group-hover:opacity-20">
                {program.number}
              </span>
              <div className="mb-6 flex h-9 w-9 items-center justify-center rounded-[10px] bg-orange/10">
                <Icon className="h-5 w-5 text-orange" />
              </div>
              <h3 className="text-lg font-bold tracking-[-0.01em] text-ghost">
                {program.name}
              </h3>
              <p className="mt-1 text-xs text-ash">{program.meta}</p>
              <div className="my-6 h-px bg-steel" />
              <p className="line-clamp-2 max-w-[32ch] text-sm leading-[1.7] text-coal">
                {program.description}
              </p>
              <div className="mt-auto flex justify-end pt-8">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.1em] text-orange">
                  Learn More
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          );
        })}
        </div>
      </div>

      <div className="mt-7">
        <div className="relative h-0.5 rounded-full bg-steel">
          <div
            ref={thumbRef}
            className="absolute left-0 top-0 h-full rounded-full bg-orange transition-[width,left] duration-100"
          />
        </div>
      </div>
      </div>
    </section>
  );
}

function CoachesSection({ reducedMotion }: { reducedMotion: boolean }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const thumbRef = useRef<HTMLDivElement | null>(null);

  useRail(sectionRef, railRef, thumbRef, ".coach-rail-card", reducedMotion);

  return (
    <section
      id="coaches"
      ref={sectionRef}
      className="relative overflow-hidden bg-field px-[var(--legacy-gutter)] py-[clamp(100px,13vw,160px)] scroll-mt-24"
    >
      <SectionTexture pattern="dots" tone="light" />
      <div className="relative z-10 mb-14">
        <div>
          <p className="legacy-section-label mb-4">[ THE TEAM ]</p>
          <h2 className="legacy-display text-[clamp(56px,7.5vw,108px)] uppercase leading-[0.9] tracking-[0.02em]">
            <span className="block text-pitch">Built By</span>
            <span className="block text-orange">The Pros.</span>
          </h2>
          <p className="mt-6 max-w-[540px] text-[15px] font-light leading-[1.85] text-slate">
            NFL and MLB veterans, a CEO forged in professional MMA, and trainers
            who live the work every day — guiding your athlete&apos;s journey with
            expertise, motivation, and personalized coaching.
          </p>
        </div>
      </div>

      <div
        ref={railRef}
        data-cursor="drag"
        className="relative z-10 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex w-max flex-nowrap snap-x snap-mandatory gap-5">
          {coachCards.map((coach) => (
            <Link
              key={coach.slug}
              href={`/coaches/${coach.slug}`}
              data-cursor="link"
              className="coach-rail-card group w-[clamp(240px,26vw,320px)] shrink-0 snap-start overflow-hidden rounded-[14px] border border-bone bg-chalk transition-all duration-300 hover:-translate-y-1 hover:border-orange hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]"
            >
              <div className="relative h-[320px] overflow-hidden">
                <CoachPhoto
                  slug={coach.slug}
                  name={coach.name}
                  sizes="(min-width: 1024px) 25vw, 70vw"
                  imageClassName="transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,11,13,0.92)_0%,rgba(10,11,13,0)_55%)]" />
                {coach.isOwner ? (
                  <span className="absolute left-3.5 top-3.5 rounded-[4px] border border-orange/40 bg-ink/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-orange backdrop-blur-md">
                    Owner
                  </span>
                ) : null}
                <div className="absolute inset-x-0 bottom-0 px-4 pb-4">
                  <h3 className="text-xl font-extrabold tracking-[-0.01em] text-ghost">
                    {coach.name}
                  </h3>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-coal">
                    {coach.title}
                  </p>
                </div>
              </div>
              <div className="px-4 py-4">
                <p className="line-clamp-2 text-sm italic leading-relaxed text-slate">
                  &ldquo;{coach.quote}&rdquo;
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {coach.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="rounded-[4px] border border-bone bg-field px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-slate"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-7">
        <div className="relative h-0.5 rounded-full bg-bone">
          <div
            ref={thumbRef}
            className="absolute left-0 top-0 h-full rounded-full bg-orange transition-[width,left] duration-100"
          />
        </div>
      </div>
    </section>
  );
}

function LocationsSection({
  locations,
  reducedMotion,
}: {
  locations: Location[];
  reducedMotion: boolean;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;

      if (!section || reducedMotion) {
        return;
      }

      const cards = gsap.utils.toArray<HTMLElement>(".location-card", section);

      gsap.fromTo(
        cards,
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "legacyEase",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section
      id="locations"
      ref={sectionRef}
      className="relative overflow-hidden bg-field px-[var(--legacy-gutter)] py-[clamp(80px,10vw,140px)] scroll-mt-24"
    >
      <SectionTexture pattern="cross" tone="light" />
      <div className="relative z-10">
      <div className="mb-14">
        <div>
          <p className="legacy-section-label mb-4">[ 5 GEORGIA LOCATIONS ]</p>
          <h2 className="text-[clamp(28px,4vw,48px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-pitch">
            <span className="block">Train close to home.</span>
            <span className="block text-orange">Compete everywhere.</span>
          </h2>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {locations.map((location) => (
          <Link
            key={location.id}
            href={`/locations/${location.slug}`}
            data-cursor="image"
            className="location-card group flex h-[360px] flex-col overflow-hidden rounded-[14px] border border-bone bg-chalk transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:border-orange hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]"
          >
            <div className="relative basis-[60%] overflow-hidden">
              <Image
                src={location.photo_urls[0]}
                alt={`${location.name} Legacy Sports Complex facility interior with turf lanes and training equipment`}
                fill
                sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,11,13,0.7)_0%,rgba(10,11,13,0)_50%)]" />
            </div>
            <div className="basis-[40%] bg-chalk px-6 py-5">
              <h3 className="text-lg font-bold tracking-[-0.01em] text-pitch">
                {location.name}
              </h3>
              <p className="mt-1 text-[13px] text-smoke">{location.address}</p>
              <p className="mt-1 text-xs text-smoke">{getWeekdayHours(location)}</p>
              <div className="mt-4 flex items-center justify-between border-t border-bone pt-3.5">
                <div className="flex flex-wrap gap-1">
                  {location.amenities.slice(0, 2).map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-[4px] border border-bone bg-field px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-slate"
                    >
                      {formatAmenity(amenity)}
                    </span>
                  ))}
                </div>
                <span className="group inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.1em] text-orange">
                  Book A Tour
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      </div>
    </section>
  );
}

function AthleteResultsSection({ reducedMotion }: { reducedMotion: boolean }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const thumbRef = useRef<HTMLDivElement | null>(null);
  const watermarkRef = useRef<HTMLDivElement | null>(null);

  useRail(sectionRef, railRef, thumbRef, ".athlete-rail-card", reducedMotion);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const watermark = watermarkRef.current;

      if (!section || !watermark || reducedMotion) {
        return;
      }

      gsap.fromTo(
        watermark,
        { y: 60 },
        {
          y: -60,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        }
      );
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section
      id="athletes"
      ref={sectionRef}
      className="relative overflow-hidden bg-ink px-[var(--legacy-gutter)] py-[clamp(100px,13vw,160px)] text-ghost scroll-mt-24"
    >
      <SectionTexture pattern="diagonal" tone="dark" />
      <div
        ref={watermarkRef}
        className="pointer-events-none absolute bottom-[clamp(40px,6vw,80px)] right-[var(--legacy-gutter)] z-[1] hidden legacy-display text-[clamp(200px,30vw,400px)] leading-none tracking-[0.02em] text-ghost/3 lg:block"
      >
        01
      </div>

      <div className="relative z-10 grid gap-14 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <div>
          <p className="legacy-section-label mb-7">[ RESULTS ]</p>
          <h2 className="max-w-[420px] text-[clamp(24px,3.2vw,40px)] font-extrabold leading-[1.2] tracking-[-0.025em] text-ghost">
            Where Georgia&apos;s best athletes were built.
          </h2>
          <p className="mt-6 max-w-[540px] text-[15px] font-light leading-[1.85] text-coal">
            From first combine to college signing day - every milestone is tracked,
            every improvement is measured.
          </p>

          <div className="mt-12 flex flex-col gap-4">
            {[
              { value: "12", label: "Athletes with D1 offers this year" },
              { value: "88%", label: "Athlete retention rate" },
              {
                value: "4.5x",
                label: "Average measurables improvement over 6 months",
              },
            ].map((item) => (
              <div key={item.label} className="flex items-baseline gap-3">
                <span className="legacy-display text-[40px] leading-none text-orange">
                  {item.value}
                </span>
                <span className="text-sm text-coal">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div
            ref={railRef}
            data-cursor="drag"
            className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex w-max flex-nowrap snap-x snap-mandatory gap-5">
            {athleteCards.map((athlete) => (
              <Link
                key={athlete.slug}
                href={`/athletes/${athlete.slug}`}
                data-cursor="link"
                className="athlete-rail-card group w-[clamp(220px,24vw,300px)] shrink-0 snap-start overflow-hidden rounded-[14px] border border-steel bg-charcoal transition-colors duration-300 hover:border-orange/50"
              >
                <div className="relative h-[300px] overflow-hidden">
                  <Image
                    src={athlete.image}
                    alt={`Portrait of ${athlete.name}, a Legacy athlete`}
                    fill
                    sizes="(min-width: 1024px) 25vw, 70vw"
                    className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,11,13,0.9)_0%,rgba(10,11,13,0)_55%)]" />
                  <span className="absolute left-3.5 top-3.5 rounded-[4px] border border-steel bg-ink/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-ghost backdrop-blur-md">
                    {athlete.sport}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 px-4 pb-4">
                    <h3 className="legacy-display text-[28px] leading-none tracking-[0.02em] text-ghost">
                      {athlete.name}
                    </h3>
                    <p className="mt-1 text-xs text-coal">{athlete.school}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 border-t border-steel px-4 py-3.5">
                  {athlete.stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="text-base font-extrabold text-ghost">{stat.value}</p>
                      <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-ash">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </Link>
            ))}
            </div>
          </div>
          <div className="mt-7">
            <div className="relative h-0.5 rounded-full bg-steel">
              <div
                ref={thumbRef}
                className="absolute left-0 top-0 h-full rounded-full bg-orange transition-[width,left] duration-100"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ reducedMotion }: { reducedMotion: boolean }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const quoteRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % familyTestimonials.length);
    }, 5500);

    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!quoteRef.current) {
      return;
    }

    gsap.fromTo(
      quoteRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.out" }
    );
  }, [index]);

  useGSAP(
    () => {
      if (!headlineRef.current || reducedMotion) {
        return;
      }

      const split = new SplitText(headlineRef.current, { type: "words" });

      gsap.fromTo(
        split.words,
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.06,
          ease: "legacyEase",
          scrollTrigger: {
            trigger: headlineRef.current,
            start: "top 82%",
            once: true,
          },
        }
      );

      return () => split.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  const testimonial = familyTestimonials[index];

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative overflow-hidden bg-field px-[var(--legacy-gutter)] py-[clamp(80px,10vw,140px)] scroll-mt-24"
    >
      <SectionTexture pattern="radial" tone="light" />
      <div className="relative z-10">
      <p className="text-center text-[11px] font-bold uppercase tracking-[0.16em] text-orange">
        [ WHAT FAMILIES SAY ]
      </p>
      <h2
        ref={headlineRef}
        className="legacy-display mx-auto mt-4 max-w-[680px] text-center text-[clamp(56px,8vw,112px)] uppercase leading-[0.93] tracking-[0.02em] text-pitch"
      >
        Results speak.
      </h2>

      <div ref={quoteRef} className="mx-auto mt-[72px] max-w-[680px] text-center">
        <span className="block text-[100px] font-extrabold leading-none text-orange">
          &quot;
        </span>
        <p className="text-[clamp(18px,2.2vw,26px)] font-light italic leading-[1.6] text-pitch">
          {testimonial.quote}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <Image
            src={testimonial.avatar}
            alt={`Portrait of ${testimonial.name}`}
            width={44}
            height={44}
            className="h-11 w-11 rounded-full border border-bone bg-chalk object-cover"
          />
          <span className="text-[15px] font-semibold text-pitch">{testimonial.name}</span>
          <span className="h-3.5 w-px bg-gravel" />
          <span className="text-sm text-smoke">{testimonial.role}</span>
        </div>
      </div>

      <div className="mt-10 flex justify-center gap-2">
        {familyTestimonials.map((item, testimonialIndex) => (
          <button
            key={item.name}
            type="button"
            aria-label={`Show testimonial ${testimonialIndex + 1}`}
            onClick={() => setIndex(testimonialIndex)}
            className={cn(
              "h-2 rounded-full bg-gravel transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
              testimonialIndex === index ? "w-7 bg-orange" : "w-2"
            )}
          />
        ))}
      </div>

      <div className="mt-20 h-11 border-y border-bone bg-chalk">
        <Marquee
          items={testimonialMarqueeItems}
          duration={42}
          reverse
          className="flex h-full items-center"
          itemClassName="text-base italic tracking-[0.04em] text-gravel"
        />
      </div>
      </div>
    </section>
  );
}

function CommandSection({ reducedMotion }: { reducedMotion: boolean }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const mockRef = useRef<HTMLDivElement | null>(null);
  const featureRefs = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      const section = sectionRef.current;

      if (!section || reducedMotion) {
        return;
      }

      gsap.fromTo(
        mockRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "legacyEase",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        featureRefs.current,
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.07,
          ease: "legacyEase",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section
      id="command"
      ref={sectionRef}
      className="relative overflow-hidden bg-ink px-[var(--legacy-gutter)] py-[clamp(100px,13vw,160px)] text-ghost scroll-mt-24"
    >
      <SectionTexture pattern="cross" tone="dark" />
      <div className="relative z-10 grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div>
          <p className="legacy-section-label mb-7">[ LEGACY COMMAND ]</p>
          <h2 className="legacy-display text-[clamp(40px,5.5vw,80px)] uppercase leading-[0.93] tracking-[0.02em]">
            <span className="block text-ghost">Your Athlete&apos;s</span>
            <span className="block text-orange">Entire Story.</span>
            <span className="block text-ghost">In One Place.</span>
          </h2>
          <p className="mt-8 max-w-[420px] text-[15px] font-light leading-[1.85] text-coal">
            Every measurable. Every session. Every wearable data point. Coach notes.
            Video clips. Recruiting contacts. Legacy Command is the operating system
            for modern athlete development - and it replaces six tools you&apos;re probably
            paying for right now.
          </p>

          <div className="mt-12 flex flex-col gap-3">
            {commandFeatures.map((feature, index) => (
              <div
                key={feature}
                ref={(element) => {
                  if (element) {
                    featureRefs.current[index] = element;
                  }
                }}
                className="flex items-center gap-3"
              >
                <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-orange/12">
                  <Check className="h-2.5 w-2.5 text-orange" />
                </div>
                <span className="text-sm text-coal">{feature}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            data-cursor="link"
            onClick={() => scrollToSection("#intake")}
            className="mt-12 inline-flex h-14 items-center justify-center rounded-md bg-orange px-9 text-[11px] font-bold uppercase tracking-[0.12em] text-field transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:bg-ember hover:shadow-[0_14px_40px_rgba(255,90,31,0.38)]"
          >
            Request A Demo
          </button>
        </div>

        <div
          ref={mockRef}
          className="relative overflow-hidden rounded-[20px] border border-steel bg-charcoal"
        >
          <div className="flex h-7 items-center gap-1.5 bg-[#0d0f14] px-3">
            <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
            <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
            <span className="h-2 w-2 rounded-full bg-[#10b981]" />
          </div>
          <div className="relative overflow-hidden p-6">
            <div className="rounded-[18px] border border-steel bg-ink/70 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-ash">
                    Command Center
                  </p>
                  <h3 className="mt-2 text-[28px] font-bold tracking-[-0.03em] text-ghost">
                    Good morning, Amber.
                  </h3>
                  <p className="mt-2 text-sm text-coal">
                    You have 14 at-risk athletes, 6 recruit-ready profiles, and 19
                    new leads waiting for assignment.
                  </p>
                </div>
                <div className="rounded-full border border-steel px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-orange">
                  Live
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-steel bg-charcoal p-5">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-ash">
                    At-Risk Members
                  </p>
                  <p className="mt-3 legacy-display text-[42px] leading-none text-orange">
                    14
                  </p>
                  <p className="mt-3 text-sm text-coal">
                    AI flagged a 3-day attendance drop at Suwanee and Lawrenceville.
                  </p>
                </div>
                <div className="rounded-2xl border border-steel bg-charcoal p-5">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-ash">
                    Athlete Spotlight
                  </p>
                  <p className="mt-3 text-lg font-bold text-ghost">
                    Marcus Johnson
                  </p>
                  <p className="mt-2 text-sm text-coal">
                    4.58 forty. 36 inch vertical. Three active D1 conversations.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-steel bg-charcoal px-5 py-4">
                <p className="text-[11px] uppercase tracking-[0.12em] text-ash">
                  Natural Language Query
                </p>
                <div className="mt-3 rounded-xl border border-orange/30 bg-ink/60 px-4 py-3 text-sm text-ghost">
                  show me all QBs under 4.7 with new scout activity
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(19,21,26,0)_60%,rgba(19,21,26,0.8)_100%)]" />
          </div>
        </div>
      </div>
    </section>
  );
}

function LeadCaptureSection({
  locations,
  programs,
  reducedMotion,
}: {
  locations: Location[];
  programs: Program[];
  reducedMotion: boolean;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!cardRef.current || reducedMotion) {
        return;
      }

      gsap.fromTo(
        cardRef.current,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "legacyEase",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 82%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section
      id="intake"
      ref={sectionRef}
      className="relative overflow-hidden bg-field px-[var(--legacy-gutter)] py-[clamp(100px,13vw,160px)] scroll-mt-24"
    >
      <SectionTexture pattern="noise" tone="light" />
      <div className="relative z-10 mx-auto max-w-[760px]">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-orange">
          [ START YOUR ATHLETE&apos;S JOURNEY ]
        </p>
        <h2 className="legacy-display mt-7 text-center text-[clamp(56px,8vw,112px)] uppercase leading-[0.93] tracking-[0.02em] text-pitch">
          Book a free
          <br />
          assessment.
        </h2>
        <p className="mx-auto mt-10 max-w-[440px] text-center text-base font-light leading-[1.7] text-slate">
          We&apos;ll match you with the right program, the right location, and the right
          coach. No obligation.
        </p>

        <div
          ref={cardRef}
          className="mt-12 rounded-[20px] border border-bone bg-chalk p-[clamp(32px,5vw,56px)]"
        >
          <LeadCaptureForm
            locations={locations}
            programs={programs}
            variant="landing"
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-center">
          {trustSignals.map((signal) => (
            <div key={signal} className="flex items-center gap-2 text-xs text-smoke">
              <Check className="h-3.5 w-3.5 text-orange" />
              <span className="tracking-[0.04em]">{signal}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingPage({
  locations,
  programs,
}: {
  locations: Location[];
  programs: Program[];
}) {
  const reducedMotion = useReducedMotion();
  const [introReady, setIntroReady] = useState(false);
  const locationsMemo = useMemo(() => locations.slice(0, 5), [locations]);

  useEffect(() => {
    if (reducedMotion) {
      setLenis(null);
      return;
    }

    const lenis = new Lenis({
      lerp: 0.075,
      duration: 1.3,
      easing: (value) => Math.min(1, 1.001 - Math.pow(2, -10 * value)),
      smoothWheel: true,
    });

    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    let frame = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frame = window.requestAnimationFrame(raf);
    };

    frame = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(frame);
      lenis.destroy();
      setLenis(null);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (!introReady) {
      return;
    }

    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [introReady]);

  useEffect(() => {
    if (!introReady) {
      return;
    }

    const hash = window.location.hash;
    if (!hash) {
      return;
    }

    const id = window.setTimeout(() => {
      scrollToTarget(hash, { offset: -80 });
    }, 160);

    return () => window.clearTimeout(id);
  }, [introReady]);

  return (
    <div className="bg-field text-pitch">
      <CustomCursor />
      <LoadingScreen onComplete={() => setIntroReady(true)} />
      <HeroSection introReady={introReady} reducedMotion={reducedMotion} />
      <StatStrip reducedMotion={reducedMotion} />
      <BrandStatement reducedMotion={reducedMotion} />
      <LocationsSection locations={locationsMemo} reducedMotion={reducedMotion} />
      <ProgramsSection reducedMotion={reducedMotion} />
      <CoachesSection reducedMotion={reducedMotion} />
      <AthleteResultsSection reducedMotion={reducedMotion} />
      <TestimonialsSection reducedMotion={reducedMotion} />
      <CommandSection reducedMotion={reducedMotion} />
      <LeadCaptureSection
        locations={locationsMemo}
        programs={programs}
        reducedMotion={reducedMotion}
      />
    </div>
  );
}
