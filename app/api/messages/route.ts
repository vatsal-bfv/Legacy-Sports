import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/guards";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { demoStore } from "@/lib/demo/store";
import { apiLog } from "@/lib/server/api-logger";

export async function GET(request: Request) {
  const since = new URL(request.url).searchParams.get("since");

  try {
    await requireStaff();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (isSupabaseConfigured()) {
      const admin = createAdminClient();
      if (admin) {
        let query = admin.from("messages").select("*").order("created_at", {
          ascending: true,
        });
        if (since) {
          query = query.gt("created_at", since);
        }
        const { data, error } = await query;
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ messages: data ?? [] });
      }
    }

    const messages = since
      ? demoStore.getMessagesSince(since)
      : demoStore.messages;

    return NextResponse.json({ messages });
  } catch {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const log = apiLog("POST /api/messages");

  try {
    await requireStaff();
  } catch {
    log.warn(401, "unauthorized");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  log.request({
    channel: body.channel ?? "sms",
    athlete_id: body.athlete_id ?? null,
    lead_id: body.lead_id ?? null,
    bodyLength: body.body?.length ?? 0,
  });

  try {
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

    log.response(200, { messageId: msg.id });
    return NextResponse.json({ message: msg, sent: true });
  } catch (error) {
    log.error(500, error);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
