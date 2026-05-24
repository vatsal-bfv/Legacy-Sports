/** Human-readable labels for Legacy Command AI tools. */
const TOOL_LABELS: Record<string, string> = {
  find_athlete_by_name: "Find athlete by name",
  get_athlete_profile: "Load athlete profile",
  query_athletes: "Search athletes",
  get_athlete_measurables: "Load measurables",
  get_athlete_attendance: "Load attendance",
  get_at_risk_athletes: "Fetch at-risk athletes",
  compare_locations: "Compare locations",
  list_locations: "List facilities",
  list_programs: "List programs",
  get_sessions: "Load schedule sessions",
  get_leads: "Load leads pipeline",
  get_messages: "Load communications",
  list_scout_users: "List scout users",
  get_coach_performance: "Load coach performance",
  get_failed_payments: "Check failed payments",
  summarize_athlete_progression: "Summarize athlete progression",
  search_coach_notes: "Search coach notes",
};

export function formatToolLabel(toolName: string): string {
  return (
    TOOL_LABELS[toolName] ??
    toolName.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

/** Keys we never show in the tool trace UI (internal IDs). */
const HIDDEN_INPUT_KEYS = new Set([
  "athlete_id",
  "lead_id",
  "coach_id",
]);

/** Tools whose only meaningful arg is athlete_id — omit input line entirely. */
const ATHLETE_ID_ONLY_TOOLS = new Set([
  "get_athlete_profile",
  "get_athlete_measurables",
  "get_athlete_attendance",
  "summarize_athlete_progression",
]);

export function formatToolInputSummary(
  toolName: string,
  input: unknown
): string | null {
  if (!input || typeof input !== "object") return null;
  const args = input as Record<string, unknown>;

  if (toolName === "find_athlete_by_name" && typeof args.name === "string") {
    return `"${args.name}"`;
  }
  if (toolName === "compare_locations" && typeof args.metric === "string") {
    return args.metric;
  }
  if (toolName === "get_leads" && typeof args.status === "string") {
    return args.status;
  }
  if (toolName === "query_athletes") {
    const bits = [args.sport, args.position, args.status].filter(Boolean);
    if (bits.length) return bits.join(", ");
  }
  if (toolName === "search_coach_notes" && typeof args.query === "string") {
    return `"${args.query.slice(0, 48)}${args.query.length > 48 ? "…" : ""}"`;
  }
  if (
    ATHLETE_ID_ONLY_TOOLS.has(toolName) &&
    typeof args.athlete_id === "string"
  ) {
    return null;
  }
  if (toolName === "get_messages") {
    if (typeof args.lead_id === "string") return "lead thread";
    if (typeof args.athlete_id === "string") return null;
  }

  const compact = Object.entries(args)
    .filter(
      ([k, v]) => v != null && v !== "" && !HIDDEN_INPUT_KEYS.has(k)
    )
    .slice(0, 2)
    .map(([k, v]) => `${k}: ${String(v).slice(0, 24)}`)
    .join(" · ");

  return compact || null;
}
