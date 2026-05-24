import { parseJsonEventStream } from "@ai-sdk/provider-utils";
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

  const tools = message.parts.filter(isToolUIPart).map((part) => ({
    id: part.toolCallId,
    toolName: getToolName(part),
    state: part.state,
    input: "input" in part ? part.input : undefined,
    errorText: "errorText" in part ? part.errorText : undefined,
  }));

  return { text, tools };
}

/** Consume a Vercel AI SDK UI message stream from POST /api/ai/query. */
export async function consumeQueryStream(
  response: Response,
  onUpdate: (snapshot: QueryStreamSnapshot) => void
): Promise<string> {
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
  const messageStream = readUIMessageStream({ stream: chunkStream });

  for await (const message of messageStream) {
    const snapshot = snapshotFromMessage(message);
    finalText = snapshot.text;
    onUpdate(snapshot);
  }

  return finalText;
}
