"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, Sparkles } from "lucide-react";
import { AiQueryToolTrace } from "@/components/app/AiQueryToolTrace";
import { QueryResultRenderer } from "@/components/app/QueryResultRenderer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLocationScope } from "@/components/app/LocationProvider";
import { getCachedQuerySuggestions } from "@/lib/ai/query-cache";
import type { QueryToolTraceItem } from "@/lib/ai/consume-query-stream";
import type { QueryResponse } from "@/lib/ai/query-cache";
import { useLegacyAiQuery } from "@/lib/ai/use-legacy-ai-query";
import { demoStore } from "@/lib/demo/store";

const SUGGESTIONS = getCachedQuerySuggestions();

type ChatMessage =
  | { id: string; role: "user"; text: string }
  | {
      id: string;
      role: "assistant";
      query: string;
      response: QueryResponse;
      toolTrace: QueryToolTraceItem[];
    };

function messageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function CommandCenterChat() {
  const { locationId } = useLocationScope();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const {
    loading,
    runQuery,
    reset,
    displayResponse,
    showToolTrace,
    toolTrace,
    streamSnapshot,
    toolsExpanded,
    streamingMarkdown,
  } = useLegacyAiQuery();

  const locationName = locationId
    ? demoStore.locations.find((l) => l.id === locationId)?.name
    : null;

  const filteredSuggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SUGGESTIONS;
    return SUGGESTIONS.filter((s) => s.toLowerCase().includes(q));
  }, [query]);

  const showSuggestions =
    focused && filteredSuggestions.length > 0 && !loading;

  const isEmpty = messages.length === 0 && !loading;

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading, displayResponse]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setQuery("");
    setFocused(false);
    setMessages((prev) => [
      ...prev,
      { id: messageId(), role: "user", text: trimmed },
    ]);

    const { response, toolTrace: trace } = await runQuery(trimmed);
    setMessages((prev) => [
      ...prev,
      {
        id: messageId(),
        role: "assistant",
        query: trimmed,
        response,
        toolTrace: trace,
      },
    ]);
    reset();
    inputRef.current?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(query);
    }
  }

  return (
    <div className="-m-4 flex h-[calc(100dvh-68px)] flex-col lg:-m-6">
      <div className="border-b border-bone px-4 py-5 lg:px-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-orange">
          [ Command Center ]
        </p>
        <h1 className="mt-2 text-[clamp(24px,3vw,32px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-pitch">
          Ask Legacy Command
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-slate">
          Your AI co-pilot across athletes, locations, revenue, schedules, and
          communications
          {locationName ? ` · scoped to ${locationName}` : " · all locations"}.
        </p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 lg:px-6">
        {isEmpty ? (
          <div className="mx-auto flex max-w-3xl flex-col items-center pt-8 text-center md:pt-16">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange/10">
              <Sparkles className="h-7 w-7 text-orange" />
            </div>
            <h2 className="mt-6 text-xl font-bold tracking-[-0.02em] text-pitch">
              What can I help you with today?
            </h2>
            <p className="mt-2 max-w-md text-sm text-slate">
              Ask in plain English — I&apos;ll pull live data from across Legacy
              Command and answer with charts, lists, or narrative insights.
            </p>
            <div className="mt-8 grid w-full gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => void sendMessage(suggestion)}
                  className="rounded-[12px] border border-bone bg-chalk px-4 py-3 text-left text-sm text-pitch transition-colors hover:border-orange/30 hover:bg-orange/5"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            {messages.map((message) =>
              message.role === "user" ? (
                <div key={message.id} className="flex justify-end">
                  <div className="max-w-[85%] rounded-[14px] bg-pitch px-4 py-3 text-sm text-field">
                    {message.text}
                  </div>
                </div>
              ) : (
                <div key={message.id} className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate">
                    <Sparkles className="h-3.5 w-3.5 text-orange" />
                    Legacy Command
                  </div>
                  {message.toolTrace.length > 0 ? (
                    <AiQueryToolTrace
                      tools={message.toolTrace}
                      isActive={false}
                    />
                  ) : null}
                  <div className="rounded-[14px] border border-bone bg-chalk p-4">
                    <QueryResultRenderer response={message.response} />
                  </div>
                </div>
              )
            )}

            {loading ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-medium text-slate">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse text-orange" />
                  Legacy Command
                </div>
                {showToolTrace ? (
                  <AiQueryToolTrace
                    tools={streamSnapshot.tools.length ? streamSnapshot.tools : toolTrace}
                    isActive={toolsExpanded}
                  />
                ) : null}
                {displayResponse ? (
                  <div className="rounded-[14px] border border-bone bg-chalk p-4">
                    <QueryResultRenderer
                      response={displayResponse}
                      isAnimating={Boolean(streamingMarkdown)}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-slate">Thinking…</p>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="border-t border-bone bg-field/95 px-4 py-4 backdrop-blur-xl lg:px-6">
        <div className="relative mx-auto max-w-3xl">
          {showSuggestions ? (
            <div
              id="command-chat-suggestions"
              role="listbox"
              className="absolute bottom-[calc(100%+0.5rem)] left-0 right-0 z-50 max-h-[min(40vh,16rem)] overflow-y-auto rounded-lg border border-bone bg-field p-2 shadow-2xl"
            >
              <p className="px-2 py-1 text-xs font-medium text-slate">
                Suggested queries
              </p>
              <ul className="space-y-0.5">
                {filteredSuggestions.map((suggestion) => (
                  <li key={suggestion}>
                    <button
                      type="button"
                      role="option"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => void sendMessage(suggestion)}
                      className="w-full rounded-md px-2 py-2 text-left text-sm text-pitch hover:bg-bone"
                    >
                      {suggestion}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage(query);
            }}
            className="flex items-end gap-2 rounded-[14px] border border-bone bg-chalk p-2 shadow-sm focus-within:border-orange/40 focus-within:ring-4 focus-within:ring-orange/10"
          >
            <Textarea
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => window.setTimeout(() => setFocused(false), 150)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your athletes, locations, revenue…"
              rows={1}
              className="max-h-40 min-h-[44px] resize-none border-0 bg-transparent px-2 py-2.5 text-sm shadow-none focus-visible:ring-0"
              aria-expanded={showSuggestions}
              aria-controls={showSuggestions ? "command-chat-suggestions" : undefined}
            />
            <Button
              type="submit"
              size="icon"
              disabled={loading || !query.trim()}
              className="h-10 w-10 shrink-0 rounded-[10px]"
              aria-label="Send message"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </form>
          <p className="mt-2 text-center text-[11px] text-smoke">
            Enter to send · Shift+Enter for a new line
          </p>
        </div>
      </div>
    </div>
  );
}
