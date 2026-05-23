"use client";

import { CommandShell } from "@/components/app/CommandShell";
import { LeadsRealtimeProvider } from "@/components/app/LeadsRealtimeProvider";
import { MessagesRealtimeProvider } from "@/components/app/MessagesRealtimeProvider";
import { demoStore } from "@/lib/demo/store";

export function CommandOsProviders({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  return (
    <LeadsRealtimeProvider initialLeads={demoStore.leads}>
      <MessagesRealtimeProvider>
        <CommandShell userName={userName}>{children}</CommandShell>
      </MessagesRealtimeProvider>
    </LeadsRealtimeProvider>
  );
}
