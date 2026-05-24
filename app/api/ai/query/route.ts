import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/guards";
import { isAiConfigured } from "@/lib/ai/model";
import { runQuery, streamLegacyQuery } from "@/lib/ai/query-engine";
import { apiLog } from "@/lib/server/api-logger";

export const maxDuration = 60;

export async function POST(request: Request) {
  const log = apiLog("POST /api/ai/query");

  try {
    await requireStaff();
  } catch {
    log.warn(401, "unauthorized");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { query, scope, use_demo_cache } = await request.json();
  if (!query || typeof query !== "string") {
    log.warn(400, "query required");
    return NextResponse.json({ error: "Query required" }, { status: 400 });
  }

  log.request({
    query: query.slice(0, 120),
    scope: scope ?? null,
    use_demo_cache: Boolean(use_demo_cache),
  });

  try {
    const cachedResult = await runQuery(query, scope ?? {}, {
      use_demo_cache: Boolean(use_demo_cache),
    });

    if (cachedResult) {
      log.response(200, {
        cached: true,
        stream: false,
        responseType: cachedResult.response.type,
      });
      return NextResponse.json({
        response: cachedResult.response,
        cached: true,
        stream: false,
        scope,
      });
    }

    if (!isAiConfigured()) {
      log.response(503, { cached: false, ai: false });
      return NextResponse.json({
        response: {
          type: "narrative",
          markdown:
            "AI is not configured. Set GEMINI_API_KEY in .env.local, or use a suggested query for a demo response.",
        },
        cached: false,
        stream: false,
        scope,
      });
    }

    const result = streamLegacyQuery(query, scope ?? {});
    log.response(200, { cached: false, stream: true });
    return result.toUIMessageStreamResponse();
  } catch (error) {
    log.error(500, error, { query: query.slice(0, 120) });
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }
}
