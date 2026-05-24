"use client";

import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocationScope } from "@/components/app/LocationProvider";
import { LOCATION_IDS } from "@/lib/constants";
import { demoStore } from "@/lib/demo/store";
import type { Location } from "@/lib/demo/types";
import { formatCurrency } from "@/lib/utils";

const UTILIZATION = [87, 75, 82, 91, 78];
const HEATMAP_HOURS = ["7a", "9a", "12p", "3p", "6p", "9p"];

function defaultHeatmapIds(locationId?: string | null): string[] {
  if (locationId) return [locationId];
  return [LOCATION_IDS.phoenix];
}

function getRoomsForLocation(loc: Location): string[] {
  const fromAmenities = loc.amenities.map((a) =>
    a
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
  return fromAmenities.length > 0
    ? fromAmenities.slice(0, 5)
    : ["Turf A", "Turf B", "Weight", "Court 1", "Recovery"];
}

function utilizationForLocation(locationId: string) {
  const i = demoStore.locations.findIndex((l) => l.id === locationId);
  return UTILIZATION[i >= 0 ? i % UTILIZATION.length : 0];
}

function UtilizationHeatmap({ location }: { location: Location }) {
  const rooms = getRoomsForLocation(location);
  const locIndex = demoStore.locations.findIndex((l) => l.id === location.id);

  return (
    <div className="rounded-lg border border-bone bg-field p-4">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h3 className="font-semibold text-pitch">{location.name}</h3>
        <span className="text-xs text-emerald-400">
          {utilizationForLocation(location.id)}% avg today
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="text-xs">
          <thead>
            <tr>
              <th className="p-2 text-left text-slate">Room</th>
              {HEATMAP_HOURS.map((h) => (
                <th key={h} className="p-2 text-slate">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rooms.map((room, ri) => (
              <tr key={room}>
                <td className="p-2 font-medium">{room}</td>
                {HEATMAP_HOURS.map((h, hi) => {
                  const pct = 40 + ((locIndex * 11 + ri * 7 + hi * 13) % 55);
                  const color =
                    pct > 85
                      ? "bg-emerald-500/60"
                      : pct > 65
                        ? "bg-orange/50"
                        : pct > 45
                          ? "bg-amber-500/40"
                          : "bg-red-500/30";
                  return (
                    <td key={h} className="p-1">
                      <div
                        className={`flex h-8 w-12 items-center justify-center rounded ${color}`}
                        title={`${pct}% utilized`}
                      >
                        {pct}%
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function OperationsPage() {
  const { locationId } = useLocationScope();
  const locations = demoStore.locations.filter(
    (l) => !locationId || l.id === locationId
  );

  const [selectedHeatmapIds, setSelectedHeatmapIds] = useState<string[]>(() =>
    defaultHeatmapIds(locationId)
  );

  useEffect(() => {
    setSelectedHeatmapIds(defaultHeatmapIds(locationId));
  }, [locationId]);

  const selectedLocations = useMemo(
    () =>
      locations.filter((l) => selectedHeatmapIds.includes(l.id)),
    [locations, selectedHeatmapIds]
  );

  function toggleHeatmap(id: string) {
    setSelectedHeatmapIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Operations</h1>
      <Tabs defaultValue="locations">
        <TabsList>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="coaches">Coaches</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
        </TabsList>
        <TabsContent value="locations" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((loc) => (
              <Card key={loc.id}>
                <CardHeader>
                  <CardTitle>{loc.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate">{loc.address}</p>
                  <p className="mt-2 text-sm">
                    {loc.square_footage.toLocaleString()} sq ft
                  </p>
                  <p className="mt-2 text-xs text-emerald-400">
                    {utilizationForLocation(loc.id)}% utilization
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Facility utilization</CardTitle>
              <p className="text-sm text-slate">
                Choose which locations to include in today&apos;s room-by-room
                heatmaps.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {locations.map((loc) => {
                  const checked = selectedHeatmapIds.includes(loc.id);
                  return (
                    <label
                      key={loc.id}
                      className="flex cursor-pointer items-center gap-2 text-sm text-pitch"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleHeatmap(loc.id)}
                        className="h-4 w-4 rounded border-bone bg-chalk accent-orange"
                      />
                      {loc.name}
                    </label>
                  );
                })}
              </div>

              {selectedLocations.length > 0 ? (
                <div className="grid gap-4 lg:grid-cols-2">
                  {selectedLocations.map((loc) => (
                    <UtilizationHeatmap key={loc.id} location={loc} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate">
                  Select at least one location to view utilization heatmaps.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="coaches" className="grid gap-4 sm:grid-cols-2">
          {demoStore.coaches.map((c) => (
            <Card key={c.id}>
              <CardHeader>
                <CardTitle>
                  {c.first_name} {c.last_name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate">{c.bio}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {c.specialties.map((s) => (
                    <span
                      key={s}
                      className="rounded bg-field px-2 py-0.5 text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="programs" className="grid gap-4 sm:grid-cols-2">
          {demoStore.programs.map((p) => (
            <Card key={p.id}>
              <CardHeader>
                <CardTitle>{p.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate">{p.description}</p>
                <p className="mt-2 font-semibold">
                  {formatCurrency(p.monthly_price)}/mo
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
