import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/guards";
import { demoStore } from "@/lib/demo/store";
import { generateDraftMessage } from "@/lib/ai/query-engine";
import { apiLog } from "@/lib/server/api-logger";

const CACHED_SUGGESTIONS: Record<string, string> = {
  athlete: "Thanks for staying engaged! Based on recent training data, progress is trending well — let's keep the momentum going this week.",
  lead: "Thanks for your interest in Legacy Sports Complex! I'd love to schedule a free assessment at your preferred location. What day works best?",
  tyler: "Hi Jennifer — Tyler's squat PR at 245 shows real commitment. We missed him Tue/Thu; can we get one session in this week to keep the streak alive?",
};

export async function POST(request: Request) {
  const log = apiLog("POST /api/messages/suggest");

  try {
    await requireStaff();
  } catch {
    log.warn(401, "unauthorized");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { athlete_id, lead_id, thread_type } = await request.json();
  log.request({ athlete_id, lead_id, thread_type });

  try {
    if (athlete_id) {
      const athlete = demoStore.athletes.find((a) => a.id === athlete_id);
      if (athlete?.status === "at_risk") {
        log.response(200, { cached: true, reason: "at_risk_athlete" });
        return NextResponse.json({
          suggestion: CACHED_SUGGESTIONS.tyler,
          cached: true,
        });
      }
      const prompt = `Write a brief SMS reply (max 280 chars) from a coach to parent of ${athlete?.first_name ?? "athlete"} continuing an ongoing training conversation. Friendly, specific, professional.`;
      const suggestion = await generateDraftMessage(prompt);
      log.response(200, { cached: false, length: suggestion.length });
      return NextResponse.json({ suggestion, cached: false });
    }

    if (lead_id || thread_type === "lead") {
      log.response(200, { cached: true, reason: "lead_thread" });
      return NextResponse.json({
        suggestion: CACHED_SUGGESTIONS.lead,
        cached: true,
      });
    }

    log.response(200, { cached: true, reason: "default_athlete" });
    return NextResponse.json({
      suggestion: CACHED_SUGGESTIONS.athlete,
      cached: true,
    });
  } catch (error) {
    log.error(500, error, { athlete_id, lead_id });
    return NextResponse.json({ error: "Suggest failed" }, { status: 500 });
  }
}
