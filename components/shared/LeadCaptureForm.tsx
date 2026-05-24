"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Location, Program } from "@/lib/demo/types";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export function LeadCaptureForm({
  locations,
  programs,
  defaultLocationId,
  variant = "default",
}: {
  locations: Location[];
  programs: Program[];
  defaultLocationId?: string;
  variant?: "default" | "landing";
}) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const submitTextRef = useRef<HTMLSpanElement | null>(null);
  const successRef = useRef<HTMLDivElement | null>(null);
  const successCopyRef = useRef<HTMLDivElement | null>(null);
  const circleRef = useRef<SVGCircleElement | null>(null);
  const checkRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    if (variant !== "landing" || !submitTextRef.current) {
      return;
    }

    const node = submitTextRef.current;

    if (!loading) {
      node.textContent = "Book a free assessment";
      return;
    }

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.08 });

    tl.to(node, { text: ".", duration: 0.12, ease: "none" })
      .to(node, { text: "..", duration: 0.12, ease: "none" })
      .to(node, { text: "...", duration: 0.12, ease: "none" })
      .to(node, { text: "..", duration: 0.12, ease: "none" })
      .to(node, { text: ".", duration: 0.12, ease: "none" });

    return () => {
      tl.kill();
    };
  }, [loading, variant]);

  useEffect(() => {
    if (
      !submitted ||
      variant !== "landing" ||
      !circleRef.current ||
      !checkRef.current ||
      !successCopyRef.current
    ) {
      return;
    }

    gsap.set([circleRef.current, checkRef.current], { drawSVG: "0%" });
    gsap.set(successCopyRef.current, { opacity: 0 });

    const tl = gsap.timeline();

    tl.to(circleRef.current, {
      drawSVG: "100%",
      duration: 0.7,
      ease: "power2.out",
    })
      .to(
        checkRef.current,
        {
          drawSVG: "100%",
          duration: 0.5,
          ease: "power2.out",
        },
        ">-0.1"
      )
      .to(
        successCopyRef.current,
        {
          opacity: 1,
          duration: 0.6,
          ease: "legacyEase",
        },
        ">-0.05"
      );

    return () => {
      tl.kill();
    };
  }, [submitted, variant]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: fd.get("first_name"),
          last_name: fd.get("last_name"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          athlete_name: fd.get("athlete_name"),
          athlete_age: Number(fd.get("athlete_age")),
          interested_program_id: fd.get("interested_program_id"),
          interested_location_id: fd.get("interested_location_id"),
          notes: fd.get("notes"),
        }),
      });

      if (!response.ok) {
        throw new Error("Lead submission failed");
      }

      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    if (variant === "landing") {
      return (
        <div
          ref={successRef}
          className="flex min-h-[340px] flex-col items-center justify-center text-center"
        >
          <svg
            viewBox="0 0 64 64"
            className="h-16 w-16"
            aria-hidden="true"
          >
            <circle
              ref={circleRef}
              cx="32"
              cy="32"
              r="30"
              fill="none"
              stroke="var(--legacy-orange)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              ref={checkRef}
              d="M20 33 L29 42 L45 24"
              fill="none"
              stroke="var(--legacy-pitch)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div ref={successCopyRef} className="mt-6">
            <p className="text-2xl font-extrabold tracking-[-0.02em] text-pitch">
              We&apos;ll be in touch within 24 hours.
            </p>
            <p className="mt-3 text-[15px] font-light text-slate">
              Check your email - we&apos;ll send confirmation and next steps.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
        <p className="text-lg font-semibold text-emerald-400">Thank you!</p>
        <p className="mt-2 text-[#9DA3AE]">
          We&apos;ll be in touch within 24 hours.
        </p>
      </div>
    );
  }

  const landingFieldBase =
    "block w-full rounded-[8px] border-[1.5px] border-bone bg-field px-[18px] text-[15px] font-normal leading-normal text-pitch shadow-none placeholder:text-smoke transition-[border-color,box-shadow] duration-200 hover:border-gravel focus:border-orange focus:outline-none focus:ring-4 focus:ring-orange/10 disabled:cursor-not-allowed disabled:opacity-60";

  const landingInputClass = cn(landingFieldBase, "h-[52px]");

  const landingSelectClass = cn(
    landingFieldBase,
    "h-[52px] cursor-pointer appearance-none bg-size-[16px] bg-position-[right_18px_center] bg-no-repeat pr-12",
    "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%238c8880%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')]"
  );

  const landingTextareaClass = cn(
    landingFieldBase,
    "min-h-[120px] resize-y py-4 leading-[1.6]"
  );

  const landingLabelClass =
    "mb-2.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-slate";

  const landingFieldGroupClass = "min-w-0 w-full";

  if (variant === "landing") {
    return (
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-6">
        <div className="grid w-full gap-5 sm:grid-cols-2">
          <div className={landingFieldGroupClass}>
            <label htmlFor="first_name" className={landingLabelClass}>
              Parent First Name
            </label>
            <input
              id="first_name"
              name="first_name"
              required
              placeholder="Jordan"
              className={landingInputClass}
            />
          </div>
          <div className={landingFieldGroupClass}>
            <label htmlFor="last_name" className={landingLabelClass}>
              Parent Last Name
            </label>
            <input
              id="last_name"
              name="last_name"
              required
              placeholder="Parker"
              className={landingInputClass}
            />
          </div>
        </div>

        <div className="grid w-full gap-5 sm:grid-cols-2">
          <div className={landingFieldGroupClass}>
            <label htmlFor="email" className={landingLabelClass}>
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="parent@email.com"
              className={landingInputClass}
            />
          </div>
          <div className={landingFieldGroupClass}>
            <label htmlFor="phone" className={landingLabelClass}>
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(470) 555-0199"
              className={landingInputClass}
            />
          </div>
        </div>

        <div className="grid w-full gap-5 sm:grid-cols-2">
          <div className={landingFieldGroupClass}>
            <label htmlFor="athlete_name" className={landingLabelClass}>
              Athlete Name
            </label>
            <input
              id="athlete_name"
              name="athlete_name"
              placeholder="Mason Parker"
              className={landingInputClass}
            />
          </div>
          <div className={landingFieldGroupClass}>
            <label htmlFor="athlete_age" className={landingLabelClass}>
              Athlete Age
            </label>
            <input
              id="athlete_age"
              name="athlete_age"
              type="number"
              min={6}
              max={22}
              placeholder="15"
              className={landingInputClass}
            />
          </div>
        </div>

        <div className="grid w-full gap-5 sm:grid-cols-2">
          <div className={landingFieldGroupClass}>
            <label htmlFor="interested_program_id" className={landingLabelClass}>
              Program Interest
            </label>
            <select
              id="interested_program_id"
              name="interested_program_id"
              defaultValue={programs[0]?.id}
              required
              className={landingSelectClass}
            >
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </select>
          </div>
          <div className={landingFieldGroupClass}>
            <label htmlFor="interested_location_id" className={landingLabelClass}>
              Preferred Location
            </label>
            <select
              id="interested_location_id"
              name="interested_location_id"
              defaultValue={defaultLocationId ?? locations[0]?.id}
              required
              className={landingSelectClass}
            >
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={landingFieldGroupClass}>
          <label htmlFor="notes" className={landingLabelClass}>
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="Tell us about your athlete's sport, goals, or current training."
            className={landingTextareaClass}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-14 w-full items-center justify-center rounded-[8px] bg-pitch text-[11px] font-bold uppercase tracking-[0.14em] text-field transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:bg-orange hover:shadow-[0_10px_32px_rgba(255,90,31,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span ref={submitTextRef} aria-live="polite">
            Book a free assessment
          </span>
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="first_name">Parent first name</Label>
          <Input id="first_name" name="first_name" required />
        </div>
        <div>
          <Label htmlFor="last_name">Parent last name</Label>
          <Input id="last_name" name="last_name" required />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="athlete_name">Athlete name</Label>
          <Input id="athlete_name" name="athlete_name" />
        </div>
        <div>
          <Label htmlFor="athlete_age">Athlete age</Label>
          <Input id="athlete_age" name="athlete_age" type="number" min={8} max={22} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="interested_program_id">Program</Label>
          <select
            id="interested_program_id"
            name="interested_program_id"
            className="flex h-10 w-full rounded-md border border-[#2A2D34] bg-[#15171B] px-3 text-sm text-[#F5F6F7]"
            required
          >
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="interested_location_id">Location</Label>
          <select
            id="interested_location_id"
            name="interested_location_id"
            defaultValue={defaultLocationId}
            className="flex h-10 w-full rounded-md border border-[#2A2D34] bg-[#15171B] px-3 text-sm text-[#F5F6F7]"
            required
          >
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea id="notes" name="notes" rows={3} />
      </div>
      <Button type="submit" variant="marketing" size="lg" disabled={loading}>
        {loading ? "Submitting..." : "Book a free assessment"}
      </Button>
    </form>
  );
}
