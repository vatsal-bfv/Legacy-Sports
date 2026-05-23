"use client";

import { LeadsKanbanBoard } from "@/components/app/LeadsKanbanBoard";
import { LeadsRealtimeProvider } from "@/components/app/LeadsRealtimeProvider";
import { demoStore } from "@/lib/demo/store";

export default function LeadsPage() {
  return (
    <LeadsRealtimeProvider initialLeads={demoStore.leads}>
      <LeadsKanbanBoard />
    </LeadsRealtimeProvider>
  );
}
