import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/guards";
import { HERO_IDS, COACH_RODRIGUEZ_ID } from "@/lib/constants";
import { TYLER_REENGAGEMENT_MESSAGE } from "@/lib/demo/hero-messages";
import { demoStore } from "@/lib/demo/store";
import { generateDraftMessage } from "@/lib/ai/query-engine";
import { apiLog } from "@/lib/server/api-logger";

export async function POST(request: Request) {
  const log = apiLog("POST /api/ai/draft-message");

  try {
    await requireStaff();
  } catch {
    log.warn(401, "unauthorized");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { athlete_id, coach_id, context } = await request.json();
  log.request({ athlete_id, coach_id, context });

  if (athlete_id === HERO_IDS.tyler && context === "reengagement") {
    log.response(200, { cached: true, athlete: "tyler" });
    return NextResponse.json({
      message: TYLER_REENGAGEMENT_MESSAGE,
      cached: true,
    });
  }

  try {
    const athlete = demoStore.athletes.find((a) => a.id === athlete_id);
    const coach = demoStore.coaches.find((c) => c.id === coach_id);
    const recentMeas = athlete
      ? demoStore.measurables
          .filter((m) => m.athlete_id === athlete_id)
          .slice(-3)
          .map((m) => `${m.metric}: ${m.value}${m.is_pr ? " (PR)" : ""}`)
          .join(", ")
      : "";
    const recentAtt = athlete
      ? demoStore.attendance
          .filter((a) => a.athlete_id === athlete_id)
          .slice(0, 5)
          .map((a) => a.status)
          .join(", ")
      : "";
    const recentNotes = athlete
      ? demoStore.coachNotes
          .filter((n) => n.athlete_id === athlete_id)
          .slice(-2)
          .map((n) => n.content)
          .join(" | ")
      : "";

    const prompt = `Write an SMS to a parent (max 320 chars) from coach ${coach?.first_name ?? "Coach"} about athlete ${athlete?.first_name ?? "athlete"}. Context: ${context}. Recent measurables: ${recentMeas}. Recent attendance: ${recentAtt}. Coach notes: ${recentNotes}. Coach voice sample: ${coach?.voice_sample?.slice(0, 400) ?? ""}`;

    const message = await generateDraftMessage(prompt);
    log.response(200, { cached: false, length: message.length });
    return NextResponse.json({ message, cached: false });
  } catch (error) {
    log.error(500, error, { athlete_id, context });
    return NextResponse.json({ error: "Draft failed" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const log = apiLog("PUT /api/ai/draft-message");

  try {
    await requireStaff();
  } catch {
    log.warn(401, "unauthorized");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { athlete_id, body, channel = "sms" } = await request.json();
  log.request({ athlete_id, channel, bodyLength: body?.length ?? 0 });

  try {
    const athlete = demoStore.athletes.find((a) => a.id === athlete_id);

    const msg = demoStore.addMessage({
      id: `msg-${Date.now()}`,
      created_at: new Date().toISOString(),
      channel,
      direction: "outbound",
      from_party: "coach",
      to_party: "parent",
      athlete_id,
      lead_id: null,
      subject: null,
      body,
      read_at: new Date().toISOString(),
      ai_generated: true,
    });

    void COACH_RODRIGUEZ_ID;
    void athlete;

    log.response(200, { messageId: msg.id });
    return NextResponse.json({ message: msg, sent: true });
  } catch (error) {
    log.error(500, error, { athlete_id });
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
