"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { demoStore } from "@/lib/demo/store";
import { HERO_IDS, COACH_RODRIGUEZ_ID } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

export default function RetentionPage() {
  const atRisk = demoStore.athletes
    .filter((a) => a.status === "at_risk")
    .sort((a, b) => (b.risk_score ?? 0) - (a.risk_score ?? 0));
  const [sheetOpen, setSheetOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = atRisk.find((a) => a.id === selectedId);
  const attendance = selected
    ? demoStore.attendance.filter((a) => a.athlete_id === selected.id)
    : [];

  async function draftMessage(athleteId: string) {
    setSelectedId(athleteId);
    setLoading(true);
    setSent(false);
    setSheetOpen(true);
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
  }

  async function sendMessage() {
    if (!selectedId) return;
    await fetch("/api/ai/draft-message", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ athlete_id: selectedId, body: message }),
    });
    setSent(true);
    setTimeout(() => setSheetOpen(false), 1500);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Retention</h1>
        <p className="text-slate">
          {atRisk.length} at-risk members · Churn rate 4.2%
        </p>
      </div>
      <div className="overflow-hidden rounded-lg border border-bone">
        <table className="w-full text-sm">
          <thead className="bg-field text-left text-slate">
            <tr>
              <th className="p-4">Athlete</th>
              <th className="p-4">Risk score</th>
              <th className="p-4">Missed sessions</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {atRisk.map((a) => {
              const missed = demoStore.attendance.filter(
                (att) =>
                  att.athlete_id === a.id && att.status === "no_show"
              ).length;
              return (
                <tr key={a.id} className="border-t border-bone/50">
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
                  <td className="p-4 text-slate">{missed}</td>
                  <td className="p-4">
                    <Button size="sm" onClick={() => draftMessage(a.id)}>
                      Draft re-engagement message
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="w-full border-bone bg-chalk text-pitch sm:max-w-lg [&_[data-slot=sheet-title]]:text-pitch [&_[data-slot=sheet-close]]:text-slate [&_[data-slot=sheet-close]]:hover:bg-bone [&_[data-slot=sheet-close]]:hover:text-pitch"
        >
          <SheetHeader className="border-b border-bone pb-4">
            <SheetTitle>
              {selectedId === HERO_IDS.tyler
                ? "Re-engage Tyler Chen"
                : "Draft re-engagement message"}
            </SheetTitle>
          </SheetHeader>
          {selected && (
            <div className="space-y-4 px-4 pb-4">
              <div>
                <p className="text-sm font-medium">Attendance pattern</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {attendance.slice(0, 14).map((att) => (
                    <div
                      key={att.id}
                      className={`h-6 w-6 rounded-sm ${
                        att.status === "attended"
                          ? "bg-emerald-500/50"
                          : "bg-red-500/50"
                      }`}
                      title={att.status}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs text-slate">
                  Last 14 sessions · green = attended, red = missed
                </p>
              </div>
              {loading ? (
                <p className="text-slate">Generating with AI...</p>
              ) : (
                <>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                  />
                  <Button onClick={sendMessage} disabled={sent} className="w-full">
                    {sent ? "Sent ✓" : "Send"}
                  </Button>
                </>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
