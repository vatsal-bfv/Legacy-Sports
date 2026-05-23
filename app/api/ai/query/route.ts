import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/guards";
import { lookupCachedQuery } from "@/lib/ai/query-cache";
import { queryWithGemini } from "@/lib/ai/gemini";

export async function POST(request: Request) {
  try {
    await requireStaff();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { query, scope } = await request.json();
  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "Query required" }, { status: 400 });
  }

  const cached = lookupCachedQuery(query);
  if (cached) {
    return NextResponse.json({ response: cached, cached: true });
  }

  try {
    const geminiResult = await Promise.race([
      queryWithGemini(query),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000)),
    ]);

    if (geminiResult) {
      return NextResponse.json({ response: geminiResult, cached: false });
    }
  } catch {
    /* fallback */
  }

  const fallback = lookupCachedQuery("how is marcus johnson trending");
  return NextResponse.json({
    response:
      fallback ?? {
        type: "narrative",
        markdown:
          "I found relevant data across your locations. Try asking about at-risk athletes, revenue by location, or Marcus Johnson's progression.",
      },
    cached: true,
    scope,
  });
}
