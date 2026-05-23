"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Lead } from "@/lib/demo/types";

type LeadsContextValue = {
  leads: Lead[];
  refresh: () => void;
  newLeadIds: Set<string>;
};

const LeadsContext = createContext<LeadsContextValue>({
  leads: [],
  refresh: () => {},
  newLeadIds: new Set(),
});

export function useLeads() {
  return useContext(LeadsContext);
}

export function LeadsRealtimeProvider({
  children,
  initialLeads,
}: {
  children: React.ReactNode;
  initialLeads: Lead[];
}) {
  const [leads, setLeads] = useState(initialLeads);
  const [newLeadIds, setNewLeadIds] = useState<Set<string>>(new Set());
  const [lastFetch, setLastFetch] = useState(new Date().toISOString());

  const refresh = useCallback(async () => {
    const res = await fetch(`/api/leads?since=${lastFetch}`);
    if (!res.ok) return;
    const data = await res.json();
    if (data.leads?.length) {
      setLeads((prev) => {
        const ids = new Set(prev.map((l) => l.id));
        const incoming = data.leads.filter((l: Lead) => !ids.has(l.id));
        if (incoming.length) {
          setNewLeadIds(new Set(incoming.map((l: Lead) => l.id)));
          try {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 880;
            gain.gain.value = 0.05;
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
          } catch {
            /* audio optional */
          }
        }
        return [...incoming, ...prev];
      });
      setLastFetch(new Date().toISOString());
    }
  }, [lastFetch]);

  useEffect(() => {
    const poll = process.env.NEXT_PUBLIC_LEADS_POLL_FALLBACK === "true";
    const interval = setInterval(refresh, poll ? 2000 : 5000);
    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <LeadsContext.Provider value={{ leads, refresh, newLeadIds }}>
      {children}
    </LeadsContext.Provider>
  );
}
