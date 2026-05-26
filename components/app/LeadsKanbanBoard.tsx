"use client";

import { useMemo, useState } from "react";
import { GripVertical, Plus } from "lucide-react";
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
} from "@/components/reui/kanban";
import { LeadDetailDialog } from "@/components/app/LeadDetailDialog";
import { Badge } from "@/components/ui/badge";
import { useLeads } from "@/components/app/LeadsRealtimeProvider";
import type { Lead } from "@/lib/demo/types";
import {
  applyStatusOverrides,
  groupLeadsByStatus,
  LEAD_STATUSES,
  loadStatusOverrides,
  persistColumnState,
  saveStatusOverrides,
  type LeadStatus,
} from "@/lib/leads/status-overrides";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  scheduled: "Scheduled",
  converted: "Converted",
  lost: "Lost",
};

const STATUS_STYLES: Record<
  LeadStatus,
  {
    column: string;
    card: string;
    label: string;
    badge: "default" | "success" | "warning" | "danger";
  }
> = {
  new: {
    column: "border-t-2 border-t-orange",
    card: "border-l-2 border-l-orange bg-orange/5",
    label: "text-orange",
    badge: "default",
  },
  contacted: {
    column: "border-t-2 border-t-amber-500",
    card: "border-l-2 border-l-amber-500 bg-amber-500/5",
    label: "text-amber-600",
    badge: "warning",
  },
  scheduled: {
    column: "border-t-2 border-t-violet-500",
    card: "border-l-2 border-l-violet-500 bg-violet-500/5",
    label: "text-violet-600",
    badge: "default",
  },
  converted: {
    column: "border-t-2 border-t-emerald-500",
    card: "border-l-2 border-l-emerald-500 bg-emerald-500/5",
    label: "text-emerald-600",
    badge: "success",
  },
  lost: {
    column: "border-t-2 border-t-red-500",
    card: "border-l-2 border-l-red-500 bg-red-500/5",
    label: "text-red-600",
    badge: "danger",
  },
};

function StatusColumn({
  status,
  columns,
  newLeadIds,
  onSelect,
  className,
}: {
  status: LeadStatus;
  columns: Record<LeadStatus, Lead[]>;
  newLeadIds: Set<string>;
  onSelect: (lead: Lead) => void;
  className?: string;
}) {
  const styles = STATUS_STYLES[status];

  return (
    <KanbanColumn
      value={status}
      className={cn(
        "flex min-h-[200px] w-72 shrink-0 flex-col rounded-lg border border-bone bg-field p-3",
        styles.column,
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className={cn("text-sm font-semibold", styles.label)}>
          {STATUS_LABELS[status]}
        </h3>
        <Badge variant={styles.badge}>{columns[status].length}</Badge>
      </div>
      <KanbanColumnContent
        value={status}
        className="flex min-h-[120px] flex-col gap-3"
      >
        {columns[status].map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            status={status}
            isNew={newLeadIds.has(lead.id)}
            onSelect={onSelect}
          />
        ))}
      </KanbanColumnContent>
    </KanbanColumn>
  );
}

function AddCategoryColumn() {
  return (
    <button
      type="button"
      className="flex min-h-[200px] w-72 shrink-0 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-bone bg-field/40 p-6 text-center transition-colors hover:border-slate hover:bg-bone/20"
    >
      <span className="flex size-10 items-center justify-center rounded-full border border-dashed border-bone bg-chalk text-slate">
        <Plus className="size-5" />
      </span>
      <p className="max-w-[180px] text-sm font-medium text-slate">
        Click here to add a new category
      </p>
    </button>
  );
}

function LeadCard({
  lead,
  status,
  isNew,
  onSelect,
}: {
  lead: Lead;
  status: LeadStatus;
  isNew: boolean;
  onSelect: (lead: Lead) => void;
}) {
  const styles = STATUS_STYLES[status];

  return (
    <KanbanItem
      value={lead.id}
      className={cn(
        "rounded-lg border border-bone bg-chalk shadow-sm",
        styles.card,
        isNew && "animate-slide-in animate-highlight border-orange"
      )}
    >
      <div className="flex items-stretch">
        <KanbanItemHandle className="flex shrink-0 items-center px-2 text-slate hover:text-pitch">
          <GripVertical className="size-4" />
        </KanbanItemHandle>
        <button
          type="button"
          onClick={() => onSelect(lead)}
          className="flex flex-1 flex-col gap-1 p-3 pl-0 text-left"
        >
          <p className="font-medium text-pitch">
            {lead.first_name} {lead.last_name}
          </p>
          <p className="text-xs text-slate">
            {lead.athlete_name || "No athlete"} · age {lead.athlete_age || "—"}
          </p>
        </button>
      </div>
    </KanbanItem>
  );
}

export function LeadsKanbanBoard() {
  const { leads, newLeadIds } = useLeads();
  const [selected, setSelected] = useState<Lead | null>(null);

  const mergedLeads = useMemo(() => applyStatusOverrides(leads), [leads]);
  const mergedKey = useMemo(
    () => mergedLeads.map((lead) => `${lead.id}:${lead.status}`).join("|"),
    [mergedLeads]
  );

  const groupedLeads = useMemo(
    () => groupLeadsByStatus(mergedLeads),
    [mergedLeads]
  );

  const [dragState, setDragState] = useState<{
    key: string;
    columns: Record<LeadStatus, Lead[]>;
  } | null>(null);

  const columns =
    dragState?.key === mergedKey ? dragState.columns : groupedLeads;

  function handleValueChange(next: Record<string, Lead[]>) {
    const nextColumns = next as Record<LeadStatus, Lead[]>;
    setDragState({ key: mergedKey, columns: nextColumns });
    persistColumnState(next);
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-6">
      <div className="flex shrink-0 items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-pitch">Leads</h1>
        <p className="text-sm text-slate">
          Drag cards to update status
        </p>
      </div>

      <div className="-mx-4 min-h-0 min-w-0 flex-1 overflow-x-auto overscroll-x-contain px-4 lg:-mx-6 lg:px-6">
        <Kanban
          value={columns}
          onValueChange={handleValueChange}
          getItemValue={(item) => item.id}
          className="w-max"
        >
          <KanbanBoard className="inline-flex w-max gap-3 pb-4">
            {LEAD_STATUSES.map((status) => (
              <StatusColumn
                key={status}
                status={status}
                columns={columns}
                newLeadIds={newLeadIds}
                onSelect={setSelected}
              />
            ))}
            <AddCategoryColumn />
          </KanbanBoard>

          <KanbanOverlay>
            {({ value }) => {
              const lead = mergedLeads.find((l) => l.id === value);
              const dragStatus = LEAD_STATUSES.find((s) =>
                columns[s].some((l) => l.id === value)
              );
              const styles = dragStatus ? STATUS_STYLES[dragStatus] : null;

              if (!lead) {
                return (
                  <div className="size-full rounded-lg border border-orange bg-chalk opacity-90" />
                );
              }
              return (
                <div
                  className={cn(
                    "w-[220px] rounded-lg border border-bone bg-chalk p-4 shadow-xl",
                    styles?.card
                  )}
                >
                  <p className="font-medium text-pitch">
                    {lead.first_name} {lead.last_name}
                  </p>
                  <p className="mt-1 text-xs text-slate">
                    {lead.athlete_name || "No athlete"}
                  </p>
                </div>
              );
            }}
          </KanbanOverlay>
        </Kanban>
      </div>

      <LeadDetailDialog
        lead={selected}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        onLeadUpdated={(updated) => {
          if (updated.status !== selected?.status) {
            const overrides = loadStatusOverrides();
            overrides[updated.id] = updated.status;
            saveStatusOverrides(overrides);
          }
          setSelected(updated);
        }}
      />
    </div>
  );
}
