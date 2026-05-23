import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/guards";
import { demoStore } from "@/lib/demo/store";
import { apiLog } from "@/lib/server/api-logger";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const log = apiLog("PATCH /api/leads/[id]");

  try {
    await requireStaff();
  } catch {
    log.warn(401, "unauthorized");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  log.request({ id, fields: Object.keys(body) });

  try {
    demoStore.updateLead(id, body);
    const lead = demoStore.leads.find((l) => l.id === id);
    log.response(200, { id, status: lead?.status ?? null });
    return NextResponse.json({ lead });
  } catch (error) {
    log.error(500, error, { id });
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
