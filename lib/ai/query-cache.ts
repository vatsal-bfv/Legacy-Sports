export type QueryResponse =
  | {
      type: "chart";
      chartType: "line" | "bar";
      data: Record<string, unknown>[];
      x: string;
      y: string;
      title: string;
    }
  | {
      type: "list";
      items: Record<string, unknown>[];
      columns: { key: string; label: string }[];
      title?: string;
    }
  | { type: "narrative"; markdown: string }
  | { type: "mixed"; blocks: QueryResponse[] };

const QUERY_SUGGESTIONS = [
  "Which athletes are at risk of churning this week?",
  "Show me revenue by location this quarter",
  "Compare Suwanee and Lawrenceville member retention",
  "Compare Marcus vertical progression to other 2027 recruits in our system",
  "Show me every quarterback with a 40 under 4.7",
  "How is Marcus Johnson trending?",
  "Which coaches have the highest member retention?",
];

export function getCachedQuerySuggestions(): string[] {
  return QUERY_SUGGESTIONS;
}
