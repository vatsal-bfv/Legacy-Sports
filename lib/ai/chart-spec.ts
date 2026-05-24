import { z } from "zod";
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

type ToolWithOutput = {
  toolName: string;
  state: string;
  output?: unknown;
};

export function chartsFromTools(tools: ToolWithOutput[]): ChartResponse[] {
  return tools
    .filter(
      (t) =>
        t.toolName === "present_chart" &&
        t.state === "output-available" &&
        t.output != null
    )
    .map((t) => parseChartOutput(t.output))
    .filter((c): c is ChartResponse => c != null);
}

/** Merge streamed charts + markdown into a QueryResponse for the UI. */
export function buildQueryResponseFromStream(
  text: string,
  tools: ToolWithOutput[]
): QueryResponse | null {
  const charts = chartsFromTools(tools);
  const markdown = text.trim();

  if (charts.length === 0 && !markdown) return null;
  if (charts.length === 0) return { type: "narrative", markdown: text };

  const blocks: QueryResponse[] = [...charts];
  if (markdown) {
    blocks.push({ type: "narrative", markdown: text });
  }

  if (blocks.length === 1) return blocks[0];
  return { type: "mixed", blocks };
}
