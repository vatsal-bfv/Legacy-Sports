"use client";

import type { Message } from "@/lib/demo/types";
import {
  channelLabel,
  formatMessageTime,
  partyLabel,
} from "@/lib/comms/threads";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function MessageThread({
  messages,
  compact = false,
}: {
  messages: Message[];
  compact?: boolean;
}) {
  if (!messages.length) {
    return (
      <p className="text-sm text-slate">No messages in this thread yet.</p>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3", compact ? "max-h-64" : "")}>
      {messages.map((m) => {
        const isOutbound = m.direction === "outbound";
        const unread = m.direction === "inbound" && !m.read_at;

        return (
          <div
            key={m.id}
            className={cn(
              "flex flex-col gap-1",
              isOutbound ? "items-end" : "items-start"
            )}
          >
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate">
              <span>{partyLabel(m.from_party)}</span>
              <Badge variant="default">{channelLabel(m.channel)}</Badge>
              <span>{formatMessageTime(m.created_at)}</span>
              {unread && (
                <Badge variant="warning" className="uppercase">
                  Unread
                </Badge>
              )}
              {m.ai_generated && (
                <Badge variant="scout">AI</Badge>
              )}
            </div>
            {m.subject && (
              <p
                className={cn(
                  "text-xs font-medium text-slate",
                  isOutbound ? "text-right" : "text-left"
                )}
              >
                {m.subject}
              </p>
            )}
            <div
              className={cn(
                "max-w-[85%] rounded-lg p-3 text-sm",
                isOutbound
                  ? "bg-orange/20 text-pitch"
                  : "bg-field text-pitch",
                unread && "ring-1 ring-amber-500/50"
              )}
            >
              {m.body}
            </div>
          </div>
        );
      })}
    </div>
  );
}
