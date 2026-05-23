"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Location, Program } from "@/lib/demo/types";

export function LeadCaptureForm({
  locations,
  programs,
  defaultLocationId,
}: {
  locations: Location[];
  programs: Program[];
  defaultLocationId?: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await fetch("/api/leads", {
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
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
        <p className="text-lg font-semibold text-emerald-400">Thank you!</p>
        <p className="mt-2 text-[#9DA3AE]">
          We&apos;ll be in touch within 24 hours.
        </p>
      </div>
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
