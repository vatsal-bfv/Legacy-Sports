import { tool, stepCountIs, streamText, generateText } from "ai";
import { z } from "zod";
import { getModel, isAiConfigured } from "./model";
import {
  athleteToListItem,
  compareLocations,
  findAthleteByName,
  getAthleteAttendance,
  getAthleteMeasurables,
  getAthleteProfile,
  getAtRiskAthletes,
  getCoachPerformance,
  getFailedPayments,
  getLeads,
  getMessages,
  getSessions,
  listLocations,
  listPrograms,
  listScoutUsers,
  queryAthletes,
  searchNotesByQuery,
  summarizeAthleteProgression,
  type QueryScope,
} from "./data-access";
import { buildDomainContext } from "./domain-context";
import { logGeminiStep } from "./gemini-logger";
import { lookupCachedQuery, type QueryResponse } from "./query-cache";

export type QueryOptions = {
  /** Set true only when the user clicked a suggested demo query. */
  use_demo_cache?: boolean;
};

function buildSystemPrompt(scope: QueryScope = {}) {
  return `You are Legacy Command AI for Legacy Sports — a multi-location youth performance training company.

Always use the provided tools to fetch real data before answering. Never invent athletes, metrics, locations, or schedules.

${buildDomainContext(scope.location_id)}

Respond in clear markdown. Be concise and cite specific numbers from tool results. If data is missing, say so and suggest which tool or filter might help.`;
}

export function createLegacyTools(scope: QueryScope = {}) {
  const locationDefault = scope.location_id;

  return {
    find_athlete_by_name: tool({
      description:
        "Resolve athlete id(s) from a partial or full name. Call this before other athlete-specific tools when the user mentions a name.",
      inputSchema: z.object({ name: z.string() }),
      execute: async ({ name }) => findAthleteByName(name),
    }),
    get_athlete_profile: tool({
      description: "Full profile for one athlete by id",
      inputSchema: z.object({ athlete_id: z.string() }),
      execute: async ({ athlete_id }) => getAthleteProfile(athlete_id),
    }),
    query_athletes: tool({
      description: "Search athletes by filters",
      inputSchema: z.object({
        sport: z.string().optional(),
        position: z.string().optional(),
        age_min: z.number().optional(),
        age_max: z.number().optional(),
        location_id: z.string().optional(),
        status: z.string().optional(),
        recruit_status: z.string().optional(),
        measurable_metric: z.string().optional(),
        measurable_max: z.number().optional(),
        measurable_min: z.number().optional(),
      }),
      execute: async (filters) => {
        const threshold =
          filters.measurable_metric != null
            ? {
                metric: filters.measurable_metric,
                max: filters.measurable_max,
                min: filters.measurable_min,
              }
            : undefined;
        return queryAthletes({
          ...filters,
          location_id: filters.location_id ?? locationDefault,
          measurable_threshold: threshold,
        }).map(athleteToListItem);
      },
    }),
    get_athlete_measurables: tool({
      description: "Get measurables for an athlete",
      inputSchema: z.object({
        athlete_id: z.string(),
        metric: z.string().optional(),
        since: z.string().optional(),
      }),
      execute: async ({ athlete_id, metric, since }) =>
        getAthleteMeasurables(athlete_id, metric, since),
    }),
    get_athlete_attendance: tool({
      description: "Get attendance records for an athlete",
      inputSchema: z.object({
        athlete_id: z.string(),
        since: z.string().optional(),
      }),
      execute: async ({ athlete_id, since }) =>
        getAthleteAttendance(athlete_id, since),
    }),
    get_at_risk_athletes: tool({
      description: "Athletes with missed sessions / at-risk status",
      inputSchema: z.object({ location_id: z.string().optional() }),
      execute: async ({ location_id }) =>
        getAtRiskAthletes(location_id ?? locationDefault).map(athleteToListItem),
    }),
    compare_locations: tool({
      description: "Compare locations by revenue, retention, or utilization",
      inputSchema: z.object({
        metric: z.enum(["revenue", "retention", "utilization"]),
        period: z.string().default("quarter"),
      }),
      execute: async ({ metric, period }) => compareLocations(metric, period),
    }),
    list_locations: tool({
      description: "All training facilities",
      inputSchema: z.object({}),
      execute: async () => listLocations(),
    }),
    list_programs: tool({
      description: "All training programs and pricing",
      inputSchema: z.object({}),
      execute: async () => listPrograms(),
    }),
    get_sessions: tool({
      description: "Weekly session schedule by location, coach, or program",
      inputSchema: z.object({
        location_id: z.string().optional(),
        coach_id: z.string().optional(),
        program_id: z.string().optional(),
        day_of_week: z.number().min(1).max(7).optional(),
      }),
      execute: async (filters) =>
        getSessions({
          ...filters,
          location_id: filters.location_id ?? locationDefault,
        }),
    }),
    get_leads: tool({
      description: "Sales leads in the pipeline",
      inputSchema: z.object({
        status: z.string().optional(),
        location_id: z.string().optional(),
        assigned_coach_id: z.string().optional(),
      }),
      execute: async (filters) =>
        getLeads({
          ...filters,
          location_id: filters.location_id ?? locationDefault,
        }),
    }),
    get_messages: tool({
      description: "Recent comms messages for an athlete or lead thread",
      inputSchema: z.object({
        athlete_id: z.string().optional(),
        lead_id: z.string().optional(),
        limit: z.number().optional(),
      }),
      execute: async (filters) => getMessages(filters),
    }),
    list_scout_users: tool({
      description: "Scout portal users and recruiting focus",
      inputSchema: z.object({}),
      execute: async () => listScoutUsers(),
    }),
    get_coach_performance: tool({
      description: "Coach retention and performance stats",
      inputSchema: z.object({ coach_id: z.string().optional() }),
      execute: async ({ coach_id }) => getCoachPerformance(coach_id),
    }),
    get_failed_payments: tool({
      description: "List failed payments",
      inputSchema: z.object({ since: z.string().optional() }),
      execute: async ({ since }) => getFailedPayments(since),
    }),
    summarize_athlete_progression: tool({
      description: "Narrative summary of athlete progression",
      inputSchema: z.object({
        athlete_id: z.string(),
        since: z.string().optional(),
      }),
      execute: async ({ athlete_id, since }) =>
        summarizeAthleteProgression(athlete_id, since),
    }),
    search_coach_notes: tool({
      description:
        "Semantic search on coach notes for qualitative observations",
      inputSchema: z.object({ query: z.string() }),
      execute: async ({ query }) => searchNotesByQuery(query),
    }),
  };
}

export async function runQuery(
  query: string,
  scope: QueryScope = {},
  options: QueryOptions = {}
): Promise<{ response: QueryResponse; cached: boolean } | null> {
  void scope;
  if (!options.use_demo_cache) return null;

  const cached = lookupCachedQuery(query);
  if (cached) {
    console.log("[api] ai/query demo cache hit", {
      query: query.slice(0, 120),
      responseType: cached.type,
    });
    return { response: cached, cached: true };
  }

  console.warn("[api] ai/query demo cache miss on suggestion click", {
    query: query.slice(0, 120),
  });
  return null;
}

export function streamLegacyQuery(query: string, scope: QueryScope = {}) {
  return streamText({
    model: getModel(),
    system:
      buildSystemPrompt(scope) +
      "\n\nRespond in markdown, 2-4 paragraphs max.",
    tools: createLegacyTools(scope),
    stopWhen: stepCountIs(8),
    prompt: query,
    onStepFinish: logGeminiStep,
  });
}

/** @deprecated use streamLegacyQuery */
export function streamNarrativeQuery(query: string, scope: QueryScope = {}) {
  return streamLegacyQuery(query, scope);
}

export async function generateDraftMessage(prompt: string): Promise<string> {
  if (!isAiConfigured()) {
    return "Hi — wanted to check in on your athlete's training. Let's get them back on schedule this week!";
  }
  const { text } = await generateText({
    model: getModel(),
    prompt,
  });
  return text.trim();
}

/** @deprecated use generateDraftMessage */
export const queryWithGemini = async () => null;
export const isGeminiConfigured = isAiConfigured;
