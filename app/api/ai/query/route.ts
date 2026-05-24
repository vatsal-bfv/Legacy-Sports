import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/guards";
import { runQuery } from "@/lib/ai/query-engine";
import { apiLog } from "@/lib/server/api-logger";

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
    const result = await runQuery(query, scope ?? {}, {
      use_demo_cache: Boolean(use_demo_cache),
    });
    log.response(200, {
      cached: result.cached,
      stream: result.stream ?? false,
      responseType: result.response.type,
    });
    return NextResponse.json({
      response: result.response,
      cached: result.cached,
      stream: result.stream ?? false,
      scope,
    });
  } catch (error) {
    log.error(500, error, { query: query.slice(0, 120) });
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }
}
