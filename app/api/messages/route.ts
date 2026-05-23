import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/guards";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { demoStore } from "@/lib/demo/store";

export async function GET(request: Request) {
  try {
    await requireStaff();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const since = new URL(request.url).searchParams.get("since");

  if (isSupabaseConfigured()) {
    const admin = createAdminClient();
    if (admin) {
      let query = admin.from("messages").select("*").order("created_at", {
        ascending: true,
      });
      if (since) {
        query = query.gt("created_at", since);
      }
      const { data } = await query;
      return NextResponse.json({ messages: data ?? [] });
    }
  }

  const messages = since
    ? demoStore.getMessagesSince(since)
    : demoStore.messages;

  return NextResponse.json({ messages });
}

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
    to_party: body.to_party ?? (body.lead_id ? "lead" : "parent"),
    athlete_id: body.athlete_id ?? null,
    lead_id: body.lead_id ?? null,
    subject: body.subject ?? null,
    body: body.body,
    read_at: new Date().toISOString(),
    ai_generated: body.ai_generated ?? false,
  });

  return NextResponse.json({ message: msg, sent: true });
}
