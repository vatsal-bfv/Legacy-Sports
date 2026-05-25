"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useComms } from "@/components/app/MessagesRealtimeProvider";
import { useLeads } from "@/components/app/LeadsRealtimeProvider";
import { demoStore } from "@/lib/demo/store";
import { cn } from "@/lib/utils";

export function NotificationsBell({
  menuClassName,
  buttonClassName,
}: {
  menuClassName?: string;
  buttonClassName?: string;
} = {}) {
  const { messages, newThreadKeys } = useComms();
  const { newLeadIds, leads } = useLeads();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = messages.filter(
    (m) => m.direction === "inbound" && !m.read_at
  ).length;
  const total = unreadCount + newLeadIds.size;

  const recentUnread = messages
    .filter((m) => m.direction === "inbound" && !m.read_at)
    .slice(-5)
    .reverse();

  const recentLeads = leads
    .filter((l) => newLeadIds.has(l.id))
    .slice(0, 5);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "relative rounded-md p-2 text-slate hover:bg-chalk hover:text-pitch",
          buttonClassName
        )}
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {total > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#EF4444] px-1 text-[10px] font-bold text-white">
            {total > 9 ? "9+" : total}
          </span>
        )}
      </button>
      {open && (
        <div
          className={cn(
            "absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-lg border border-bone bg-chalk shadow-xl",
            menuClassName
          )}
        >
          <div className="border-b border-bone px-4 py-3 text-sm font-semibold">
            Notifications
          </div>
          <div className="max-h-80 overflow-y-auto">
            {recentLeads.map((lead) => (
              <Link
                key={lead.id}
                href="/command-os/leads"
                onClick={() => setOpen(false)}
                className="block border-b border-bone/50 px-4 py-3 text-sm hover:bg-field"
              >
                <p className="font-medium text-orange">New lead</p>
                <p className="text-slate">
                  {lead.first_name} {lead.last_name}
                </p>
              </Link>
            ))}
            {recentUnread.map((m) => {
              const athlete = m.athlete_id
                ? demoStore.athletes.find((a) => a.id === m.athlete_id)
                : null;
              const href = m.athlete_id
                ? `/command-os/communications?athlete=${m.athlete_id}`
                : m.lead_id
                  ? `/command-os/communications?lead=${m.lead_id}`
                  : "/command-os/communications";
              return (
                <Link
                  key={m.id}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-bone/50 px-4 py-3 text-sm hover:bg-field"
                >
                  <p className="font-medium">
                    {athlete
                      ? `${athlete.first_name} ${athlete.last_name}`
                      : "Lead message"}
                  </p>
                  <p className="truncate text-slate">{m.body}</p>
                </Link>
              );
            })}
            {total === 0 && (
              <p className="px-4 py-6 text-center text-sm text-slate">
                All caught up
              </p>
            )}
          </div>
          {newThreadKeys.size > 0 && (
            <div className="border-t border-bone px-4 py-2 text-xs text-slate">
              {newThreadKeys.size} new thread
              {newThreadKeys.size > 1 ? "s" : ""}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
