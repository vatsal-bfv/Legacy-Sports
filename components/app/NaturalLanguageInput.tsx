"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, X } from "lucide-react";
import { QueryResultRenderer } from "@/components/app/QueryResultRenderer";
import { AiQueryToolTrace } from "@/components/app/AiQueryToolTrace";
import { useLocationScope } from "@/components/app/LocationProvider";
import {
  consumeQueryStream,
  type QueryStreamSnapshot,
  type QueryToolTraceItem,
} from "@/lib/ai/consume-query-stream";
import {
  getCachedQuerySuggestions,
  type QueryResponse,
} from "@/lib/ai/query-cache";
import { cn } from "@/lib/utils";

const CACHED_SUGGESTIONS = getCachedQuerySuggestions();

const EMPTY_SNAPSHOT: QueryStreamSnapshot = { text: "", tools: [] };

function isUiMessageStream(response: Response) {
  return (
    response.headers.get("x-vercel-ai-ui-message-stream") === "v1" ||
    response.headers.get("content-type")?.includes("text/event-stream")
  );
}

export function NaturalLanguageInput({ compact }: { compact?: boolean }) {
  const { locationId } = useLocationScope();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [streamSnapshot, setStreamSnapshot] =
    useState<QueryStreamSnapshot>(EMPTY_SNAPSHOT);
  const [toolTrace, setToolTrace] = useState<QueryToolTraceItem[]>([]);
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
    runQuery(suggestion, true);
  }

  async function runQuery(q: string, useDemoCache = false) {
    setLoading(true);
    setResponse(null);
    setStreamSnapshot(EMPTY_SNAPSHOT);
    setToolTrace([]);
    if (compact) setPanelOpen(true);

    try {
      const res = await fetch("/api/ai/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          use_demo_cache: useDemoCache,
          scope: { location_id: locationId ?? undefined },
        }),
      });

      if (!res.ok) {
        setResponse({
          type: "narrative",
          markdown: "Something went wrong. Please try again.",
        });
        return;
      }

      if (isUiMessageStream(res)) {
        const markdown = await consumeQueryStream(res, (snapshot) => {
          setStreamSnapshot(snapshot);
          setToolTrace(snapshot.tools);
        });
        setResponse({ type: "narrative", markdown });
        setStreamSnapshot(EMPTY_SNAPSHOT);
        return;
      }

      const data = await res.json();
      setResponse(data.response);
    } catch {
      setResponse({
        type: "narrative",
        markdown: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  function closePanel() {
    setPanelOpen(false);
    setResponse(null);
    setStreamSnapshot(EMPTY_SNAPSHOT);
    setToolTrace([]);
    setLoading(false);
    setFocused(false);
  }

  const overlayActive = focused || Boolean(compact && panelOpen);

  useEffect(() => {
    if (!overlayActive) return;

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
      if (event.key === "Escape") {
        closePanel();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [overlayActive]);

  const streamingMarkdown = streamSnapshot.text;
  const displayResponse: QueryResponse | null =
    loading && streamingMarkdown && !response
      ? { type: "narrative", markdown: streamingMarkdown }
      : response;

  const showCompactPanel =
    compact && panelOpen && (loading || displayResponse);

  const showSuggestions =
    focused &&
    filteredSuggestions.length > 0 &&
    !showCompactPanel &&
    !loading;

  const showToolTrace =
    loading || (toolTrace.length > 0 && displayResponse?.type === "narrative");

  return (
    <div
      ref={containerRef}
      className={cn(compact ? "relative w-full max-w-xl" : "w-full")}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (query.trim()) runQuery(query, false);
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Sparkles className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orange" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Ask anything about your athletes, locations, revenue..."
            className="h-11 border-bone bg-field pl-10"
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
            "z-50 rounded-lg border border-bone bg-field shadow-2xl",
            compact
              ? "absolute left-0 top-[calc(100%+0.5rem)] w-[min(42rem,calc(100vw-3rem))] max-h-[min(50vh,20rem)] overflow-y-auto p-2"
              : "mt-2 p-2"
          )}
        >
          <p className="px-2 py-1 text-xs font-medium text-slate">
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
                  className="w-full rounded-md px-2 py-2 text-left text-sm text-pitch hover:bg-bone"
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
              className="text-xs text-slate underline-offset-2 hover:text-orange hover:underline"
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
          className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-[min(42rem,calc(100vw-3rem))] max-h-[min(70vh,32rem)] overflow-y-auto rounded-lg border border-bone bg-field p-4 shadow-2xl"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="truncate text-xs text-slate">
              {loading && !displayResponse ? "Thinking…" : query}
            </p>
            <button
              type="button"
              onClick={closePanel}
              className="shrink-0 rounded-md p-1 text-slate hover:bg-bone hover:text-pitch"
              aria-label="Close results"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {showToolTrace ? (
            <AiQueryToolTrace
              tools={loading ? streamSnapshot.tools : toolTrace}
              isStreaming={loading}
              className="mb-3"
            />
          ) : null}
          {displayResponse ? (
            <QueryResultRenderer
              response={displayResponse}
              isAnimating={Boolean(loading && streamingMarkdown)}
            />
          ) : (
            <p className="text-sm text-slate">Fetching answer…</p>
          )}
        </div>
      )}

      {!compact && (loading || displayResponse) && (
        <div className="mt-4 space-y-3">
          {showToolTrace ? (
            <AiQueryToolTrace
              tools={loading ? streamSnapshot.tools : toolTrace}
              isStreaming={loading}
            />
          ) : null}
          {displayResponse ? (
            <div className="rounded-lg border border-bone bg-field p-4">
              <QueryResultRenderer
                response={displayResponse}
                isAnimating={Boolean(loading && streamingMarkdown)}
              />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
