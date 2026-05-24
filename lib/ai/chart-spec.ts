import { z } from "zod";
import { getToolName, isToolUIPart, type UIMessage } from "ai";
import type { QueryResponse } from "@/lib/ai/query-cache";

export const presentChartInputSchema = z.object({
  chartType: z.enum(["bar", "line"]),
  title: z.string().min(1),
  x: z.string().min(1),
  y: z.string().min(1),
  data: z
    .array(z.record(z.string(), z.union([z.string(), z.number()])))
    .min(1),
});

export type ChartResponse = Extract<QueryResponse, { type: "chart" }>;

export function parseChartOutput(output: unknown): ChartResponse | null {
  const parsed = presentChartInputSchema.safeParse(output);
  if (!parsed.success) return null;
  return { type: "chart", ...parsed.data };
}

/** While the agent is still running — narrative only, charts stay in the tool trace. */
export function buildLiveStreamingResponse(text: string): QueryResponse | null {
  const markdown = text.trim();
  if (!markdown) return null;
  return { type: "narrative", markdown: text };
}

function buildOrderedBlocksFromParts(
  parts: UIMessage["parts"]
): QueryResponse[] {
  const blocks: QueryResponse[] = [];
  let textBuffer = "";

  const flushText = () => {
    const markdown = textBuffer.trim();
    if (markdown) {
      blocks.push({ type: "narrative", markdown: textBuffer });
    }
    textBuffer = "";
  };

  for (const part of parts) {
    if (part.type === "text") {
      textBuffer += part.text ?? "";
      continue;
    }

    if (
      isToolUIPart(part) &&
      getToolName(part) === "present_chart" &&
      part.state === "output-available" &&
      "output" in part
    ) {
      flushText();
      const chart = parseChartOutput(part.output);
      if (chart) blocks.push(chart);
    }
  }

  flushText();
  return blocks;
}

function isInterleaved(blocks: QueryResponse[]): boolean {
  let seenChart = false;
  let seenNarrativeAfterChart = false;

  for (const block of blocks) {
    if (block.type === "chart") seenChart = true;
    if (block.type === "narrative" && seenChart) seenNarrativeAfterChart = true;
    if (block.type === "chart" && seenNarrativeAfterChart) return true;
  }

  return false;
}

function toMixed(blocks: QueryResponse[]): QueryResponse {
  if (blocks.length === 1) return blocks[0];
  return { type: "mixed", blocks };
}

/**
 * Final response after the stream completes.
 * Preserves part order when narrative and charts are truly interleaved;
 * otherwise puts the full narrative first and charts after (typical tool-then-answer flow).
 */
export function buildFinalQueryResponse(
  parts: UIMessage["parts"],
  fullText: string
): QueryResponse {
  const ordered = buildOrderedBlocksFromParts(parts);
  const charts = ordered.filter(
    (block): block is ChartResponse => block.type === "chart"
  );
  const markdown = fullText.trim() || "No response.";

  if (charts.length === 0) {
    return { type: "narrative", markdown };
  }

  if (isInterleaved(ordered)) {
    return toMixed(ordered);
  }

  return toMixed([{ type: "narrative", markdown: fullText }, ...charts]);
}
