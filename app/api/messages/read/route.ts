import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/guards";
import { demoStore } from "@/lib/demo/store";
import { apiLog } from "@/lib/server/api-logger";

export async function POST(request: Request) {
  const log = apiLog("POST /api/messages/read");

  try {
    await requireStaff();
  } catch {
    log.warn(401, "unauthorized");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { athlete_id, lead_id } = await request.json();
  log.request({ athlete_id: athlete_id ?? null, lead_id: lead_id ?? null });

  try {
    demoStore.markThreadRead(athlete_id ?? null, lead_id ?? null);
    log.response(200);
    return NextResponse.json({ ok: true });
  } catch (error) {
    log.error(500, error, { athlete_id, lead_id });
    return NextResponse.json({ error: "Mark read failed" }, { status: 500 });
  }
}
