"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Lead, Message } from "@/lib/demo/types";
import { demoStore } from "@/lib/demo/store";
import { MessageThread } from "@/components/app/MessageThread";
import { CommsReplyBox } from "@/components/app/CommsReplyBox";
import { useComms } from "@/components/app/MessagesRealtimeProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function LeadDetailDialog({
  lead,
  open,
  onClose,
  onLeadUpdated,
}: {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onLeadUpdated?: (lead: Lead) => void;
}) {
  const { messages, appendMessage } = useComms();
  const [assignedCoachId, setAssignedCoachId] = useState<string>("");
  const [converted, setConverted] = useState(false);

  useEffect(() => {
    if (lead) {
      setAssignedCoachId(lead.assigned_coach_id ?? "");
      setConverted(lead.status === "converted");
    }
  }, [lead]);

  if (!lead) return null;

  const threadMessages = messages
    .filter((m) => m.lead_id === lead.id)
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

  const location = demoStore.locations.find(
    (l) => l.id === lead.interested_location_id
  );
  const program = demoStore.programs.find(
    (p) => p.id === lead.interested_program_id
  );

  async function assignCoach() {
    const res = await fetch(`/api/leads/${lead!.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assigned_coach_id: assignedCoachId || null }),
    });
    if (res.ok) {
      const data = await res.json();
      onLeadUpdated?.(data.lead);
    }
  }

  async function convertToAthlete() {
    const res = await fetch(`/api/leads/${lead!.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "converted" }),
    });
    if (res.ok) {
      const data = await res.json();
      setConverted(true);
      onLeadUpdated?.(data.lead);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto border-bone bg-chalk text-pitch">
        <DialogHeader>
          <DialogTitle>
            {lead.first_name} {lead.last_name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 text-sm">
          <div className="flex flex-col gap-1 text-slate">
            <p>{lead.email}</p>
            <p>{lead.phone}</p>
            {lead.athlete_name && (
              <p>
                Athlete: {lead.athlete_name}, age {lead.athlete_age}
              </p>
            )}
            <p>
              {program?.name} · {location?.name}
            </p>
            <p className="capitalize">Status: {lead.status.replace("_", " ")}</p>
          </div>

          {lead.notes && (
            <p className="rounded-lg bg-field p-3">{lead.notes}</p>
          )}

          <div>
            <p className="mb-2 font-medium">Assign coach</p>
            <div className="flex gap-2">
              <select
                value={assignedCoachId}
                onChange={(e) => setAssignedCoachId(e.target.value)}
                className="h-9 flex-1 rounded-md border border-bone bg-field px-3 text-sm"
              >
                <option value="">Unassigned</option>
                {demoStore.coaches.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.first_name} {c.last_name}
                  </option>
                ))}
              </select>
              <Button type="button" size="sm" variant="outline" onClick={assignCoach}>
                Save
              </Button>
            </div>
          </div>

          <div>
            <p className="mb-2 font-medium">Message thread</p>
            <MessageThread messages={threadMessages} compact />
            <CommsReplyBox
              leadId={lead.id}
              onSent={(msg?: Message) => {
                if (msg) appendMessage(msg);
              }}
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              type="button"
              size="sm"
              onClick={convertToAthlete}
              disabled={converted}
            >
              {converted ? "Converted ✓" : "Convert to athlete"}
            </Button>
            <Button type="button" size="sm" variant="outline" asChild>
              <Link href="/command-os/communications">Open in Comms Hub</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
