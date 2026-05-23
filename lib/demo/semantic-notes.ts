import { demoStore } from "@/lib/demo/store";

/** Mock pgvector-style semantic search using keyword overlap on coach notes. */
const NOTE_VECTORS: Record<string, string[]> = {
  mobility: ["mobility", "hip", "flexibility", "movement", "agility"],
  recruitment: ["recruit", "showcase", "d1", "commit", "college"],
  strength: ["squat", "strength", "pr", "power", "lift"],
  at_risk: ["missed", "absent", "gap", "churn", "no-show"],
};

function noteKeywords(noteId: string, tags: string[], content: string): Set<string> {
  const words = new Set<string>();
  for (const t of tags) words.add(t.toLowerCase());
  for (const w of content.toLowerCase().split(/\W+/)) {
    if (w.length > 3) words.add(w);
  }
  for (const [theme, keys] of Object.entries(NOTE_VECTORS)) {
    if (keys.some((k) => content.toLowerCase().includes(k) || tags.some((t) => t.includes(k)))) {
      words.add(theme);
    }
  }
  void noteId;
  return words;
}

const index = demoStore.coachNotes.map((n) => ({
  note: n,
  keywords: noteKeywords(n.id, n.tags, n.content),
}));

export function searchCoachNotes(query: string, limit = 5) {
  const qWords = query
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 3);
  const scored = index.map(({ note, keywords }) => {
    let score = 0;
    for (const w of qWords) {
      if (keywords.has(w)) score += 2;
      for (const k of keywords) {
        if (k.includes(w) || w.includes(k)) score += 1;
      }
    }
    return { note, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.note);
}
