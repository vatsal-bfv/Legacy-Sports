import { requireStaff } from "@/lib/auth/guards";
import { streamNarrativeQuery } from "@/lib/ai/query-engine";
import { isAiConfigured } from "@/lib/ai/model";
import { apiLog } from "@/lib/server/api-logger";

export async function POST(request: Request) {
  const log = apiLog("POST /api/ai/query/stream");

  try {
    await requireStaff();
  } catch {
    log.warn(401, "unauthorized");
    return new Response("Unauthorized", { status: 401 });
  }

  if (!isAiConfigured()) {
    log.warn(503, "AI not configured");
    return new Response("AI not configured", { status: 503 });
  }

  const { query } = await request.json();
  if (!query || typeof query !== "string") {
    log.warn(400, "query required");
    return new Response("Query required", { status: 400 });
  }

  log.request({ query: query.slice(0, 120) });

  try {
    const result = streamNarrativeQuery(query);
    log.response(200, { streaming: true });
    return result.toTextStreamResponse();
  } catch (error) {
    log.error(500, error, { query: query.slice(0, 120) });
    return new Response("Stream failed", { status: 500 });
  }
}
