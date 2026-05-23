import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("legacy_demo_role", "", { path: "/", maxAge: 0 });
  response.cookies.set("legacy_demo_email", "", { path: "/", maxAge: 0 });
  response.cookies.set("legacy_demo_name", "", { path: "/", maxAge: 0 });
  return response;
}
