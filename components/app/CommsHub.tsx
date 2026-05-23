"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { demoStore } from "@/lib/demo/store";
import { useComms } from "@/components/app/MessagesRealtimeProvider";
import { MessageThread } from "@/components/app/MessageThread";
import { CommsReplyBox } from "@/components/app/CommsReplyBox";
import { Badge } from "@/components/ui/badge";
import {
  buildThreads,
  DEFAULT_COMMS_FILTERS,
  filterThreads,
  type CommsFilters,
  type CommsThread,
} from "@/lib/comms/threads";
import { cn } from "@/lib/utils";

export function CommsHub() {
  const { messages, leads, refresh, markThreadRead, appendMessage, newThreadKeys } =
    useComms();
  const [filters, setFilters] = useState<CommsFilters>(DEFAULT_COMMS_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const lastMarkedUnreadKeyRef = useRef("");

  const allLeads = useMemo(() => {
    const byId = new Map<string, (typeof leads)[0]>();
    for (const l of demoStore.leads) byId.set(l.id, l);
    for (const l of leads) byId.set(l.id, l);
    return [...byId.values()];
  }, [leads]);

  const threads = useMemo(
    () =>
      buildThreads(
        messages,
        demoStore.athletes,
        allLeads,
        demoStore.locations
      ),
    [messages, allLeads]
  );

  const filtered = useMemo(
    () => filterThreads(threads, filters),
    [threads, filters]
  );

  const selected: CommsThread | undefined = filtered.find(
    (t) => t.id === selectedId
  );

  const selectedUnreadKey = selected
    ? selected.messages
        .filter((m) => m.direction === "inbound" && !m.read_at)
        .map((m) => m.id)
        .join(",")
    : "";

  const markSelectedThreadRead = useCallback(
    (threadId: string) => {
      const athleteId = threadId.startsWith("athlete:")
        ? threadId.slice("athlete:".length)
        : null;
      const leadId = threadId.startsWith("lead:")
        ? threadId.slice("lead:".length)
        : null;
      markThreadRead(athleteId, leadId);
    },
    [markThreadRead]
  );

  const selectThread = useCallback(
    (thread: CommsThread) => {
      setSelectedId(thread.id);
      if (thread.unreadCount > 0) {
        const unreadKey = thread.messages
          .filter((m) => m.direction === "inbound" && !m.read_at)
          .map((m) => m.id)
          .join(",");
        lastMarkedUnreadKeyRef.current = unreadKey;
        markSelectedThreadRead(thread.id);
      }
    },
    [markSelectedThreadRead]
  );

  useEffect(() => {
    if (selectedId !== null || filtered.length === 0) return;
    selectThread(filtered[0]);
  }, [filtered, selectedId, selectThread]);

  // Mark new inbound messages that arrive via polling on the active thread
  useEffect(() => {
    if (!selectedId || !selectedUnreadKey) {
      if (!selectedUnreadKey) lastMarkedUnreadKeyRef.current = "";
      return;
    }
    if (lastMarkedUnreadKeyRef.current === selectedUnreadKey) return;
    lastMarkedUnreadKeyRef.current = selectedUnreadKey;
    markSelectedThreadRead(selectedId);
  }, [selectedId, selectedUnreadKey, markSelectedThreadRead]);

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F5F6F7]">Communications</h1>
          <p className="text-sm text-[#9DA3AE]">
            Unified inbox — athletes, parents, and leads
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterSelect
            label="Channel"
            value={filters.channel}
            onChange={(v) =>
              setFilters((f) => ({
                ...f,
                channel: v as CommsFilters["channel"],
              }))
            }
            options={[
              { value: "all", label: "All channels" },
              { value: "sms", label: "SMS" },
              { value: "email", label: "Email" },
              { value: "in_app", label: "In-app" },
            ]}
          />
          <FilterSelect
            label="Type"
            value={filters.partyType}
            onChange={(v) =>
              setFilters((f) => ({
                ...f,
                partyType: v as CommsFilters["partyType"],
              }))
            }
            options={[
              { value: "all", label: "All" },
              { value: "athlete", label: "Athletes" },
              { value: "lead", label: "Leads" },
            ]}
          />
          <FilterSelect
            label="Location"
            value={filters.locationId}
            onChange={(v) =>
              setFilters((f) => ({ ...f, locationId: v }))
            }
            options={[
              { value: "all", label: "All locations" },
              ...demoStore.locations.map((l) => ({
                value: l.id,
                label: l.name,
              })),
            ]}
          />
          <label className="flex h-9 items-center gap-2 rounded-md border border-[#2A2D34] bg-[#0A0B0D] px-3 text-sm text-[#F5F6F7]">
            <input
              type="checkbox"
              checked={filters.unreadOnly}
              onChange={(e) =>
                setFilters((f) => ({ ...f, unreadOnly: e.target.checked }))
              }
              className="rounded border-[#2A2D34]"
            />
            Unread only
          </label>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-4">
        <div className="flex w-80 shrink-0 flex-col overflow-hidden rounded-lg border border-[#2A2D34] bg-[#15171B]">
          <h2 className="border-b border-[#2A2D34] p-4 text-sm font-semibold text-[#9DA3AE]">
            Threads ({filtered.length})
          </h2>
          <div className="flex-1 overflow-y-auto">
            {filtered.map((thread) => {
              const loc = demoStore.locations.find(
                (l) => l.id === thread.locationId
              );
              const isNew = newThreadKeys.has(thread.id);
              return (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => selectThread(thread)}
                  className={cn(
                    "w-full border-b border-[#2A2D34]/50 p-4 text-left text-sm transition-colors hover:bg-[#12141A]",
                    selectedId === thread.id && "bg-[#12141A]",
                    isNew && "animate-slide-in border-l-2 border-l-[#3B82F6]"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-[#F5F6F7]">{thread.title}</p>
                    {thread.unreadCount > 0 && (
                      <Badge variant="warning">{thread.unreadCount}</Badge>
                    )}
                  </div>
                  <p className="text-xs text-[#9DA3AE]">{thread.subtitle}</p>
                  <p className="mt-1 truncate text-xs text-[#9DA3AE]">
                    {thread.messages[thread.messages.length - 1]?.body}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <Badge variant={thread.type === "lead" ? "scout" : "default"}>
                      {thread.type === "lead" ? "Lead" : "Athlete"}
                    </Badge>
                    {loc && (
                      <Badge variant="default">{loc.name}</Badge>
                    )}
                  </div>
                </button>
              );
            })}
            {!filtered.length && (
              <p className="p-4 text-sm text-[#9DA3AE]">
                No threads match these filters.
              </p>
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col rounded-lg border border-[#2A2D34] bg-[#15171B]">
          {selected ? (
            <>
              <div className="border-b border-[#2A2D34] p-4">
                <h2 className="text-lg font-semibold text-[#F5F6F7]">
                  {selected.title}
                </h2>
                <p className="text-sm text-[#9DA3AE]">{selected.subtitle}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <MessageThread messages={selected.messages} />
              </div>
              <div className="p-4">
                <CommsReplyBox
                  athleteId={selected.athleteId}
                  leadId={selected.leadId}
                  onSent={(msg) => {
                    if (msg) appendMessage(msg);
                    void refresh();
                  }}
                />
              </div>
            </>
          ) : (
            <p className="p-6 text-[#9DA3AE]">Select a thread</p>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-md border border-[#2A2D34] bg-[#0A0B0D] px-3 text-sm text-[#F5F6F7]"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
