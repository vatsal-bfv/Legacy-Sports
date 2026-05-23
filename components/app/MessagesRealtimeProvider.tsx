"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Lead, Message } from "@/lib/demo/types";
import { demoStore } from "@/lib/demo/store";
import { messages as seedMessages } from "@/lib/demo/messages-seed";

type MessagesContextValue = {
  messages: Message[];
  leads: Lead[];
  refresh: () => Promise<void>;
  markThreadRead: (athleteId: string | null, leadId: string | null) => void;
  appendMessage: (message: Message) => void;
  newThreadKeys: Set<string>;
};

const MessagesContext = createContext<MessagesContextValue>({
  messages: [],
  leads: [],
  refresh: async () => {},
  markThreadRead: () => {},
  appendMessage: () => {},
  newThreadKeys: new Set(),
});

function threadKeyFromMessage(msg: Message): string | null {
  if (msg.athlete_id) return `athlete:${msg.athlete_id}`;
  if (msg.lead_id) return `lead:${msg.lead_id}`;
  return null;
}

export function useComms() {
  return useContext(MessagesContext);
}

export function MessagesRealtimeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [messages, setMessages] = useState<Message[]>([
    ...seedMessages,
  ]);
  const [leads, setLeads] = useState<Lead[]>([...demoStore.leads]);
  const [lastFetch, setLastFetch] = useState(new Date().toISOString());
  const [newThreadKeys, setNewThreadKeys] = useState<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    const [msgRes, leadRes] = await Promise.all([
      fetch(`/api/messages?since=${encodeURIComponent(lastFetch)}`),
      fetch(`/api/leads?since=${encodeURIComponent(lastFetch)}`),
    ]);

    if (msgRes.ok) {
      const data = await msgRes.json();
      if (data.messages?.length) {
        setMessages((prev) => {
          const ids = new Set(prev.map((m) => m.id));
          const incoming = data.messages.filter(
            (m: Message) => !ids.has(m.id)
          );
          if (incoming.length) {
            const keys = new Set(
              incoming
                .map(threadKeyFromMessage)
                .filter(Boolean) as string[]
            );
            setNewThreadKeys(keys);
            try {
              const ctx = new AudioContext();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.frequency.value = 660;
              gain.gain.value = 0.05;
              osc.start();
              osc.stop(ctx.currentTime + 0.12);
            } catch {
              /* optional */
            }
          }
          return [...prev, ...incoming];
        });
      }
    }

    if (leadRes.ok) {
      const data = await leadRes.json();
      if (data.leads?.length) {
        setLeads((prev) => {
          const ids = new Set(prev.map((l) => l.id));
          return [...data.leads.filter((l: Lead) => !ids.has(l.id)), ...prev];
        });
      }
    }

    setLastFetch(new Date().toISOString());
  }, [lastFetch]);

  const markThreadRead = useCallback(
    (athleteId: string | null, leadId: string | null) => {
      setMessages((prev) => {
        const hasUnread = prev.some(
          (m) =>
            ((athleteId && m.athlete_id === athleteId) ||
              (leadId && m.lead_id === leadId)) &&
            m.direction === "inbound" &&
            !m.read_at
        );
        if (!hasUnread) return prev;

        void fetch("/api/messages/read", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ athlete_id: athleteId, lead_id: leadId }),
        });

        const now = new Date().toISOString();
        return prev.map((m) => {
          const inThread =
            (athleteId && m.athlete_id === athleteId) ||
            (leadId && m.lead_id === leadId);
          if (inThread && !m.read_at && m.direction === "inbound") {
            return { ...m, read_at: now };
          }
          return m;
        });
      });

      setNewThreadKeys((prev) => {
        const key = athleteId
          ? `athlete:${athleteId}`
          : leadId
            ? `lead:${leadId}`
            : null;
        if (!key || !prev.has(key)) return prev;
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    },
    []
  );

  const appendMessage = useCallback((message: Message) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === message.id)) return prev;
      return [...prev, message];
    });
  }, []);

  useEffect(() => {
    const pollMs =
      process.env.NEXT_PUBLIC_LEADS_POLL_FALLBACK === "true" ? 2000 : 5000;
    const interval = setInterval(refresh, pollMs);
    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <MessagesContext.Provider
      value={{ messages, leads, refresh, markThreadRead, appendMessage, newThreadKeys }}
    >
      {children}
    </MessagesContext.Provider>
  );
}
