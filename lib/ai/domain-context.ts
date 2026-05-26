import { HERO_IDS } from "@/lib/constants";
import { demoStore } from "@/lib/demo/store";

/** Compact domain glossary injected into the AI system prompt. */
export function buildDomainContext(scopeLocationId?: string): string {
  const locations = demoStore.locations
    .map((l) => `- ${l.name} (id: ${l.id})`)
    .join("\n");

  const programs = demoStore.programs
    .map((p) => `- ${p.name}: $${p.monthly_price}/mo`)
    .join("\n");

  const heroIds = new Set<string>(Object.values(HERO_IDS));
  const heroes = demoStore.athletes
    .filter((a) => heroIds.has(a.id))
    .map((a) => {
      const loc = demoStore.locations.find((l) => l.id === a.home_location_id)?.name;
      return `- ${a.first_name} ${a.last_name} (${a.sport}, ${loc}, star ${a.star_rating}, id: ${a.id})`;
    })
    .join("\n");

  const coaches = demoStore.coaches
    .map((c) => {
      const loc = demoStore.locations.find(
        (l) => l.id === c.primary_location_id
      )?.name;
      return `- ${c.first_name} ${c.last_name} (${loc ?? "Legacy"}, id: ${c.id})`;
    })
    .join("\n");

  const scopeLine = scopeLocationId
    ? `The user has scoped the UI to location id ${scopeLocationId} (${demoStore.locations.find((l) => l.id === scopeLocationId)?.name ?? "unknown"}). Prefer this location when they say "here" or "this location" unless they ask about all locations.`
    : "No location filter is active — queries may span all facilities.";

  return `## Legacy Command domain

Legacy Sports runs a nationwide multi-campus athlete development network. Use tools to fetch live demo data — never invent athlete names, numbers, or locations.

### Facilities
${locations}

### Programs
${programs}

### Owner coaches (Command OS roster)
${coaches}

### Key athletes (five-star / demo heroes)
${heroes}

### Status vocabulary
- Athlete status: active, at_risk, paused, churned
- Lead status: new, contacted, scheduled, converted, lost
- star_rating 1–5 (5 = elite / priority)

### Scope
${scopeLine}

When a user mentions an athlete by name, call find_athlete_by_name first to resolve their id before other athlete tools.`;
}
