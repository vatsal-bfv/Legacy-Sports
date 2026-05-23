"use client";

import { useEffect, useState } from "react";
import type { Message } from "@/lib/demo/types";
import { MessageThread } from "@/components/app/MessageThread";
import { CommsReplyBox } from "@/components/app/CommsReplyBox";

export function AthleteCommsTab({ athleteId }: { athleteId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    void fetch("/api/messages")
      .then((r) => r.json())
      .then((data) => {
        const thread = (data.messages as Message[])
          .filter((m) => m.athlete_id === athleteId)
          .sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          );
        setMessages(thread);
      });
  }, [athleteId]);

  return (
    <div className="space-y-4">
      <MessageThread messages={messages} />
      <CommsReplyBox
        athleteId={athleteId}
        onSent={(msg) => {
          if (msg) setMessages((prev) => [...prev, msg]);
        }}
      />
    </div>
  );
}
