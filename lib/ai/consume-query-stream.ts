import { parseJsonEventStream } from "@ai-sdk/provider-utils";
import { buildQueryResponseFromStream } from "@/lib/ai/chart-spec";
import { formatToolOutputSummary } from "@/lib/ai/tool-output-summary";
import type { QueryResponse } from "@/lib/ai/query-cache";
import {
  getToolName,
  isToolUIPart,
  readUIMessageStream,
  uiMessageChunkSchema,
  type UIMessage,
  type UIMessageChunk,
} from "ai";

export type QueryToolTraceItem = {
  id: string;
  toolName: string;
  state: string;
  input?: unknown;
  output?: unknown;
  resultSummary?: string | null;
  errorText?: string;
};

export type QueryStreamSnapshot = {
  text: string;
  tools: QueryToolTraceItem[];
};

function snapshotFromMessage(message: UIMessage): QueryStreamSnapshot {
  const text = message.parts
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join("");

  const tools = message.parts.filter(isToolUIPart).map((part) => {
    const output =
      part.state === "output-available" && "output" in part
        ? part.output
        : undefined;
    const input = "input" in part ? part.input : undefined;

    return {
      id: part.toolCallId,
      toolName: getToolName(part),
      state: part.state,
      input,
      output,
      resultSummary:
        output !== undefined
          ? formatToolOutputSummary(getToolName(part), input, output)
          : null,
      errorText: "errorText" in part ? part.errorText : undefined,
    };
  });

  return { text, tools };
}

/** Consume a Vercel AI SDK UI message stream from POST /api/ai/query. */
export async function consumeQueryStream(
  response: Response,
  onUpdate: (snapshot: QueryStreamSnapshot) => void
): Promise<{ text: string; response: QueryResponse }> {
  if (!response.body) {
    throw new Error("Empty response body");
  }

  const chunkStream = parseJsonEventStream({
    stream: response.body,
    schema: uiMessageChunkSchema,
  }).pipeThrough(
    new TransformStream({
      transform(chunk, controller) {
        if (!chunk.success) {
          throw chunk.error;
        }
        controller.enqueue(chunk.value as UIMessageChunk);
      },
    })
  );

  let finalText = "";
  let finalTools: QueryToolTraceItem[] = [];
  const messageStream = readUIMessageStream({ stream: chunkStream });

  for await (const message of messageStream) {
    const snapshot = snapshotFromMessage(message);
    finalText = snapshot.text;
    finalTools = snapshot.tools;
    onUpdate(snapshot);
  }

  const built =
    buildQueryResponseFromStream(finalText, finalTools) ??
    ({
      type: "narrative",
      markdown: finalText.trim() || "No response.",
    } satisfies QueryResponse);

  return { text: finalText, response: built };
}
