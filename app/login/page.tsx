"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_PASSWORD, STAFF_EMAIL } from "@/lib/constants";

export default function StaffLoginPage() {
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
        role: "legacy_staff",
      }),
    });
    if (!res.ok) {
      setError("Invalid credentials");
      return;
    }
    window.location.href = "/command-os";
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0B0D] px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-[#2A2D34] bg-[#15171B] p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-widest text-[#3B82F6]">
            LEGACY COMMAND
          </h1>
          <p className="mt-2 text-sm text-[#9DA3AE]">Staff sign in</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={STAFF_EMAIL}
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
              required
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
        <p className="text-center text-xs text-[#9DA3AE]">
          Demo: {STAFF_EMAIL} / {DEMO_PASSWORD}
        </p>
      </div>
    </div>
  );
}
