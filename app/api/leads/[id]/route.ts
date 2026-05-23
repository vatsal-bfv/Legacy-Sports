import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/guards";
import { demoStore } from "@/lib/demo/store";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireStaff();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  demoStore.updateLead(id, body);

  const lead = demoStore.leads.find((l) => l.id === id);
  return NextResponse.json({ lead });
}
