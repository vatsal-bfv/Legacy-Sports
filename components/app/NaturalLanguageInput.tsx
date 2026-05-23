"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, X } from "lucide-react";
import { QueryResultRenderer } from "@/components/app/QueryResultRenderer";
import { useLocationScope } from "@/components/app/LocationProvider";
import {
  getCachedQuerySuggestions,
  type QueryResponse,
} from "@/lib/ai/query-cache";
import { cn } from "@/lib/utils";

const CACHED_SUGGESTIONS = getCachedQuerySuggestions();

export function NaturalLanguageInput({ compact }: { compact?: boolean }) {
  const { locationId } = useLocationScope();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [streamingText, setStreamingText] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  const filteredSuggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CACHED_SUGGESTIONS;
    return CACHED_SUGGESTIONS.filter((s) => s.toLowerCase().includes(q));
  }, [query]);

  function selectSuggestion(suggestion: string) {
    setQuery(suggestion);
    setFocused(false);
    runQuery(suggestion);
  }

  async function streamNarrative(q: string) {
    setStreamingText("");
    const res = await fetch("/api/ai/query/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: q }),
    });
    if (!res.ok || !res.body) {
      setLoading(false);
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let text = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
      setStreamingText(text);
    }
    setResponse({ type: "narrative", markdown: text });
    setStreamingText("");
    setLoading(false);
  }

  async function runQuery(q: string) {
    setLoading(true);
    setResponse(null);
    setStreamingText("");
    if (compact) setPanelOpen(true);

    const res = await fetch("/api/ai/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: q,
        scope: { location_id: locationId ?? undefined },
      }),
    });
    const data = await res.json();

    if (
      data.stream &&
      data.response?.type === "narrative" &&
      !data.cached
    ) {
      await streamNarrative(q);
      return;
    }

    if (
      data.response?.type === "narrative" &&
      !data.cached &&
      data.response.markdown.length < 120
    ) {
      await streamNarrative(q);
      return;
    }

    setResponse(data.response);
    setLoading(false);
  }

  function closePanel() {
    setPanelOpen(false);
    setResponse(null);
    setStreamingText("");
    setLoading(false);
    setFocused(false);
  }

  useEffect(() => {
    if (!focused && !(compact && panelOpen)) return;

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setPanelOpen(false);
        setFocused(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") closePanel();
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [compact, panelOpen, focused]);

  const displayResponse =
    streamingText && !response
      ? ({ type: "narrative", markdown: streamingText } as QueryResponse)
      : response;

  const showCompactPanel =
    compact && panelOpen && (loading || displayResponse);

  const showSuggestions =
    focused &&
    filteredSuggestions.length > 0 &&
    !showCompactPanel &&
    !loading;

  return (
    <div
      ref={containerRef}
      className={cn(compact ? "relative w-full max-w-xl" : "w-full")}
    >
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
            onFocus={() => setFocused(true)}
            placeholder="Ask anything about your athletes, locations, revenue..."
            className="h-11 border-[#2A2D34] bg-[#12141A] pl-10"
            aria-expanded={showSuggestions}
            aria-controls={showSuggestions ? "nl-suggestions" : undefined}
            aria-autocomplete="list"
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "..." : "Ask"}
        </Button>
      </form>

      {showSuggestions && (
        <div
          id="nl-suggestions"
          role="listbox"
          className={cn(
            "z-50 rounded-lg border border-[#2A2D34] bg-[#12141A] shadow-2xl",
            compact
              ? "absolute left-0 top-[calc(100%+0.5rem)] w-[min(42rem,calc(100vw-3rem))] max-h-[min(50vh,20rem)] overflow-y-auto p-2"
              : "mt-2 p-2"
          )}
        >
          <p className="px-2 py-1 text-xs font-medium text-[#9DA3AE]">
            Suggested queries
          </p>
          <ul className="space-y-0.5">
            {filteredSuggestions.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  role="option"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectSuggestion(s)}
                  className="w-full rounded-md px-2 py-2 text-left text-sm text-[#F5F6F7] hover:bg-[#1A1D24]"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!compact && !showSuggestions && (
        <div className="mt-2 flex flex-wrap gap-2">
          {CACHED_SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => selectSuggestion(s)}
              className="text-xs text-[#9DA3AE] underline-offset-2 hover:text-[#3B82F6] hover:underline"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {compact && showCompactPanel && (
        <div
          role="dialog"
          aria-label="Query results"
          className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-[min(42rem,calc(100vw-3rem))] max-h-[min(70vh,32rem)] overflow-y-auto rounded-lg border border-[#2A2D34] bg-[#12141A] p-4 shadow-2xl"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="truncate text-xs text-[#9DA3AE]">
              {loading && !displayResponse ? "Thinking…" : query}
            </p>
            <button
              type="button"
              onClick={closePanel}
              className="shrink-0 rounded-md p-1 text-[#9DA3AE] hover:bg-[#1A1D24] hover:text-[#F5F6F7]"
              aria-label="Close results"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {displayResponse ? (
            <QueryResultRenderer
              response={displayResponse}
              isAnimating={Boolean(streamingText && !response)}
            />
          ) : (
            <p className="text-sm text-[#9DA3AE]">Fetching answer…</p>
          )}
        </div>
      )}

      {!compact && displayResponse && (
        <div className="mt-4 rounded-lg border border-[#2A2D34] bg-[#12141A] p-4">
          <QueryResultRenderer
            response={displayResponse}
            isAnimating={Boolean(streamingText && !response)}
          />
        </div>
      )}
    </div>
  );
}
