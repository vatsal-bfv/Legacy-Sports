import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/guards";
import { demoStore } from "@/lib/demo/store";
import { generateDraftMessage } from "@/lib/ai/query-engine";
import {
  buildSuggestPrompt,
  getThreadMessagesFromStore,
  sortThreadMessages,
  type ThreadMessageContext,
} from "@/lib/comms/suggest-prompt";
import { apiLog } from "@/lib/server/api-logger";

function resolveThreadMessages(
  athleteId?: string | null,
  leadId?: string | null,
  clientMessages?: ThreadMessageContext[]
): ThreadMessageContext[] {
  const fromClient = clientMessages?.length
    ? sortThreadMessages(clientMessages)
    : [];

  const fromStore = getThreadMessagesFromStore(
    demoStore.messages,
    athleteId,
    leadId
  );

  if (!fromClient.length) return fromStore;

  // Prefer client thread when provided (matches visible UI); fall back to store if longer.
  return fromClient.length >= fromStore.length ? fromClient : fromStore;
}

export async function POST(request: Request) {
  const log = apiLog("POST /api/messages/suggest");

  try {
    await requireStaff();
  } catch {
    log.warn(401, "unauthorized");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { athlete_id, lead_id, thread_type, thread_messages } =
    await request.json();
  log.request({
    athlete_id,
    lead_id,
    thread_type,
    thread_message_count: thread_messages?.length ?? 0,
  });

  try {
    const athlete = athlete_id
      ? demoStore.athletes.find((a) => a.id === athlete_id)
      : null;
    const lead = lead_id
      ? demoStore.leads.find((l) => l.id === lead_id)
      : null;

    const threadMessages = resolveThreadMessages(
      athlete_id,
      lead_id,
      thread_messages
    );

    const prompt = buildSuggestPrompt({
      athlete,
      lead,
      threadMessages,
    });

    const suggestion = await generateDraftMessage(prompt);
    log.response(200, {
      cached: false,
      length: suggestion.length,
      thread_messages_used: threadMessages.length,
    });
    return NextResponse.json({ suggestion, cached: false });
  } catch (error) {
    log.error(500, error, { athlete_id, lead_id });
    return NextResponse.json({ error: "Suggest failed" }, { status: 500 });
  }
}
