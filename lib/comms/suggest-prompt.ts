import type { Athlete, Lead, Message } from "@/lib/demo/types";

export type ThreadMessageContext = Pick<
  Message,
  "direction" | "from_party" | "body" | "created_at"
>;

export function formatThreadTranscript(messages: ThreadMessageContext[]): string {
  if (!messages.length) {
    return "(No prior messages in this thread)";
  }

  return messages
    .map((m) => {
      const speaker =
        m.direction === "inbound"
          ? m.from_party.replace(/_/g, " ")
          : "coach";
      return `${speaker}: ${m.body}`;
    })
    .join("\n");
}

export function buildSuggestPrompt({
  athlete,
  lead,
  threadMessages,
}: {
  athlete?: Athlete | null;
  lead?: Lead | null;
  threadMessages: ThreadMessageContext[];
}): string {
  const transcript = formatThreadTranscript(threadMessages);

  const recipient = lead
    ? `${lead.first_name} ${lead.last_name} (prospect)`
    : athlete
      ? `parent of ${athlete.first_name} ${athlete.last_name}`
      : "the recipient";

  const contextLines: string[] = [];

  if (lead) {
    contextLines.push(
      `Lead thread. Athlete interest: ${lead.athlete_name ?? "not specified"}, age ${lead.athlete_age ?? "—"}.`
    );
    if (lead.notes) contextLines.push(`Lead notes: ${lead.notes}`);
  }

  if (athlete) {
    contextLines.push(
      `Athlete: ${athlete.first_name} ${athlete.last_name}, status ${athlete.status}, ${athlete.sport}.`
    );
    if (athlete.status === "at_risk") {
      contextLines.push(
        "Athlete is at-risk — be warm, specific, and focused on re-engagement."
      );
    }
  }

  return `You are a coach at Legacy Sports Complex writing the next outbound message.

Recipient: ${recipient}
${contextLines.length ? `${contextLines.join("\n")}\n` : ""}
Conversation history (oldest to newest):
${transcript}

Draft the next coach reply as a brief SMS (max 280 characters). Continue the thread naturally based on what was said above. Friendly, professional, and specific where possible. Output only the message text — no quotes, labels, or subject line.`;
}

export function sortThreadMessages(
  messages: ThreadMessageContext[]
): ThreadMessageContext[] {
  return [...messages].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
}

export function getThreadMessagesFromStore(
  messages: Message[],
  athleteId?: string | null,
  leadId?: string | null
): ThreadMessageContext[] {
  const filtered = messages.filter((m) => {
    if (athleteId) return m.athlete_id === athleteId;
    if (leadId) return m.lead_id === leadId;
    return false;
  });

  return sortThreadMessages(filtered);
}
