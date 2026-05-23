"use client";

import { useEffect, useState } from "react";

const TESTIMONIALS = [
  {
    quote:
      "Legacy turned my son from a bench player into a D1 recruit in 18 months.",
    author: "Jennifer C.",
    role: "Parent · Mesa",
  },
  {
    quote:
      "The data-driven coaching here is unlike anything in Arizona youth sports.",
    author: "Coach Mike Chen",
    role: "Sun Devil State University",
  },
  {
    quote:
      "Five locations, one standard of excellence. Our whole family trains here.",
    author: "Priya P.",
    role: "Parent · Chandler",
  },
];

export function TestimonialReel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % TESTIMONIALS.length),
      5000
    );
    return () => clearInterval(id);
  }, []);

  const t = TESTIMONIALS[index];

  return (
    <section className="border-y border-[#2A2D34] bg-[#0A0B0D] py-20 px-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xl italic text-[#F5F6F7] md:text-2xl">
          &ldquo;{t.quote}&rdquo;
        </p>
        <p className="mt-6 font-semibold">{t.author}</p>
        <p className="text-sm text-[#9DA3AE]">{t.role}</p>
        <div className="mt-6 flex justify-center gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Testimonial ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === index ? "bg-[#FF5A1F]" : "bg-[#2A2D34]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
