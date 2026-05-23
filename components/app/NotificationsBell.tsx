"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useComms } from "@/components/app/MessagesRealtimeProvider";
import { useLeads } from "@/components/app/LeadsRealtimeProvider";
import { demoStore } from "@/lib/demo/store";

export function NotificationsBell() {
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
        className="relative rounded-md p-2 text-[#9DA3AE] hover:bg-[#15171B] hover:text-[#F5F6F7]"
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
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-lg border border-[#2A2D34] bg-[#15171B] shadow-xl">
          <div className="border-b border-[#2A2D34] px-4 py-3 text-sm font-semibold">
            Notifications
          </div>
          <div className="max-h-80 overflow-y-auto">
            {recentLeads.map((lead) => (
              <Link
                key={lead.id}
                href="/command-os/leads"
                onClick={() => setOpen(false)}
                className="block border-b border-[#2A2D34]/50 px-4 py-3 text-sm hover:bg-[#12141A]"
              >
                <p className="font-medium text-[#3B82F6]">New lead</p>
                <p className="text-[#9DA3AE]">
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
                  className="block border-b border-[#2A2D34]/50 px-4 py-3 text-sm hover:bg-[#12141A]"
                >
                  <p className="font-medium">
                    {athlete
                      ? `${athlete.first_name} ${athlete.last_name}`
                      : "Lead message"}
                  </p>
                  <p className="truncate text-[#9DA3AE]">{m.body}</p>
                </Link>
              );
            })}
            {total === 0 && (
              <p className="px-4 py-6 text-center text-sm text-[#9DA3AE]">
                All caught up
              </p>
            )}
          </div>
          {newThreadKeys.size > 0 && (
            <div className="border-t border-[#2A2D34] px-4 py-2 text-xs text-[#9DA3AE]">
              {newThreadKeys.size} new thread
              {newThreadKeys.size > 1 ? "s" : ""}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
