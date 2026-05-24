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

/** Normalize for exact cache key lookup (suggestion clicks only). */
export function normalizeQuery(q: string): string {
  return q
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .replace(/\b(show me|show|list|give me|find|get)\b/g, "show")
    .trim();
}

const CACHE: Record<string, QueryResponse> = {
  "which athletes are at risk of churning this week": {
    type: "list",
    title: "At-risk athletes this week",
    columns: [
      { key: "name", label: "Athlete" },
      { key: "sport", label: "Sport" },
      { key: "location", label: "Location" },
      { key: "risk_score", label: "Risk %" },
    ],
    items: [
      {
        name: "Tyler Chen",
        sport: "Basketball",
        location: "Lawrenceville",
        risk_score: "87%",
        id: "a0000001-0001-4000-8000-000000000002",
      },
      {
        name: "Jordan Baker",
        sport: "Football",
        location: "Suwanee",
        risk_score: "72%",
      },
      {
        name: "Taylor Clark",
        sport: "Basketball",
        location: "Hoschton",
        risk_score: "68%",
      },
    ],
  },
  "show me revenue by location this quarter": {
    type: "chart",
    chartType: "bar",
    title: "Revenue by location — Q2",
    x: "location",
    y: "revenue",
    data: [
      { location: "Suwanee", revenue: 142000 },
      { location: "Lawrenceville", revenue: 118000 },
      { location: "Canton", revenue: 105000 },
      { location: "Hoschton", revenue: 89000 },
      { location: "Alpharetta", revenue: 76000 },
    ],
  },
  "compare suwanee and lawrenceville member retention": {
    type: "chart",
    chartType: "line",
    title: "Retention rate — Suwanee vs Lawrenceville",
    x: "month",
    y: "rate",
    data: [
      { month: "Jan", suwanee: 94, lawrenceville: 91 },
      { month: "Feb", suwanee: 93, lawrenceville: 90 },
      { month: "Mar", suwanee: 95, lawrenceville: 88 },
      { month: "Apr", suwanee: 94, lawrenceville: 87 },
      { month: "May", suwanee: 96, lawrenceville: 86 },
    ],
  },
  "compare marcus vertical progression to other 2027 recruits in our system": {
    type: "chart",
    chartType: "line",
    title: "Vertical progression — Marcus vs 2027 QB cohort",
    x: "month",
    y: "inches",
    data: [
      { month: "Dec", marcus: 31, cohort_avg: 29 },
      { month: "Jan", marcus: 32, cohort_avg: 29.5 },
      { month: "Feb", marcus: 33, cohort_avg: 30 },
      { month: "Mar", marcus: 34, cohort_avg: 30.2 },
      { month: "Apr", marcus: 35, cohort_avg: 30.5 },
      { month: "May", marcus: 36, cohort_avg: 30.8 },
    ],
  },
  "show me every quarterback with a 40 under 47": {
    type: "list",
    title: "Quarterbacks — 40 yard under 4.7s",
    columns: [
      { key: "name", label: "Athlete" },
      { key: "forty", label: "40-yd" },
      { key: "grad_year", label: "Class" },
      { key: "location", label: "Location" },
    ],
    items: [
      {
        name: "Marcus Johnson",
        forty: "4.62",
        grad_year: "2027",
        location: "Suwanee",
        id: "a0000001-0001-4000-8000-000000000001",
      },
      {
        name: "Alex Garcia",
        forty: "4.68",
        grad_year: "2027",
        location: "Canton",
      },
    ],
  },
  "how is marcus johnson trending": {
    type: "mixed",
    blocks: [
      {
        type: "narrative",
        markdown:
          "**Marcus Johnson** is trending sharply upward. His 40-yard improved from 4.78 to **4.62** over 9 months, and vertical from 31\" to **36\"**. Three D1 programs have active inquiries. Projected high-likelihood Power Five commit.",
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
  },
  "which coaches have the highest member retention": {
    type: "list",
    title: "Coach retention rankings",
    columns: [
      { key: "coach", label: "Coach" },
      { key: "retention", label: "Retention %" },
      { key: "location", label: "Location" },
    ],
    items: [
      { coach: "James Mitchell", retention: "96%", location: "Suwanee" },
      { coach: "Mike Rodriguez", retention: "94%", location: "Lawrenceville" },
      { coach: "Sarah Kim", retention: "93%", location: "Hoschton" },
      { coach: "David Thompson", retention: "91%", location: "Canton" },
    ],
  },
};

/** Display labels shown in the UI (must map 1:1 to CACHE keys via normalizeQuery). */
export function getCachedQuerySuggestions(): string[] {
  return Object.keys(CACHE).map((key) => {
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    return label.endsWith("?") ? label : `${label}?`;
  });
}

/** Exact-match demo cache — only when the client sets use_demo_cache (suggestion click). */
export function lookupCachedQuery(query: string): QueryResponse | null {
  const normalized = normalizeQuery(query);
  return CACHE[normalized] ?? null;
}
