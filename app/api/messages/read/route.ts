import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/guards";
import { demoStore } from "@/lib/demo/store";

export async function POST(request: Request) {
  try {
    await requireStaff();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { athlete_id, lead_id } = await request.json();
  demoStore.markThreadRead(athlete_id ?? null, lead_id ?? null);

  return NextResponse.json({ ok: true });
}
