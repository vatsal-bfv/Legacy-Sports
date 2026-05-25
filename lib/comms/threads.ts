import type { Athlete, Lead, Message } from "@/lib/demo/types";

export type RetentionStatus = Athlete["status"];

export type CommsThread = {
  id: string;
  type: "athlete" | "lead";
  athleteId: string | null;
  leadId: string | null;
  locationId: string;
  title: string;
  subtitle: string;
  messages: Message[];
  lastMessageAt: string;
  unreadCount: number;
  channels: string[];
  /** Member retention status — athlete threads only. */
  retentionStatus: RetentionStatus | null;
  riskScore: number | null;
};

export type CommsFilters = {
  channel: "all" | "sms" | "email" | "in_app";
  unreadOnly: boolean;
  partyType: "all" | "athlete" | "lead";
  locationId: string;
  retentionStatus: "all" | RetentionStatus;
};

export const DEFAULT_COMMS_FILTERS: CommsFilters = {
  channel: "all",
  unreadOnly: false,
  partyType: "all",
  locationId: "all",
  retentionStatus: "all",
};

export function retentionStatusLabel(status: RetentionStatus | null): string | null {
  if (!status) return null;
  const labels: Record<RetentionStatus, string> = {
    active: "Active",
    at_risk: "At risk",
    paused: "Paused",
    churned: "Churned",
  };
  return labels[status];
}

export function retentionBadgeVariant(
  status: RetentionStatus
): "success" | "warning" | "danger" | "default" {
  if (status === "at_risk") return "danger";
  if (status === "churned") return "default";
  if (status === "paused") return "warning";
  return "success";
}

function threadKey(message: Message): string | null {
  if (message.athlete_id) return `athlete:${message.athlete_id}`;
  if (message.lead_id) return `lead:${message.lead_id}`;
  return null;
}

export function buildThreads(
  messages: Message[],
  athletes: Athlete[],
  leads: Lead[]
): CommsThread[] {
  const grouped = new Map<string, Message[]>();

  for (const msg of messages) {
    const key = threadKey(msg);
    if (!key) continue;
    const list = grouped.get(key) ?? [];
    list.push(msg);
    grouped.set(key, list);
  }

  const threads: CommsThread[] = [];

  for (const [key, msgs] of grouped) {
    const sorted = [...msgs].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    const last = sorted[sorted.length - 1];
    const unreadCount = sorted.filter(
      (m) => m.direction === "inbound" && !m.read_at
    ).length;
    const channels = [...new Set(sorted.map((m) => m.channel))];

    if (key.startsWith("athlete:")) {
      const athleteId = key.replace("athlete:", "");
      const athlete = athletes.find((a) => a.id === athleteId);
      if (!athlete) continue;
      threads.push({
        id: key,
        type: "athlete",
        athleteId,
        leadId: null,
        locationId: athlete.home_location_id,
        title: `${athlete.first_name} ${athlete.last_name}`,
        subtitle: athlete.parent_name,
        messages: sorted,
        lastMessageAt: last.created_at,
        unreadCount,
        channels,
        retentionStatus: athlete.status,
        riskScore: athlete.risk_score ?? null,
      });
    } else {
      const leadId = key.replace("lead:", "");
      const lead = leads.find((l) => l.id === leadId);
      if (!lead) continue;
      threads.push({
        id: key,
        type: "lead",
        athleteId: null,
        leadId,
        locationId: lead.interested_location_id,
        title: `${lead.first_name} ${lead.last_name}`,
        subtitle: lead.athlete_name
          ? `${lead.athlete_name}, age ${lead.athlete_age}`
          : "Website lead",
        messages: sorted,
        lastMessageAt: last.created_at,
        unreadCount,
        channels,
        retentionStatus: null,
        riskScore: null,
      });
    }
  }

  return threads.sort(
    (a, b) =>
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );
}

export function filterThreads(
  threads: CommsThread[],
  filters: CommsFilters
): CommsThread[] {
  return threads.filter((thread) => {
    if (filters.partyType === "athlete" && thread.type !== "athlete") {
      return false;
    }
    if (filters.partyType === "lead" && thread.type !== "lead") {
      return false;
    }
    if (
      filters.locationId !== "all" &&
      thread.locationId !== filters.locationId
    ) {
      return false;
    }
    if (filters.unreadOnly && thread.unreadCount === 0) {
      return false;
    }
    if (
      filters.channel !== "all" &&
      !thread.channels.includes(filters.channel)
    ) {
      return false;
    }
    if (filters.retentionStatus !== "all") {
      if (thread.retentionStatus !== filters.retentionStatus) {
        return false;
      }
    }
    return true;
  });
}

export function formatMessageTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function channelLabel(channel: string) {
  if (channel === "sms") return "SMS";
  if (channel === "email") return "Email";
  if (channel === "in_app") return "In-app";
  return channel;
}

export function partyLabel(fromParty: string) {
  const labels: Record<string, string> = {
    coach: "Coach",
    parent: "Parent",
    athlete: "Athlete",
    lead: "Lead",
    system: "System",
  };
  return labels[fromParty] ?? fromParty;
}
