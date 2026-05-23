import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/guards";
import { demoStore } from "@/lib/demo/store";

export async function POST(request: Request) {
  try {
    await requireStaff();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const msg = demoStore.addMessage({
    id: `msg-${Date.now()}`,
    created_at: new Date().toISOString(),
    channel: body.channel ?? "sms",
    direction: "outbound",
    from_party: "coach",
    to_party: body.to_party ?? "parent",
    athlete_id: body.athlete_id ?? null,
    lead_id: body.lead_id ?? null,
    subject: body.subject ?? null,
    body: body.body,
    read_at: new Date().toISOString(),
    ai_generated: body.ai_generated ?? false,
  });

  return NextResponse.json({ message: msg, sent: true });
}
