import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/guards";
import { HERO_IDS } from "@/lib/constants";
import { TYLER_REENGAGEMENT_MESSAGE } from "@/lib/demo/data";
import { demoStore } from "@/lib/demo/store";
import { generateDraftMessage } from "@/lib/ai/gemini";
import { COACH_RODRIGUEZ_ID } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    await requireStaff();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { athlete_id, coach_id, context } = await request.json();

  if (
    athlete_id === HERO_IDS.tyler &&
    context === "reengagement"
  ) {
    return NextResponse.json({
      message: TYLER_REENGAGEMENT_MESSAGE,
      cached: true,
    });
  }

  const athlete = demoStore.athletes.find((a) => a.id === athlete_id);
  const coach = demoStore.coaches.find((c) => c.id === coach_id);

  const prompt = `Write an SMS to a parent (max 320 chars) from coach ${coach?.first_name ?? "Coach"} about athlete ${athlete?.first_name ?? "athlete"}. Context: ${context}. Coach voice: ${coach?.voice_sample ?? ""}`;

  const message = await generateDraftMessage(prompt);
  return NextResponse.json({ message, cached: false });
}

export async function PUT(request: Request) {
  try {
    await requireStaff();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { athlete_id, body, channel = "sms" } = await request.json();
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

  return NextResponse.json({ message: msg, sent: true });
}
