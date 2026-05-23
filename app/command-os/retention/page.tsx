"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { demoStore } from "@/lib/demo/store";
import { HERO_IDS, COACH_RODRIGUEZ_ID } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function RetentionPage() {
  const atRisk = demoStore.athletes
    .filter((a) => a.status === "at_risk")
    .sort((a, b) => (b.risk_score ?? 0) - (a.risk_score ?? 0));
  const [draftOpen, setDraftOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function draftMessage(athleteId: string) {
    setSelectedId(athleteId);
    setLoading(true);
    setSent(false);
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
    setMessage(data.message);
    setLoading(false);
    setDraftOpen(true);
  }

  async function sendMessage() {
    if (!selectedId) return;
    await fetch("/api/ai/draft-message", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ athlete_id: selectedId, body: message }),
    });
    setSent(true);
    setTimeout(() => setDraftOpen(false), 1500);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Retention</h1>
        <p className="text-[#9DA3AE]">
          {atRisk.length} at-risk members · Churn rate 4.2%
        </p>
      </div>
      <div className="overflow-hidden rounded-lg border border-[#2A2D34]">
        <table className="w-full text-sm">
          <thead className="bg-[#12141A] text-left text-[#9DA3AE]">
            <tr>
              <th className="p-4">Athlete</th>
              <th className="p-4">Risk score</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {atRisk.map((a) => (
              <tr key={a.id} className="border-t border-[#2A2D34]/50">
                <td className="p-4">
                  <Link
                    href={`/command-os/athletes/${a.id}`}
                    className="flex items-center gap-3"
                  >
                    <Image
                      src={a.photo_url}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    {a.first_name} {a.last_name}
                  </Link>
                </td>
                <td className="p-4">
                  <Badge variant="danger">{a.risk_score ?? 70}%</Badge>
                </td>
                <td className="p-4">
                  <Button
                    size="sm"
                    onClick={() => draftMessage(a.id)}
                  >
                    Draft re-engagement message
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={draftOpen} onOpenChange={setDraftOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedId === HERO_IDS.tyler
                ? "Re-engage Tyler Chen"
                : "Draft message"}
            </DialogTitle>
          </DialogHeader>
          {loading ? (
            <p className="text-[#9DA3AE]">Generating...</p>
          ) : (
            <>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
              <Button onClick={sendMessage} disabled={sent}>
                {sent ? "Sent ✓" : "Send"}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
