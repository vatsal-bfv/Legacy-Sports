"use client";

import { CommandShell } from "@/components/app/CommandShell";
import { MessagesRealtimeProvider } from "@/components/app/MessagesRealtimeProvider";

export function CommandOsProviders({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  return (
    <MessagesRealtimeProvider>
      <CommandShell userName={userName}>{children}</CommandShell>
    </MessagesRealtimeProvider>
  );
}
