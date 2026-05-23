"use client";

import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demoStore } from "@/lib/demo/store";
import type { Athlete } from "@/lib/demo/types";
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

export function AthleteProfile({ athlete }: { athlete: Athlete }) {
  const measurables = demoStore.measurables.filter(
    (m) => m.athlete_id === athlete.id
  );
  const wearables = demoStore.wearables.filter((w) => w.athlete_id === athlete.id);
  const notes = demoStore.coachNotes.filter((n) => n.athlete_id === athlete.id);
  const videos = demoStore.videoClips.filter((v) => v.athlete_id === athlete.id);
  const msgs = demoStore.messages.filter((m) => m.athlete_id === athlete.id);
  const attendance = demoStore.attendance.filter((a) => a.athlete_id === athlete.id);
  const program = demoStore.programs.find((p) => p.id === athlete.program_id);
  const location = demoStore.locations.find(
    (l) => l.id === athlete.home_location_id
  );

  const vertData = measurables
    .filter((m) => m.metric === "vertical" || m.metric === "forty_yard")
    .map((m) => ({
      date: new Date(m.recorded_at).toLocaleDateString("en-US", {
        month: "short",
      }),
      value: m.value,
      metric: m.metric,
    }));

  const hasWearables = wearables.length > 0;
  const latestRecovery = wearables
    .filter((w) => w.metric === "recovery_score")
    .slice(-1)[0];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
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
            <p className="text-[#9DA3AE]">
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
            <p className="mt-2 text-sm text-[#9DA3AE]">
              Parent: {athlete.parent_name} · {athlete.parent_email}
            </p>
          </div>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="measurables">Measurables</TabsTrigger>
            <TabsTrigger value="wearables">Wearables</TabsTrigger>
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
                    <div key={m.id} className="rounded-lg bg-[#0A0B0D] px-4 py-3">
                      <p className="text-xs text-[#9DA3AE]">
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

          <TabsContent value="measurables">
            <Card>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={vertData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2D34" />
                    <XAxis dataKey="date" stroke="#9DA3AE" fontSize={12} />
                    <YAxis stroke="#9DA3AE" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "#15171B",
                        border: "1px solid #2A2D34",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3B82F6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wearables">
            {hasWearables ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-[#9DA3AE]">Recovery score</p>
                    <p className="text-3xl font-bold">
                      {latestRecovery?.value.toFixed(0) ?? "—"}%
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-[#9DA3AE]">Connected device</p>
                    <p className="text-lg font-medium">WHOOP</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-[#9DA3AE]">
                  Not connected — invite to link wearable
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="attendance">
            <Card>
              <CardContent className="pt-6">
                <p className="mb-2 text-sm">
                  Streak:{" "}
                  {attendance.filter((a) => a.status === "attended").length}{" "}
                  sessions logged
                </p>
                <div className="flex flex-wrap gap-1">
                  {attendance.slice(0, 20).map((a) => (
                    <div
                      key={a.id}
                      className={`h-8 w-8 rounded ${
                        a.status === "attended"
                          ? "bg-emerald-500/40"
                          : "bg-red-500/40"
                      }`}
                      title={a.status}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <div className="space-y-3">
              {notes.map((n) => (
                <Card key={n.id}>
                  <CardContent className="pt-4">
                    <p className="text-sm text-[#F5F6F7]">{n.content}</p>
                    <p className="mt-2 text-xs text-[#9DA3AE]">
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
                <p className="text-[#9DA3AE]">No video clips</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="communications">
            <div className="space-y-3">
              {msgs.map((m) => (
                <div
                  key={m.id}
                  className={`rounded-lg p-4 text-sm ${
                    m.direction === "outbound"
                      ? "ml-8 bg-[#3B82F6]/20"
                      : "mr-8 bg-[#15171B]"
                  }`}
                >
                  {m.body}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-4">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="text-sm text-[#9DA3AE]">AI Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-[#F5F6F7]">
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
              <p className="text-sm text-[#9DA3AE]">
                Recommend introducing to Coach Mike Chen — Sun Devil State
                University (active scout viewing your data).
              </p>
              <Link
                href="/command-os/scouts"
                className="mt-2 inline-block text-sm text-[#3B82F6] hover:underline"
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
