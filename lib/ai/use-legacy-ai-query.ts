"use client";

import { useState } from "react";
import { useLocationScope } from "@/components/app/LocationProvider";
import { buildLiveStreamingResponse } from "@/lib/ai/chart-spec";
import {
  consumeQueryStream,
  type QueryStreamSnapshot,
  type QueryToolTraceItem,
} from "@/lib/ai/consume-query-stream";
import type { QueryResponse } from "@/lib/ai/query-cache";

const EMPTY_SNAPSHOT: QueryStreamSnapshot = { text: "", tools: [] };

const ERROR_RESPONSE: QueryResponse = {
  type: "narrative",
  markdown: "Something went wrong. Please try again.",
};

function isUiMessageStream(response: Response) {
  return (
    response.headers.get("x-vercel-ai-ui-message-stream") === "v1" ||
    response.headers.get("content-type")?.includes("text/event-stream")
  );
}

export type LegacyAiQueryResult = {
  response: QueryResponse;
  toolTrace: QueryToolTraceItem[];
};

export function useLegacyAiQuery() {
  const { locationId } = useLocationScope();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [streamSnapshot, setStreamSnapshot] =
    useState<QueryStreamSnapshot>(EMPTY_SNAPSHOT);
  const [toolTrace, setToolTrace] = useState<QueryToolTraceItem[]>([]);

  async function runQuery(q: string): Promise<LegacyAiQueryResult> {
    setLoading(true);
    setResponse(null);
    setStreamSnapshot(EMPTY_SNAPSHOT);
    setToolTrace([]);

    try {
      const res = await fetch("/api/ai/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          scope: { location_id: locationId ?? undefined },
        }),
      });

      if (!res.ok) {
        setResponse(ERROR_RESPONSE);
        return { response: ERROR_RESPONSE, toolTrace: [] };
      }

      if (isUiMessageStream(res)) {
        let finalTools: QueryToolTraceItem[] = [];
        const { response: streamResponse } = await consumeQueryStream(
          res,
          (snapshot) => {
            setStreamSnapshot(snapshot);
            setToolTrace(snapshot.tools);
            finalTools = snapshot.tools;
          }
        );
        setResponse(streamResponse);
        setStreamSnapshot(EMPTY_SNAPSHOT);
        return { response: streamResponse, toolTrace: finalTools };
      }

      const data = await res.json();
      setResponse(data.response);
      return { response: data.response, toolTrace: [] };
    } catch {
      setResponse(ERROR_RESPONSE);
      return { response: ERROR_RESPONSE, toolTrace: [] };
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setLoading(false);
    setResponse(null);
    setStreamSnapshot(EMPTY_SNAPSHOT);
    setToolTrace([]);
  }

  const streamingMarkdown = streamSnapshot.text;
  const liveResponse = buildLiveStreamingResponse(streamSnapshot.text);
  const hasStreamedContent = liveResponse != null;
  const toolsExpanded = loading && !hasStreamedContent;
  const displayResponse: QueryResponse | null =
    loading && !response ? liveResponse : response;
  const showToolTrace =
    loading || (toolTrace.length > 0 && displayResponse != null);

  return {
    loading,
    response,
    streamSnapshot,
    toolTrace,
    runQuery,
    reset,
    streamingMarkdown,
    displayResponse,
    toolsExpanded,
    showToolTrace,
  };
}
