"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { QueryResultRenderer } from "@/components/app/QueryResultRenderer";
import type { QueryResponse } from "@/lib/ai/query-cache";

const SUGGESTIONS = [
  "Which athletes are at risk of churning this week?",
  "Show me revenue by location this quarter",
  "How is Marcus Johnson trending?",
];

export function NaturalLanguageInput({ compact }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<QueryResponse | null>(null);

  async function runQuery(q: string) {
    setLoading(true);
    setResponse(null);
    const res = await fetch("/api/ai/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: q }),
    });
    const data = await res.json();
    setResponse(data.response);
    setLoading(false);
  }

  return (
    <div className={compact ? "w-full max-w-xl" : "w-full"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (query.trim()) runQuery(query);
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Sparkles className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3B82F6]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about your athletes, locations, revenue..."
            className="pl-10 bg-[#12141A] border-[#2A2D34] h-11"
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "..." : "Ask"}
        </Button>
      </form>
      {!compact && (
        <div className="mt-2 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setQuery(s);
                runQuery(s);
              }}
              className="text-xs text-[#9DA3AE] hover:text-[#3B82F6] underline-offset-2 hover:underline"
            >
              {s}
            </button>
          ))}
        </div>
      )}
      {response && (
        <div className="mt-4 rounded-lg border border-[#2A2D34] bg-[#12141A] p-4">
          <QueryResultRenderer response={response} />
        </div>
      )}
    </div>
  );
}
