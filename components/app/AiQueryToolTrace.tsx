"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Check,
  ChevronDown,
  CircleSlash,
  Loader2,
  Wrench,
} from "lucide-react";
import {
  formatToolInputSummary,
  formatToolLabel,
} from "@/lib/ai/tool-labels";
import { isEmptyToolResult } from "@/lib/ai/tool-output-summary";
import type { QueryToolTraceItem } from "@/lib/ai/consume-query-stream";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

function ToolTraceList({
  tools,
  isActive,
}: {
  tools: QueryToolTraceItem[];
  isActive?: boolean;
}) {
  return (
    <ul className="flex flex-col gap-1.5 pt-2">
      {tools.map((tool) => {
        const done =
          tool.state === "output-available" || tool.state === "output-error";
        const running =
          tool.state === "input-streaming" ||
          tool.state === "input-available";
        const inputSummary = formatToolInputSummary(tool.toolName, tool.input);
        const emptyResult =
          done &&
          tool.state === "output-available" &&
          tool.output !== undefined &&
          isEmptyToolResult(tool.toolName, tool.output);

        return (
          <li
            key={tool.id}
            className="flex items-start gap-2 rounded-md px-2 py-1.5 text-sm"
          >
            <span className="mt-0.5 shrink-0">
              {tool.state === "output-error" ? (
                <AlertCircle className="size-4 text-red-500" />
              ) : emptyResult ? (
                <CircleSlash className="size-4 text-amber-600" />
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
              {done && tool.resultSummary ? (
                <span
                  className={cn(
                    "block text-xs",
                    emptyResult ? "text-amber-700" : "text-slate"
                  )}
                >
                  → {tool.resultSummary}
                </span>
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
      {isActive && tools.length === 0 ? (
        <li className="px-2 py-1 text-sm text-slate">Planning next step…</li>
      ) : null}
    </ul>
  );
}

export function AiQueryToolTrace({
  tools,
  isActive,
  className,
}: {
  tools: QueryToolTraceItem[];
  /** True while tools are running and the answer has not started streaming yet. */
  isActive?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(isActive ?? false);

  useEffect(() => {
    if (isActive) {
      setOpen(true);
    } else if (tools.length > 0) {
      setOpen(false);
    }
  }, [isActive, tools.length]);

  if (tools.length === 0 && !isActive) return null;

  const title = isActive ? "Working through your question…" : "How I answered";
  const stepCount = tools.length;

  return (
    <Collapsible
      open={isActive ? true : open}
      onOpenChange={(next) => {
        if (!isActive) setOpen(next);
      }}
      className={cn(
        "rounded-lg border border-bone bg-chalk/80",
        className
      )}
    >
      <CollapsibleTrigger className="flex w-full items-center gap-1.5 px-3 py-2.5 text-left text-xs font-medium text-slate hover:bg-bone/40 [&[data-panel-open]_svg:last-child]:rotate-180">
        {isActive ? (
          <Loader2 className="size-3.5 shrink-0 animate-spin text-orange" />
        ) : (
          <Wrench className="size-3.5 shrink-0 text-orange" />
        )}
        <span className="min-w-0 flex-1">
          {title}
          {!isActive && stepCount > 0 ? (
            <span className="font-normal text-slate/80">
              {" "}
              · {stepCount} {stepCount === 1 ? "step" : "steps"}
            </span>
          ) : null}
        </span>
        {!isActive ? (
          <ChevronDown className="size-3.5 shrink-0 text-slate transition-transform duration-200" />
        ) : null}
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-3 data-[closed]:hidden">
        <ToolTraceList tools={tools} isActive={isActive} />
      </CollapsibleContent>
    </Collapsible>
  );
}
