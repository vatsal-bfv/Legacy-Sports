"use client";

import Link from "next/link";
import { InsightCard } from "@/components/app/InsightCard";
import { useLocationScope } from "@/components/app/LocationProvider";
import { useLeads } from "@/components/app/LeadsRealtimeProvider";
import { demoStore } from "@/lib/demo/store";
import { HERO_IDS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import {
  getLowestUtilizationLocation,
  UTILIZATION_ANOMALY_DELTA,
} from "@/lib/demo/location-utilization";
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

  const utilizationAnomalyLocation = useMemo(
    () => getLowestUtilizationLocation(),
    []
  );

  const utilizationAnomalyValue = locationId
    ? UTILIZATION_ANOMALY_DELTA
    : `${utilizationAnomalyLocation.name} ${UTILIZATION_ANOMALY_DELTA}`;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-orange">
          [ Dashboard ]
        </p>
        <h1 className="mt-3 text-[clamp(28px,4vw,36px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-pitch">
          Good morning, Amber
        </h1>
        <p className="mt-2 text-slate">
          Here&apos;s what needs your attention today
          {locationId
            ? ` · ${demoStore.locations.find((l) => l.id === locationId)?.name}`
            : " · All locations"}
          .
        </p>
        {newLeadIds.size > 0 && (
          <Link
            href="/command-os/leads"
            className="mt-3 inline-flex items-center gap-2 rounded-[8px] bg-orange/10 px-3 py-1.5 text-sm font-medium text-orange hover:bg-orange/15"
          >
            {newLeadIds.size} new lead{newLeadIds.size > 1 ? "s" : ""} — view
            kanban →
          </Link>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <InsightCard
          title="At-risk members"
          value={String(atRisk.length)}
          subtitle="↑ 2 from last week"
          href="/command-os/communications?retention=at_risk"
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
          value={utilizationAnomalyValue}
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
        <div className="rounded-[14px] border border-bone bg-chalk p-6 lg:col-span-2">
          <h2 className="font-extrabold tracking-[-0.02em] text-pitch">
            Recent activity
          </h2>
          <ul className="mt-4 space-y-3">
            {recentLeads.map((lead) => (
              <li
                key={lead.id}
                className="flex items-center justify-between border-b border-bone/50 pb-3 text-sm"
              >
                <span className={newLeadIds.has(lead.id) ? "font-medium text-orange" : "text-pitch"}>
                  New lead: {lead.first_name} {lead.last_name}
                  {newLeadIds.has(lead.id) && " · just now"}
                </span>
                <span className="text-slate">{formatDate(lead.created_at)}</span>
              </li>
            ))}
            <li className="text-sm text-slate">
              Session completed — Suwanee HS Combine Prep
            </li>
            <li className="text-sm text-slate">
              Payment received — Marcus Johnson
            </li>
          </ul>
        </div>
        <div className="rounded-[14px] border border-bone bg-chalk p-6">
          <h2 className="font-extrabold tracking-[-0.02em] text-pitch">
            Today&apos;s schedule
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {sessions.slice(0, 6).map((s) => {
              const loc = demoStore.locations.find((l) => l.id === s.location_id);
              return (
                <li key={s.id} className="text-slate">
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
