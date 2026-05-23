import type { Lead } from "@/lib/demo/types";

export const LEAD_STATUS_OVERRIDES_KEY = "legacy-leads-status-overrides";

export type LeadStatus = Lead["status"];

export const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "scheduled",
  "converted",
  "lost",
];

export function loadStatusOverrides(): Record<string, LeadStatus> {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(LEAD_STATUS_OVERRIDES_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, LeadStatus>;
  } catch {
    return {};
  }
}

export function saveStatusOverrides(overrides: Record<string, LeadStatus>) {
  sessionStorage.setItem(LEAD_STATUS_OVERRIDES_KEY, JSON.stringify(overrides));
}

export function applyStatusOverrides(leads: Lead[]): Lead[] {
  const overrides = loadStatusOverrides();
  return leads.map((lead) =>
    overrides[lead.id] ? { ...lead, status: overrides[lead.id] } : lead
  );
}

export function persistColumnState(columns: Record<string, Lead[]>) {
  const overrides = loadStatusOverrides();
  for (const [status, items] of Object.entries(columns)) {
    for (const lead of items) {
      overrides[lead.id] = status as LeadStatus;
    }
  }
  saveStatusOverrides(overrides);
}

export function groupLeadsByStatus(
  leads: Lead[]
): Record<LeadStatus, Lead[]> {
  const columns = Object.fromEntries(
    LEAD_STATUSES.map((status) => [status, [] as Lead[]])
  ) as Record<LeadStatus, Lead[]>;

  for (const lead of leads) {
    columns[lead.status].push(lead);
  }

  return columns;
}
