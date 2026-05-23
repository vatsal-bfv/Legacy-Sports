"use client";

import { useState } from "react";
import { LeadsRealtimeProvider, useLeads } from "@/components/app/LeadsRealtimeProvider";
import { demoStore } from "@/lib/demo/store";
import { cn } from "@/lib/utils";
import type { Lead } from "@/lib/demo/types";

const columns: Lead["status"][] = [
  "new",
  "contacted",
  "scheduled",
  "converted",
  "lost",
];

function LeadsKanban() {
  const { leads, newLeadIds } = useLeads();
  const [selected, setSelected] = useState<Lead | null>(null);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Leads</h1>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((status) => (
          <div
            key={status}
            className="min-w-[240px] flex-1 rounded-lg border border-[#2A2D34] bg-[#12141A] p-4"
          >
            <h3 className="mb-4 text-sm font-semibold capitalize text-[#9DA3AE]">
              {status}
            </h3>
            <div className="space-y-3">
              {leads
                .filter((l) => l.status === status)
                .map((lead) => (
                  <button
                    key={lead.id}
                    type="button"
                    onClick={() => setSelected(lead)}
                    className={cn(
                      "w-full rounded-lg border border-[#2A2D34] bg-[#15171B] p-4 text-left transition-all hover:border-[#3B82F6]/50",
                      newLeadIds.has(lead.id) && "animate-slide-in animate-highlight border-[#3B82F6]"
                    )}
                  >
                    <p className="font-medium">
                      {lead.first_name} {lead.last_name}
                    </p>
                    <p className="text-xs text-[#9DA3AE]">
                      {lead.athlete_name || "No athlete"} · age{" "}
                      {lead.athlete_age || "—"}
                    </p>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
      {selected && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-[#2A2D34] bg-[#15171B] p-6 shadow-xl">
          <h2 className="text-xl font-bold">
            {selected.first_name} {selected.last_name}
          </h2>
          <p className="mt-2 text-sm text-[#9DA3AE]">{selected.email}</p>
          <p className="text-sm text-[#9DA3AE]">{selected.phone}</p>
          <p className="mt-4 text-sm">{selected.notes || "No notes"}</p>
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="mt-6 text-sm text-[#3B82F6]"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default function LeadsPage() {
  return (
    <LeadsRealtimeProvider initialLeads={demoStore.leads}>
      <LeadsKanban />
    </LeadsRealtimeProvider>
  );
}
