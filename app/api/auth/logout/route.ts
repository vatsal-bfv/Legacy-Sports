import { NextResponse } from "next/server";
import { apiLog } from "@/lib/server/api-logger";

export async function POST() {
  const log = apiLog("POST /api/auth/logout");
  log.request();

  const response = NextResponse.json({ ok: true });
  response.cookies.set("legacy_demo_role", "", { path: "/", maxAge: 0 });
  response.cookies.set("legacy_demo_email", "", { path: "/", maxAge: 0 });
  response.cookies.set("legacy_demo_name", "", { path: "/", maxAge: 0 });

  log.response(200);
  return response;
}
