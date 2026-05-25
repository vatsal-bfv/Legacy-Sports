"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { demoStore } from "@/lib/demo/store";
import { COACH_RODRIGUEZ_ID } from "@/lib/constants";
import { useComms } from "@/components/app/MessagesRealtimeProvider";
import { MessageThread } from "@/components/app/MessageThread";
import { CommsReplyBox } from "@/components/app/CommsReplyBox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  buildThreads,
  DEFAULT_COMMS_FILTERS,
  filterThreads,
  retentionBadgeVariant,
  retentionStatusLabel,
  type CommsFilters,
  type CommsThread,
  type RetentionStatus,
} from "@/lib/comms/threads";
import { cn } from "@/lib/utils";

const RETENTION_FILTER_OPTIONS: { value: CommsFilters["retentionStatus"]; label: string }[] =
  [
    { value: "all", label: "All statuses" },
    { value: "at_risk", label: "At risk" },
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "churned", label: "Churned" },
  ];

function RetentionStatusBadge({
  status,
  riskScore,
}: {
  status: RetentionStatus;
  riskScore?: number | null;
}) {
  const label = retentionStatusLabel(status);
  if (!label) return null;

  return (
    <Badge variant={retentionBadgeVariant(status)}>
      {status === "at_risk" && riskScore != null
        ? `${label} · ${riskScore}%`
        : label}
    </Badge>
  );
}

export function CommsHub() {
  const searchParams = useSearchParams();
  const { messages, leads, refresh, markThreadRead, appendMessage, newThreadKeys } =
    useComms();
  const [filters, setFilters] = useState<CommsFilters>(DEFAULT_COMMS_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyPrefill, setReplyPrefill] = useState<string | null>(null);
  const [draftingReengage, setDraftingReengage] = useState(false);
  const lastMarkedUnreadKeyRef = useRef("");

  useEffect(() => {
    const retention = searchParams.get("retention");
    if (
      retention === "at_risk" ||
      retention === "active" ||
      retention === "paused" ||
      retention === "churned"
    ) {
      setFilters((f) => ({ ...f, retentionStatus: retention }));
    }
    const athlete = searchParams.get("athlete");
    const lead = searchParams.get("lead");
    if (athlete) setSelectedId(`athlete:${athlete}`);
    if (lead) setSelectedId(`lead:${lead}`);
  }, [searchParams]);

  const allLeads = useMemo(() => {
    const byId = new Map<string, (typeof leads)[0]>();
    for (const l of demoStore.leads) byId.set(l.id, l);
    for (const l of leads) byId.set(l.id, l);
    return [...byId.values()];
  }, [leads]);

  const threads = useMemo(
    () => buildThreads(messages, demoStore.athletes, allLeads),
    [messages, allLeads]
  );

  const filtered = useMemo(
    () => filterThreads(threads, filters),
    [threads, filters]
  );

  const atRiskCount = useMemo(
    () => threads.filter((t) => t.retentionStatus === "at_risk").length,
    [threads]
  );

  const resolvedSelectedId =
    selectedId && filtered.some((thread) => thread.id === selectedId)
      ? selectedId
      : (filtered[0]?.id ?? null);

  const selected: CommsThread | undefined = filtered.find(
    (t) => t.id === resolvedSelectedId
  );

  useEffect(() => {
    setReplyPrefill(null);
  }, [resolvedSelectedId]);

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
    if (!resolvedSelectedId || !selectedUnreadKey) {
      if (!selectedUnreadKey) lastMarkedUnreadKeyRef.current = "";
      return;
    }
    if (lastMarkedUnreadKeyRef.current === selectedUnreadKey) return;
    lastMarkedUnreadKeyRef.current = selectedUnreadKey;
    markSelectedThreadRead(resolvedSelectedId);
  }, [resolvedSelectedId, selectedUnreadKey, markSelectedThreadRead]);

  async function draftReengagement(athleteId: string) {
    setDraftingReengage(true);
    try {
      const res = await fetch("/api/ai/draft-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          athlete_id: athleteId,
          coach_id: COACH_RODRIGUEZ_ID,
          context: "reengagement",
        }),
      });
      const data = await res.json();
      if (data.message) setReplyPrefill(data.message);
    } finally {
      setDraftingReengage(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-pitch">Communications</h1>
          <p className="text-sm text-slate">
            Unified inbox — athletes, parents, and leads
            {atRiskCount > 0 ? (
              <>
                {" "}
                ·{" "}
                <span className="text-red-700">
                  {atRiskCount} at-risk member{atRiskCount === 1 ? "" : "s"}
                </span>
              </>
            ) : null}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterSelect
            label="Retention"
            value={filters.retentionStatus}
            onChange={(v) =>
              setFilters((f) => ({
                ...f,
                retentionStatus: v as CommsFilters["retentionStatus"],
              }))
            }
            options={RETENTION_FILTER_OPTIONS}
          />
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
          <label className="flex h-9 items-center gap-2 rounded-md border border-bone bg-field px-3 text-sm text-pitch">
            <input
              type="checkbox"
              checked={filters.unreadOnly}
              onChange={(e) =>
                setFilters((f) => ({ ...f, unreadOnly: e.target.checked }))
              }
              className="rounded border-bone"
            />
            Unread only
          </label>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-4">
        <div className="flex w-80 shrink-0 flex-col overflow-hidden rounded-lg border border-bone bg-chalk">
          <h2 className="border-b border-bone p-4 text-sm font-semibold text-slate">
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
                    "w-full border-b border-bone/50 p-4 text-left text-sm transition-colors hover:bg-field",
                    resolvedSelectedId === thread.id && "bg-field",
                    isNew && "animate-slide-in border-l-2 border-l-orange"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-pitch">{thread.title}</p>
                    {thread.unreadCount > 0 && (
                      <Badge variant="warning">{thread.unreadCount}</Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate">{thread.subtitle}</p>
                  <p className="mt-1 truncate text-xs text-slate">
                    {thread.messages[thread.messages.length - 1]?.body}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <Badge variant={thread.type === "lead" ? "scout" : "default"}>
                      {thread.type === "lead" ? "Lead" : "Athlete"}
                    </Badge>
                    {thread.retentionStatus ? (
                      <RetentionStatusBadge
                        status={thread.retentionStatus}
                        riskScore={thread.riskScore}
                      />
                    ) : null}
                    {loc && (
                      <Badge variant="default">{loc.name}</Badge>
                    )}
                  </div>
                </button>
              );
            })}
            {!filtered.length && (
              <p className="p-4 text-sm text-slate">
                No threads match these filters.
              </p>
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col rounded-lg border border-bone bg-chalk">
          {selected ? (
            <>
              <div className="border-b border-bone p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-pitch">
                      {selected.title}
                    </h2>
                    <p className="text-sm text-slate">{selected.subtitle}</p>
                    {selected.retentionStatus ? (
                      <div className="mt-2">
                        <RetentionStatusBadge
                          status={selected.retentionStatus}
                          riskScore={selected.riskScore}
                        />
                      </div>
                    ) : null}
                  </div>
                  {selected.retentionStatus === "at_risk" &&
                  selected.athleteId ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={draftingReengage}
                      onClick={() => draftReengagement(selected.athleteId!)}
                    >
                      {draftingReengage
                        ? "Drafting…"
                        : "Draft re-engagement message"}
                    </Button>
                  ) : null}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <MessageThread messages={selected.messages} />
              </div>
              <div className="p-4">
                <CommsReplyBox
                  key={selected.id}
                  athleteId={selected.athleteId}
                  leadId={selected.leadId}
                  threadMessages={selected.messages}
                  prefillBody={replyPrefill}
                  onSent={(msg) => {
                    if (msg) appendMessage(msg);
                    void refresh();
                  }}
                />
              </div>
            </>
          ) : (
            <p className="p-6 text-slate">Select a thread</p>
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
      className="h-9 rounded-md border border-bone bg-field px-3 text-sm text-pitch"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
