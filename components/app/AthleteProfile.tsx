"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { demoStore } from "@/lib/demo/store";
import type { Athlete, CoachNote } from "@/lib/demo/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { HERO_IDS } from "@/lib/constants";
import { AthleteCommsTab } from "@/components/app/AthleteCommsTab";
import { MessageSquare, Pencil } from "lucide-react";

function buildCalendarHeatmap(attendance: { checked_in_at: string; status: string }[]) {
  const weeks: { date: string; status: string }[][] = [];
  let currentWeek: { date: string; status: string }[] = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const att = attendance.find((a) => a.checked_in_at.startsWith(dateStr));
    currentWeek.push({
      date: dateStr,
      status: att?.status ?? "none",
    });
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length) weeks.push(currentWeek);
  return weeks;
}

/** Y-axis domain padded around data min/max so trends aren't flattened at zero. */
function trendYDomain(values: number[], paddingRatio = 0.12): [number, number] {
  if (values.length === 0) return [0, 1];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min;
  const pad =
    span === 0
      ? Math.max(Math.abs(min) * 0.08, min * 0.05 || 1)
      : span * paddingRatio;
  return [min - pad, max + pad];
}

export function AthleteProfile({ athlete }: { athlete: Athlete }) {
  const measurables = demoStore.measurables.filter(
    (m) => m.athlete_id === athlete.id
  );
  const wearables = demoStore.wearables.filter((w) => w.athlete_id === athlete.id);
  const seedNotes = demoStore.coachNotes.filter((n) => n.athlete_id === athlete.id);
  const [localNotes, setLocalNotes] = useState<CoachNote[]>([]);
  const notes = [...seedNotes, ...localNotes];
  const videos = demoStore.videoClips.filter((v) => v.athlete_id === athlete.id);
  const attendance = demoStore.attendance.filter((a) => a.athlete_id === athlete.id);
  const [noteDraft, setNoteDraft] = useState("");
  const [showAiSummary, setShowAiSummary] = useState(true);
  const program = demoStore.programs.find((p) => p.id === athlete.program_id);
  const location = demoStore.locations.find(
    (l) => l.id === athlete.home_location_id
  );

  const verticalChart = useMemo(
    () =>
      measurables
        .filter((m) => m.metric === "vertical")
        .sort(
          (a, b) =>
            new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
        )
        .map((m) => ({
          label: new Date(m.recorded_at).toLocaleDateString("en-US", {
            month: "short",
            year: "2-digit",
          }),
          value: m.value,
        })),
    [measurables]
  );

  const fortyChart = useMemo(
    () =>
      measurables
        .filter((m) => m.metric === "forty_yard")
        .sort(
          (a, b) =>
            new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
        )
        .map((m) => ({
          label: new Date(m.recorded_at).toLocaleDateString("en-US", {
            month: "short",
            year: "2-digit",
          }),
          value: m.value,
        })),
    [measurables]
  );

  const verticalDomain = useMemo(
    () => trendYDomain(verticalChart.map((d) => d.value)),
    [verticalChart]
  );

  const fortyDomain = useMemo(
    () => trendYDomain(fortyChart.map((d) => d.value), 0.25),
    [fortyChart]
  );

  const recovery30 = useMemo(() => {
    const cutoff = Date.now() - 30 * 86400000;
    const byDay = new Map<string, number>();
    wearables
      .filter(
        (w) =>
          w.metric === "recovery_score" &&
          new Date(w.recorded_at).getTime() >= cutoff
      )
      .forEach((w) => {
        const day = w.recorded_at.slice(0, 10);
        byDay.set(day, w.value);
      });
    return Array.from(byDay.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, value]) => ({
        date: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        value: Math.round(value),
      }));
  }, [wearables]);

  const sleep30 = useMemo(() => {
    const cutoff = Date.now() - 30 * 86400000;
    const byDay = new Map<string, number>();
    wearables
      .filter(
        (w) =>
          w.metric === "sleep_hours" &&
          new Date(w.recorded_at).getTime() >= cutoff
      )
      .forEach((w) => {
        const day = w.recorded_at.slice(0, 10);
        byDay.set(day, Math.round(w.value * 10) / 10);
      });
    return Array.from(byDay.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, value]) => ({
        date: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        value,
      }));
  }, [wearables]);

  const sleepDomain = useMemo(
    () => trendYDomain(sleep30.map((d) => d.value)),
    [sleep30]
  );

  const heatmap = buildCalendarHeatmap(attendance);
  const hasWearables = wearables.length > 0;
  const latestRecovery = wearables
    .filter((w) => w.metric === "recovery_score")
    .slice(-1)[0];
  const latestSleep = wearables
    .filter((w) => w.metric === "sleep_hours")
    .slice(-1)[0];

  function addNote() {
    if (!noteDraft.trim()) return;
    setLocalNotes((prev) => [
      ...prev,
      {
        id: `local-note-${Date.now()}`,
        athlete_id: athlete.id,
        coach_id: demoStore.coaches[0].id,
        created_at: new Date().toISOString(),
        content: noteDraft.trim(),
        tags: [],
      },
    ]);
    setNoteDraft("");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex flex-wrap items-start gap-6">
            <Image
              src={athlete.photo_url}
              alt=""
              width={96}
              height={96}
              className="rounded-xl"
            />
            <div>
              <h1 className="text-3xl font-bold">
                {athlete.first_name} {athlete.last_name}
              </h1>
              <p className="text-slate">
                {athlete.sport}
                {athlete.position ? ` · ${athlete.position}` : ""} · {program?.name}{" "}
                · {location?.name}
              </p>
              <div className="mt-2 flex gap-2">
                <Badge
                  variant={athlete.status === "at_risk" ? "danger" : "success"}
                >
                  {athlete.status.replace("_", " ")}
                </Badge>
                <Badge>{athlete.recruit_status}</Badge>
              </div>
              <p className="mt-2 text-sm text-slate">
                Parent: {athlete.parent_name} · {athlete.parent_email}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/command-os/communications?athlete=${athlete.id}`}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </Link>
            </Button>
            <Button variant="outline" size="sm" disabled title="Demo read-only">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="measurables">Measurables</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent measurables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {measurables.slice(-4).map((m) => (
                    <div key={m.id} className="rounded-lg bg-field px-4 py-3">
                      <p className="text-xs text-slate">
                        {m.metric.replace("_", " ")}
                        {m.is_pr && " · PR"}
                      </p>
                      <p className="text-xl font-bold">
                        {m.value} {m.unit}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="measurables" className="space-y-6">
            {verticalChart.length === 0 && fortyChart.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-sm text-slate">
                  No performance trend data yet
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {verticalChart.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Vertical jump</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={verticalChart}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E2DB" />
                          <XAxis dataKey="label" stroke="#8C8880" fontSize={12} />
                          <YAxis
                            stroke="#8C8880"
                            fontSize={12}
                            domain={verticalDomain}
                            tickFormatter={(v) => `${Math.round(v)}"`}
                            width={40}
                          />
                          <Tooltip
                            contentStyle={{
                              background: "#F0EEE9",
                              border: "1px solid #E5E2DB",
                            }}
                            formatter={(value) => [`${Number(value)}"`, "Vertical"]}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#FF5A1F"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
                {fortyChart.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">40-yard dash</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={fortyChart}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E2DB" />
                          <XAxis dataKey="label" stroke="#8C8880" fontSize={12} />
                          <YAxis
                            stroke="#8C8880"
                            fontSize={12}
                            domain={fortyDomain}
                            tickFormatter={(v) => `${Number(v).toFixed(2)}s`}
                            width={48}
                          />
                          <Tooltip
                            contentStyle={{
                              background: "#F0EEE9",
                              border: "1px solid #E5E2DB",
                            }}
                            formatter={(value) => [`${Number(value)}s`, "40-yd"]}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#FF5A1F"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {hasWearables ? (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-slate">Wearables</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-slate">Recovery score</p>
                      <p className="text-3xl font-bold">
                        {latestRecovery?.value.toFixed(0) ?? "—"}%
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-slate">Last night sleep</p>
                      <p className="text-3xl font-bold">
                        {latestSleep ? `${latestSleep.value.toFixed(1)}h` : "—"}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-slate">Connected device</p>
                      <p className="text-lg font-medium">WHOOP</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">30-day recovery trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={recovery30}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E2DB" />
                          <XAxis dataKey="date" stroke="#8C8880" fontSize={10} />
                          <YAxis stroke="#8C8880" fontSize={12} domain={[0, 100]} />
                          <Tooltip
                            contentStyle={{
                              background: "#F0EEE9",
                              border: "1px solid #E5E2DB",
                            }}
                            formatter={(value) => [`${value}%`, "Recovery"]}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#10B981"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">30-day sleep trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={sleep30}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E2DB" />
                          <XAxis dataKey="date" stroke="#8C8880" fontSize={10} />
                          <YAxis
                            stroke="#8C8880"
                            fontSize={12}
                            domain={sleepDomain}
                            tickFormatter={(v) => `${Number(v).toFixed(1)}h`}
                            width={44}
                          />
                          <Tooltip
                            contentStyle={{
                              background: "#F0EEE9",
                              border: "1px solid #E5E2DB",
                            }}
                            formatter={(value) => [`${Number(value).toFixed(1)}h`, "Sleep"]}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#8B5CF6"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Wearables</CardTitle>
                </CardHeader>
                <CardContent className="py-8 text-center text-slate">
                  Not connected — invite to link wearable
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="attendance">
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4 text-sm">
                  {attendance.filter((a) => a.status === "attended").length}{" "}
                  sessions attended · 90-day calendar
                </p>
                <div className="space-y-1">
                  {heatmap.map((week, wi) => (
                    <div key={wi} className="flex gap-1">
                      {week.map((day) => (
                        <div
                          key={day.date}
                          className={`h-3 w-3 rounded-sm ${
                            day.status === "attended"
                              ? "bg-emerald-500/70"
                              : day.status === "no_show"
                                ? "bg-red-500/70"
                                : "bg-bone"
                          }`}
                          title={`${day.date}: ${day.status}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Add a coach note..."
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  rows={2}
                  className="flex-1"
                />
                <Button onClick={addNote} className="self-end">
                  Add note
                </Button>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate">
                <input
                  type="checkbox"
                  checked={showAiSummary}
                  onChange={(e) => setShowAiSummary(e.target.checked)}
                  className="h-4 w-4 rounded border-bone"
                />
                Show AI summary of notes
              </label>
              {showAiSummary && notes.length > 0 && (
                <Card className="border-orange/30 bg-orange/5">
                  <CardContent className="pt-4 text-sm text-slate">
                    AI summary: {notes.length} notes logged. Recent themes:{" "}
                    {[...new Set(notes.flatMap((n) => n.tags))].join(", ") ||
                      "training progress, engagement"}
                    .
                  </CardContent>
                </Card>
              )}
              {notes.map((n) => (
                <Card key={n.id}>
                  <CardContent className="pt-4">
                    <p className="text-sm text-pitch">{n.content}</p>
                    <p className="mt-2 text-xs text-slate">
                      {new Date(n.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="video">
            <div className="grid gap-4 sm:grid-cols-2">
              {videos.length ? (
                videos.map((v) => (
                  <Card key={v.id}>
                    <CardContent className="pt-4">
                      <p className="font-medium">{v.title}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {v.ai_tags.map((t) => (
                          <Badge key={t} variant="default">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-slate">No video clips</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="communications">
            <AthleteCommsTab athleteId={athlete.id} />
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-4">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="text-sm text-slate">AI Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-pitch">
              {athlete.ai_summary}
            </p>
          </CardContent>
        </Card>
        {athlete.id === HERO_IDS.marcus && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Suggested actions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate">
                Recommend introducing to Coach Mike Chen — Sun Devil State
                University (active scout viewing your data).
              </p>
              <Link
                href="/command-os/scouts"
                className="mt-2 inline-block text-sm text-orange hover:underline"
              >
                View scouts →
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
