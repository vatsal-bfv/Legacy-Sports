"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_PASSWORD, SCOUT_EMAIL } from "@/lib/constants";
import { SectionTexture } from "@/components/marketing/landing/SectionTexture";

const inputClassName =
  "h-[52px] rounded-[8px] border-[1.5px] border-bone bg-field text-pitch focus:border-orange focus:ring-4 focus:ring-orange/10";

const labelClassName =
  "text-[11px] font-bold uppercase tracking-[0.1em] text-slate";

export default function ScoutLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: fd.get("email"),
        password: fd.get("password"),
        role: "scout",
      }),
    });
    if (!res.ok) {
      setError("Invalid credentials");
      return;
    }
    router.push("/scout");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-center bg-ink px-[var(--legacy-gutter)] lg:flex">
        <SectionTexture pattern="grid" tone="dark" />
        <div className="relative">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange">
            [ Licensed Recruiting Data ]
          </p>
          <h1 className="legacy-display mt-6 text-[clamp(48px,6vw,72px)] uppercase leading-[0.95] text-ghost">
            Legacy
            <br />
            <span className="text-orange">Scout Portal</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-coal">
            Licensed athlete data from Legacy Sports Complex. Search, evaluate,
            and recruit with confidence.
          </p>
        </div>
      </div>

      <div className="relative flex w-full items-center justify-center bg-field px-[var(--legacy-gutter)] py-16 lg:w-1/2">
        <SectionTexture pattern="dots" tone="light" />
        <div className="relative w-full max-w-md">
          <div className="rounded-[20px] border border-bone bg-chalk p-[clamp(32px,5vw,48px)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-orange">
              [ Sign In ]
            </p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.03em] text-pitch">
              Welcome back
            </h2>
            <p className="mt-1 text-sm text-slate">Demo: Coach Mike Chen</p>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className={labelClassName}>
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={SCOUT_EMAIL}
                  className={inputClassName}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className={labelClassName}>
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  defaultValue={DEMO_PASSWORD}
                  className={inputClassName}
                  required
                />
              </div>
              {error && (
                <p className="text-sm font-medium text-red-600">{error}</p>
              )}
              <Button
                type="submit"
                variant="scout"
                className="h-14 w-full rounded-[8px] shadow-[0_8px_32px_rgba(255,90,31,0.20)] hover:shadow-[0_14px_40px_rgba(255,90,31,0.30)]"
              >
                Sign in
              </Button>
            </form>

            <p className="mt-6 text-xs text-smoke">
              Demo: {SCOUT_EMAIL} / {DEMO_PASSWORD}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
