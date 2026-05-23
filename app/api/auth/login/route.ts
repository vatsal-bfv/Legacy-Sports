import { NextResponse } from "next/server";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import {
  DEMO_PASSWORD,
  SCOUT_EMAIL,
  STAFF_EMAIL,
} from "@/lib/constants";

export async function POST(request: Request) {
  const { email, password, role } = await request.json();

  if (isSupabaseConfigured()) {
    const admin = createAdminClient();
    if (!admin) {
      return NextResponse.json({ error: "Auth not configured" }, { status: 500 });
    }
    const { data, error } = await admin.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ user: data.user });
  }

  if (password !== DEMO_PASSWORD) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const expectedRole =
    email === STAFF_EMAIL
      ? "legacy_staff"
      : email === SCOUT_EMAIL
        ? "scout"
        : null;

  if (!expectedRole || (role && role !== expectedRole)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const displayName =
    email === STAFF_EMAIL ? "Amber Chovanic" : "Coach Mike Chen";

  const response = NextResponse.json({ ok: true, role: expectedRole });
  response.cookies.set("legacy_demo_role", expectedRole, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });
  response.cookies.set("legacy_demo_email", email, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });
  response.cookies.set("legacy_demo_name", displayName, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });
  return response;
}
