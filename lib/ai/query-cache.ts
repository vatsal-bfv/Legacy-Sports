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

function normalizeQuery(q: string): string {
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
        location: "Mesa",
        risk_score: "87%",
        id: "a0000001-0001-4000-8000-000000000002",
      },
      {
        name: "Jordan Baker",
        sport: "Football",
        location: "Phoenix",
        risk_score: "72%",
      },
      {
        name: "Taylor Clark",
        sport: "Basketball",
        location: "Gilbert",
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
      { location: "Phoenix", revenue: 142000 },
      { location: "Mesa", revenue: 118000 },
      { location: "Scottsdale", revenue: 105000 },
      { location: "Gilbert", revenue: 89000 },
      { location: "Chandler", revenue: 76000 },
    ],
  },
  "compare phoenix and mesa member retention": {
    type: "chart",
    chartType: "line",
    title: "Retention rate — Phoenix vs Mesa",
    x: "month",
    y: "rate",
    data: [
      { month: "Jan", phoenix: 94, mesa: 91 },
      { month: "Feb", phoenix: 93, mesa: 90 },
      { month: "Mar", phoenix: 95, mesa: 88 },
      { month: "Apr", phoenix: 94, mesa: 87 },
      { month: "May", phoenix: 96, mesa: 86 },
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
        location: "Phoenix",
        id: "a0000001-0001-4000-8000-000000000001",
      },
      {
        name: "Alex Garcia",
        forty: "4.68",
        grad_year: "2027",
        location: "Scottsdale",
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
      { coach: "James Mitchell", retention: "96%", location: "Phoenix" },
      { coach: "Mike Rodriguez", retention: "94%", location: "Mesa" },
      { coach: "Sarah Kim", retention: "93%", location: "Gilbert" },
      { coach: "David Thompson", retention: "91%", location: "Scottsdale" },
    ],
  },
};

const PATTERNS: { pattern: RegExp; key: string }[] = [
  { pattern: /at.?risk|churn/i, key: "which athletes are at risk of churning this week" },
  { pattern: /revenue.*location|location.*revenue/i, key: "show me revenue by location this quarter" },
  { pattern: /phoenix.*mesa.*retention|mesa.*phoenix.*retention|compare.*retention/i, key: "compare phoenix and mesa member retention" },
  { pattern: /marcus.*vertical|vertical.*marcus|2027.*recruit/i, key: "compare marcus vertical progression to other 2027 recruits in our system" },
  { pattern: /quarterback.*40|40.*under.*4\.?7|qb.*4\.?7/i, key: "show me every quarterback with a 40 under 47" },
  { pattern: /marcus.*trend|how.*marcus|marcus.*johnson|what.*marcus|marcus.*up to|marcus.*doing|\bmarcus\b/i, key: "how is marcus johnson trending" },
  { pattern: /coach.*retention|retention.*coach/i, key: "which coaches have the highest member retention" },
];

export function lookupCachedQuery(query: string): QueryResponse | null {
  const normalized = normalizeQuery(query);
  if (CACHE[normalized]) return CACHE[normalized];
  for (const { pattern, key } of PATTERNS) {
    if (pattern.test(query)) return CACHE[key];
  }
  return null;
}
