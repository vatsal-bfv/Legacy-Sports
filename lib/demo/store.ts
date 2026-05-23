import {
  athletes,
  attendance,
  coachNotes,
  coaches,
  initialLeads,
  locations,
  measurables,
  payments,
  programs,
  scoutUsers,
  sessions,
  videoClips,
  wearables,
} from "./data";
import { messages as seedMessages } from "./messages-seed";
import type { Lead, Message } from "./types";

let leads: Lead[] = [...initialLeads];
let allMessages: Message[] = [...seedMessages];

export const demoStore = {
  get locations() {
    return locations;
  },
  get programs() {
    return programs;
  },
  get coaches() {
    return coaches;
  },
  get athletes() {
    return athletes;
  },
  get measurables() {
    return measurables;
  },
  get attendance() {
    return attendance;
  },
  get sessions() {
    return sessions;
  },
  get messages() {
    return allMessages;
  },
  get payments() {
    return payments;
  },
  get scoutUsers() {
    return scoutUsers;
  },
  get videoClips() {
    return videoClips;
  },
  get coachNotes() {
    return coachNotes;
  },
  get wearables() {
    return wearables;
  },
  get leads() {
    return leads;
  },
  addLead(lead: Lead) {
    leads = [lead, ...leads];
    return lead;
  },
  addMessage(msg: Message) {
    allMessages = [...allMessages, msg];
    return msg;
  },
  updateLead(id: string, patch: Partial<Lead>) {
    leads = leads.map((l) => (l.id === id ? { ...l, ...patch } : l));
  },
  getLeadsSince(since: string) {
    return leads.filter((l) => l.created_at > since);
  },
  getMessagesSince(since: string) {
    return allMessages.filter((m) => m.created_at > since);
  },
  markThreadRead(athleteId: string | null, leadId: string | null) {
    const now = new Date().toISOString();
    allMessages = allMessages.map((m) => {
      const inThread =
        (athleteId && m.athlete_id === athleteId) ||
        (leadId && m.lead_id === leadId);
      if (inThread && !m.read_at && m.direction === "inbound") {
        return { ...m, read_at: now };
      }
      return m;
    });
  },
};
