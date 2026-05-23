import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/guards";
import { demoStore } from "@/lib/demo/store";
import { generateDraftMessage } from "@/lib/ai/gemini";

const CACHED_SUGGESTIONS: Record<string, string> = {
  athlete: "Thanks for staying engaged! Based on recent training data, progress is trending well — let's keep the momentum going this week.",
  lead: "Thanks for your interest in Legacy Sports Complex! I'd love to schedule a free assessment at your preferred location. What day works best?",
  tyler: "Hi Jennifer — Tyler's squat PR at 245 shows real commitment. We missed him Tue/Thu; can we get one session in this week to keep the streak alive?",
};

export async function POST(request: Request) {
  try {
    await requireStaff();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { athlete_id, lead_id, thread_type } = await request.json();

  if (athlete_id) {
    const athlete = demoStore.athletes.find((a) => a.id === athlete_id);
    if (athlete?.status === "at_risk") {
      return NextResponse.json({
        suggestion: CACHED_SUGGESTIONS.tyler,
        cached: true,
      });
    }
    const prompt = `Write a brief SMS reply (max 280 chars) from a coach to parent of ${athlete?.first_name ?? "athlete"} continuing an ongoing training conversation. Friendly, specific, professional.`;
    const suggestion = await generateDraftMessage(prompt);
    return NextResponse.json({ suggestion, cached: false });
  }

  if (lead_id || thread_type === "lead") {
    return NextResponse.json({
      suggestion: CACHED_SUGGESTIONS.lead,
      cached: true,
    });
  }

  return NextResponse.json({
    suggestion: CACHED_SUGGESTIONS.athlete,
    cached: true,
  });
}
