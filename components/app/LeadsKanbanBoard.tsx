"use client";

import { useEffect, useMemo, useState } from "react";
import { GripVertical } from "lucide-react";
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
} from "@/components/reui/kanban";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useLeads } from "@/components/app/LeadsRealtimeProvider";
import type { Lead } from "@/lib/demo/types";
import {
  applyStatusOverrides,
  groupLeadsByStatus,
  LEAD_STATUSES,
  persistColumnState,
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
    column: "border-t-2 border-t-[#3B82F6]",
    card: "border-l-2 border-l-[#3B82F6] bg-[#3B82F6]/5",
    label: "text-[#60A5FA]",
    badge: "default",
  },
  contacted: {
    column: "border-t-2 border-t-amber-500",
    card: "border-l-2 border-l-amber-500 bg-amber-500/5",
    label: "text-amber-400",
    badge: "warning",
  },
  scheduled: {
    column: "border-t-2 border-t-violet-500",
    card: "border-l-2 border-l-violet-500 bg-violet-500/5",
    label: "text-violet-400",
    badge: "default",
  },
  converted: {
    column: "border-t-2 border-t-emerald-500",
    card: "border-l-2 border-l-emerald-500 bg-emerald-500/5",
    label: "text-emerald-400",
    badge: "success",
  },
  lost: {
    column: "border-t-2 border-t-red-500",
    card: "border-l-2 border-l-red-500 bg-red-500/5",
    label: "text-red-400",
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
        "min-h-[280px] rounded-lg border border-[#2A2D34] bg-[#12141A] p-4",
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
        "rounded-lg border border-[#2A2D34] bg-[#15171B] shadow-sm",
        styles.card,
        isNew && "animate-slide-in animate-highlight border-[#3B82F6]"
      )}
    >
      <div className="flex items-stretch">
        <KanbanItemHandle className="flex shrink-0 items-center px-2 text-[#9DA3AE] hover:text-[#F5F6F7]">
          <GripVertical className="size-4" />
        </KanbanItemHandle>
        <button
          type="button"
          onClick={() => onSelect(lead)}
          className="flex flex-1 flex-col gap-1 p-3 pl-0 text-left"
        >
          <p className="font-medium text-[#F5F6F7]">
            {lead.first_name} {lead.last_name}
          </p>
          <p className="text-xs text-[#9DA3AE]">
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

  const [columns, setColumns] = useState<Record<LeadStatus, Lead[]>>(() =>
    groupLeadsByStatus(mergedLeads)
  );

  useEffect(() => {
    setColumns(groupLeadsByStatus(mergedLeads));
  }, [mergedLeads]);

  function handleValueChange(next: Record<string, Lead[]>) {
    setColumns(next as Record<LeadStatus, Lead[]>);
    persistColumnState(next);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#F5F6F7]">Leads</h1>
        <p className="text-sm text-[#9DA3AE]">
          Drag cards to update status · saved for this session
        </p>
      </div>

      <Kanban
        value={columns}
        onValueChange={handleValueChange}
        getItemValue={(item) => item.id}
      >
        <KanbanBoard className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2 lg:grid-cols-4">
          {LEAD_STATUSES.map((status) => (
            <StatusColumn
              key={status}
              status={status}
              columns={columns}
              newLeadIds={newLeadIds}
              onSelect={setSelected}
            />
          ))}
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
                <div className="size-full rounded-lg border border-[#3B82F6] bg-[#15171B] opacity-90" />
              );
            }
            return (
              <div
                className={cn(
                  "w-[220px] rounded-lg border border-[#2A2D34] bg-[#15171B] p-4 shadow-xl",
                  styles?.card
                )}
              >
                <p className="font-medium text-[#F5F6F7]">
                  {lead.first_name} {lead.last_name}
                </p>
                <p className="mt-1 text-xs text-[#9DA3AE]">
                  {lead.athlete_name || "No athlete"}
                </p>
              </div>
            );
          }}
        </KanbanOverlay>
      </Kanban>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="border-[#2A2D34] bg-[#15171B] text-[#F5F6F7]">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selected.first_name} {selected.last_name}
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-2 text-sm">
                <p className="text-[#9DA3AE]">{selected.email}</p>
                <p className="text-[#9DA3AE]">{selected.phone}</p>
                {selected.athlete_name && (
                  <p>
                    Athlete: {selected.athlete_name}, age {selected.athlete_age}
                  </p>
                )}
                <p className="mt-2">{selected.notes || "No notes"}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
