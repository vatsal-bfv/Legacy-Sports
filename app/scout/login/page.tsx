"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_PASSWORD, SCOUT_EMAIL } from "@/lib/constants";

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
      <div className="hidden w-1/2 bg-[#1A2332] lg:flex lg:flex-col lg:justify-center lg:p-16">
        <h1 className="text-3xl font-bold text-white">Legacy Scout Portal</h1>
        <p className="mt-4 text-gray-300">
          Licensed athlete data from Legacy Sports Complex. Search, evaluate,
          and recruit with confidence.
        </p>
      </div>
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-2xl font-bold">Sign in</h2>
            <p className="text-sm text-gray-500">Demo: Coach Mike Chen</p>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={SCOUT_EMAIL}
                className="border-gray-300 bg-white text-gray-900"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                defaultValue={DEMO_PASSWORD}
                className="border-gray-300 bg-white text-gray-900"
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" variant="scout" className="w-full">
              Sign in
            </Button>
          </form>
          <p className="text-xs text-gray-400">
            Demo: {SCOUT_EMAIL} / {DEMO_PASSWORD}
          </p>
        </div>
      </div>
    </div>
  );
}
