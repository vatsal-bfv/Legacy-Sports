"use client";

import { Check, Loader2, Wrench, AlertCircle } from "lucide-react";
import {
  formatToolInputSummary,
  formatToolLabel,
} from "@/lib/ai/tool-labels";
import type { QueryToolTraceItem } from "@/lib/ai/consume-query-stream";
import { cn } from "@/lib/utils";

export function AiQueryToolTrace({
  tools,
  isStreaming,
  className,
}: {
  tools: QueryToolTraceItem[];
  isStreaming?: boolean;
  className?: string;
}) {
  if (tools.length === 0 && !isStreaming) return null;

  return (
    <div
      className={cn(
        "rounded-lg border border-bone bg-chalk/80 p-3",
        className
      )}
    >
      <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate">
        {isStreaming ? (
          <Loader2 className="size-3.5 animate-spin text-orange" />
        ) : (
          <Wrench className="size-3.5 text-orange" />
        )}
        {isStreaming ? "Working through your question…" : "How I answered"}
      </p>
      <ul className="flex flex-col gap-1.5">
        {tools.map((tool) => {
          const done =
            tool.state === "output-available" || tool.state === "output-error";
          const running =
            tool.state === "input-streaming" ||
            tool.state === "input-available";
          const inputSummary = formatToolInputSummary(tool.toolName, tool.input);

          return (
            <li
              key={tool.id}
              className="flex items-start gap-2 rounded-md px-2 py-1.5 text-sm"
            >
              <span className="mt-0.5 shrink-0">
                {tool.state === "output-error" ? (
                  <AlertCircle className="size-4 text-red-500" />
                ) : done ? (
                  <Check className="size-4 text-orange" />
                ) : (
                  <Loader2 className="size-4 animate-spin text-slate" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-medium text-pitch">
                  {formatToolLabel(tool.toolName)}
                </span>
                {inputSummary ? (
                  <span className="text-slate"> · {inputSummary}</span>
                ) : null}
                {running ? (
                  <span className="block text-xs text-slate">Running…</span>
                ) : null}
                {tool.state === "output-error" && tool.errorText ? (
                  <span className="block text-xs text-red-600">
                    {tool.errorText}
                  </span>
                ) : null}
              </span>
            </li>
          );
        })}
        {isStreaming && tools.length === 0 ? (
          <li className="px-2 py-1 text-sm text-slate">Planning next step…</li>
        ) : null}
      </ul>
    </div>
  );
}
