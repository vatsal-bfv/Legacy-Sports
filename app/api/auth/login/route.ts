import { NextResponse } from "next/server";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import {
  DEMO_PASSWORD,
  SCOUT_EMAIL,
  STAFF_EMAIL,
} from "@/lib/constants";
import { apiLog, authMeta } from "@/lib/server/api-logger";

export async function POST(request: Request) {
  const log = apiLog("POST /api/auth/login");
  const { email, password, role } = await request.json();
  log.request(authMeta({ email, role }));

  try {
    if (isSupabaseConfigured()) {
      const admin = createAdminClient();
      if (!admin) {
        log.error(500, "Auth not configured");
        return NextResponse.json({ error: "Auth not configured" }, { status: 500 });
      }
      const { data, error } = await admin.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        log.warn(401, "invalid credentials", { mode: "supabase" });
        return NextResponse.json({ error: error.message }, { status: 401 });
      }
      log.response(200, { mode: "supabase", userId: data.user?.id ?? null });
      return NextResponse.json({ user: data.user });
    }

    if (password !== DEMO_PASSWORD) {
      log.warn(401, "invalid credentials", { mode: "demo" });
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const expectedRole =
      email === STAFF_EMAIL
        ? "legacy_staff"
        : email === SCOUT_EMAIL
          ? "scout"
          : null;

    if (!expectedRole || (role && role !== expectedRole)) {
      log.warn(401, "invalid credentials", { mode: "demo", expectedRole });
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
    log.response(200, { mode: "demo", role: expectedRole });
    return response;
  } catch (error) {
    log.error(500, error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
