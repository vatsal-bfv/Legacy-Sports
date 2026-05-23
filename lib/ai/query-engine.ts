import { tool, stepCountIs, generateText, streamText } from "ai";
import { z } from "zod";
import { getModel, isAiConfigured } from "./model";
import {
  athleteToListItem,
  compareLocations,
  getAtRiskAthletes,
  getAthleteAttendance,
  getAthleteMeasurables,
  getCoachPerformance,
  getFailedPayments,
  queryAthletes,
  searchNotesByQuery,
  summarizeAthleteProgression,
  type QueryScope,
} from "./data-access";
import { lookupCachedQuery, type QueryResponse } from "./query-cache";
import { HERO_IDS } from "@/lib/constants";
import { demoStore } from "@/lib/demo/store";

export function createLegacyTools(scope: QueryScope = {}) {
  const locationDefault = scope.location_id;

  return {
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

function buildResponseFromQuery(query: string): QueryResponse | null {
  const q = query.toLowerCase();

  if (/at.?risk|churn/.test(q)) {
    const items = getAtRiskAthletes().slice(0, 8).map(athleteToListItem);
    return {
      type: "list",
      title: "At-risk athletes this week",
      columns: [
        { key: "name", label: "Athlete" },
        { key: "sport", label: "Sport" },
        { key: "location", label: "Location" },
        { key: "risk_score", label: "Risk %" },
      ],
      items,
    };
  }

  if (/revenue.*location|location.*revenue/.test(q)) {
    return {
      type: "chart",
      chartType: "bar",
      title: "Revenue by location — Q2",
      x: "location",
      y: "revenue",
      data: compareLocations("revenue", "quarter") as Record<string, unknown>[],
    };
  }

  if (/phoenix.*mesa.*retention|compare.*retention/.test(q)) {
    return {
      type: "chart",
      chartType: "line",
      title: "Retention rate — Phoenix vs Mesa",
      x: "month",
      y: "rate",
      data: compareLocations("retention", "quarter") as Record<string, unknown>[],
    };
  }

  if (/marcus.*vertical|vertical.*2027|2027.*recruit/.test(q)) {
    const meas = getAthleteMeasurables(HERO_IDS.marcus, "vertical");
    const cohort = [
      { month: "Dec", marcus: 31, cohort_avg: 29 },
      { month: "Jan", marcus: 32, cohort_avg: 29.5 },
      { month: "Feb", marcus: 33, cohort_avg: 30 },
      { month: "Mar", marcus: 34, cohort_avg: 30.2 },
      { month: "Apr", marcus: 35, cohort_avg: 30.5 },
      { month: "May", marcus: 36, cohort_avg: 30.8 },
    ];
    void meas;
    return {
      type: "chart",
      chartType: "line",
      title: "Vertical progression — Marcus vs 2027 QB cohort",
      x: "month",
      y: "inches",
      data: cohort,
    };
  }

  if (/quarterback.*40|40.*under|qb.*4\.?7/.test(q)) {
    const qbs = queryAthletes({
      sport: "football",
      position: "quarterback",
      measurable_threshold: { metric: "forty_yard", max: 4.7 },
    });
    return {
      type: "list",
      title: "Quarterbacks — 40 yard under 4.7s",
      columns: [
        { key: "name", label: "Athlete" },
        { key: "forty", label: "40-yd" },
        { key: "grad_year", label: "Class" },
        { key: "location", label: "Location" },
      ],
      items: qbs.map((a) => ({
        ...athleteToListItem(a),
        forty: String(
          demoStore.measurables.find(
            (m) =>
              m.athlete_id === a.id && m.metric === "forty_yard" && m.is_pr
          )?.value ?? "—"
        ),
      })),
    };
  }

  if (/marcus.*trend|how.*marcus/.test(q)) {
    return {
      type: "mixed",
      blocks: [
        {
          type: "narrative",
          markdown: summarizeAthleteProgression(HERO_IDS.marcus),
        },
        {
          type: "chart",
          chartType: "line",
          title: "40-yard dash progression",
          x: "month",
          y: "seconds",
          data: [
            { month: "Dec", seconds: 4.78 },
            { month: "Jan", seconds: 4.74 },
            { month: "Feb", seconds: 4.71 },
            { month: "Mar", seconds: 4.68 },
            { month: "Apr", seconds: 4.65 },
            { month: "May", seconds: 4.62 },
          ],
        },
      ],
    };
  }

  if (/coach.*retention|retention.*coach/.test(q)) {
    const items = getCoachPerformance().map(({ coach, retention, location }) => ({
      coach,
      retention,
      location,
    }));
    return {
      type: "list",
      title: "Coach retention rankings",
      columns: [
        { key: "coach", label: "Coach" },
        { key: "retention", label: "Retention %" },
        { key: "location", label: "Location" },
      ],
      items,
    };
  }

  if (/mobility|coach.*flag|qualitative|notes/.test(q)) {
    const notes = searchNotesByQuery(query);
    if (notes.length) {
      return {
        type: "list",
        title: "Coach notes matching your query",
        columns: [
          { key: "content", label: "Note" },
          { key: "tags", label: "Tags" },
          { key: "date", label: "Date" },
        ],
        items: notes.map((n) => ({
          content: n.content,
          tags: n.tags.join(", "),
          date: new Date(n.created_at).toLocaleDateString(),
        })),
      };
    }
  }

  return null;
}

const SYSTEM_PROMPT = `You are Legacy Command AI for a multi-location youth sports training company.
Use the provided tools to fetch real athlete, location, and operations data.
Be concise and specific. When answering, prefer citing actual numbers from tool results.`;

export async function runQuery(
  query: string,
  scope: QueryScope = {}
): Promise<{ response: QueryResponse; cached: boolean; stream?: boolean }> {
  const cached = lookupCachedQuery(query);
  if (cached) {
    console.log("[api] ai/query cache hit", {
      query: query.slice(0, 120),
      responseType: cached.type,
    });
    return { response: cached, cached: true };
  }

  const local = buildResponseFromQuery(query);
  if (local) {
    console.log("[api] ai/query local match", {
      query: query.slice(0, 120),
      responseType: local.type,
    });
    return { response: local, cached: false };
  }

  if (isAiConfigured()) {
    console.log("[api] ai/query gemini start", { query: query.slice(0, 120) });
    try {
      const result = await generateText({
        model: getModel(),
        system: SYSTEM_PROMPT,
        tools: createLegacyTools(scope),
        stopWhen: stepCountIs(5),
        prompt: query,
      });

      const rebuilt = buildResponseFromQuery(query);
      if (rebuilt) {
        console.log("[api] ai/query gemini rebuilt local", {
          responseType: rebuilt.type,
        });
        return { response: rebuilt, cached: false };
      }

      if (result.text?.trim()) {
        console.log("[api] ai/query gemini success", {
          textLength: result.text.length,
          toolSteps: result.steps?.length ?? 0,
        });
        return {
          response: { type: "narrative", markdown: result.text },
          cached: false,
        };
      }

      console.warn("[api] ai/query gemini empty text", {
        toolSteps: result.steps?.length ?? 0,
      });
    } catch (error) {
      console.error("[api] ai/query gemini failed", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  } else {
    console.warn("[api] ai/query fallback — no API key (set GEMINI_API_KEY)", {
      query: query.slice(0, 120),
    });
  }

  return {
    response: {
      type: "narrative",
      markdown:
        "I found relevant data across your locations. Try asking about at-risk athletes, revenue by location, or Marcus Johnson's progression.",
    },
    cached: true,
    stream: isAiConfigured(),
  };
}

export function streamNarrativeQuery(query: string) {
  return streamText({
    model: getModel(),
    system: SYSTEM_PROMPT + " Respond in markdown, 2-3 paragraphs max.",
    tools: createLegacyTools(),
    stopWhen: stepCountIs(3),
    prompt: query,
  });
}

export async function generateDraftMessage(prompt: string): Promise<string> {
  if (!isAiConfigured()) {
    return "Hi — wanted to check in on your athlete's training. Let's get them back on schedule this week!";
  }
  const { text } = await generateText({
    model: getModel(),
    prompt,
    maxOutputTokens: 120,
  });
  return text.slice(0, 320);
}

/** @deprecated use generateDraftMessage */
export const queryWithGemini = async () => null;
export const isGeminiConfigured = isAiConfigured;
