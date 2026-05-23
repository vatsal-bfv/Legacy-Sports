"use client";

import Link from "next/link";
import { InsightCard } from "@/components/app/InsightCard";
import { NaturalLanguageInput } from "@/components/app/NaturalLanguageInput";
import { useLocationScope } from "@/components/app/LocationProvider";
import { useLeads } from "@/components/app/LeadsRealtimeProvider";
import { demoStore } from "@/lib/demo/store";
import { HERO_IDS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { useMemo } from "react";

export function CommandCenterClient() {
  const { locationId } = useLocationScope();
  const { leads, newLeadIds } = useLeads();

  const scopedAthletes = useMemo(
    () =>
      demoStore.athletes.filter(
        (a) => !locationId || a.home_location_id === locationId
      ),
    [locationId]
  );

  const atRisk = scopedAthletes.filter((a) => a.status === "at_risk");
  const recentLeads = leads
    .filter((l) => !locationId || l.interested_location_id === locationId)
    .slice(0, 5);
  const failedPayments = demoStore.payments.filter((p) => p.status === "failed");
  const sessions = demoStore.sessions.filter(
    (s) => !locationId || s.location_id === locationId
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#F5F6F7]">Good morning, Amber</h1>
        <p className="text-[#9DA3AE]">
          Here&apos;s what needs your attention today
          {locationId
            ? ` · ${demoStore.locations.find((l) => l.id === locationId)?.name}`
            : " · All locations"}
          .
        </p>
        {newLeadIds.size > 0 && (
          <Link
            href="/command-os/leads"
            className="mt-2 inline-flex items-center gap-2 rounded-md bg-[#3B82F6]/20 px-3 py-1.5 text-sm text-[#3B82F6] hover:bg-[#3B82F6]/30"
          >
            {newLeadIds.size} new lead{newLeadIds.size > 1 ? "s" : ""} — view
            kanban →
          </Link>
        )}
      </div>

      <div className="md:hidden">
        <NaturalLanguageInput />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <InsightCard
          title="At-risk members"
          value={String(atRisk.length)}
          subtitle="↑ 2 from last week"
          href="/command-os/retention"
          accent="red"
        />
        <InsightCard
          title="Hero spotlight"
          value="Marcus Johnson"
          subtitle="Up 8% vertical this quarter"
          href={`/command-os/athletes/${HERO_IDS.marcus}`}
          accent="orange"
        />
        <InsightCard
          title="Utilization anomaly"
          value={locationId ? "−12%" : "Mesa −12%"}
          subtitle="Below 30-day average"
          accent="blue"
        />
        <InsightCard
          title="Cohort enrollment"
          value="+14%"
          subtitle="Youth Performance Q2"
          accent="green"
        />
        <InsightCard
          title="Failed payments"
          value={String(failedPayments.length)}
          subtitle="This week — action needed"
          accent="red"
        />
        <InsightCard
          title="Coach satisfaction"
          value="4.8 / 5"
          subtitle="Based on 42 parent surveys"
          accent="green"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg border border-[#2A2D34] bg-[#15171B] p-6">
          <h2 className="mb-4 font-semibold">Recent activity</h2>
          <ul className="space-y-3">
            {recentLeads.map((lead) => (
              <li
                key={lead.id}
                className="flex items-center justify-between border-b border-[#2A2D34]/50 pb-3 text-sm"
              >
                <span className={newLeadIds.has(lead.id) ? "text-[#3B82F6]" : ""}>
                  New lead: {lead.first_name} {lead.last_name}
                  {newLeadIds.has(lead.id) && " · just now"}
                </span>
                <span className="text-[#9DA3AE]">{formatDate(lead.created_at)}</span>
              </li>
            ))}
            <li className="text-sm text-[#9DA3AE]">
              Session completed — Phoenix Combine Prep
            </li>
            <li className="text-sm text-[#9DA3AE]">
              Payment received — Marcus Johnson
            </li>
          </ul>
        </div>
        <div className="rounded-lg border border-[#2A2D34] bg-[#15171B] p-6">
          <h2 className="mb-4 font-semibold">Today&apos;s schedule</h2>
          <ul className="space-y-2 text-sm">
            {sessions.slice(0, 6).map((s) => {
              const loc = demoStore.locations.find((l) => l.id === s.location_id);
              return (
                <li key={s.id} className="text-[#9DA3AE]">
                  {new Date(s.starts_at).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}{" "}
                  — {loc?.name} · Room {s.room}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
