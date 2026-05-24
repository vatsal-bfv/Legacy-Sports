import { requireStaff } from "@/lib/auth/guards";
import { streamLegacyQuery } from "@/lib/ai/query-engine";
import { isAiConfigured } from "@/lib/ai/model";
import { apiLog } from "@/lib/server/api-logger";

export const maxDuration = 60;

/** Legacy stream endpoint — prefer POST /api/ai/query which returns the same UI stream. */
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

  const { query, scope } = await request.json();
  if (!query || typeof query !== "string") {
    log.warn(400, "query required");
    return new Response("Query required", { status: 400 });
  }

  log.request({ query: query.slice(0, 120), scope: scope ?? null });

  try {
    const result = streamLegacyQuery(query, scope ?? {});
    log.response(200, { streaming: true });
    return result.toUIMessageStreamResponse();
  } catch (error) {
    log.error(500, error, { query: query.slice(0, 120) });
    return new Response("Stream failed", { status: 500 });
  }
}
