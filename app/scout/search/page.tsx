"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { demoStore } from "@/lib/demo/store";

export default function ScoutSearchPage() {
  const [position, setPosition] = useState("");
  const [fortyMax, setFortyMax] = useState("4.7");
  const [gpaMin, setGpaMin] = useState("");

  const results = useMemo(() => {
    return demoStore.athletes
      .filter((a) => a.scout_visible)
      .filter((a) => {
        if (position && a.position !== position && a.sport !== position)
          return false;
        if (gpaMin && a.gpa < parseFloat(gpaMin)) return false;
        if (fortyMax && a.sport === "football" && a.position === "quarterback") {
          const forty = demoStore.measurables.find(
            (m) =>
              m.athlete_id === a.id &&
              m.metric === "forty_yard" &&
              m.is_pr
          );
          if (forty && forty.value > parseFloat(fortyMax)) return false;
        }
        return true;
      });
  }, [position, fortyMax, gpaMin]);

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-6 py-12">
      <aside className="w-64 shrink-0 space-y-4">
        <h1 className="text-xl font-bold">Search athletes</h1>
        <div>
          <label className="text-sm font-medium">Position</label>
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="quarterback">QB</option>
            <option value="wide receiver">WR</option>
            <option value="point guard">PG</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">40-yard ≤ (sec)</label>
          <input
            type="number"
            step="0.01"
            value={fortyMax}
            onChange={(e) => setFortyMax(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium">GPA min</label>
          <input
            type="number"
            step="0.1"
            value={gpaMin}
            onChange={(e) => setGpaMin(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </aside>
      <div className="flex-1">
        <p className="mb-4 text-sm text-gray-500">{results.length} athletes</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {results.slice(0, 20).map((a) => {
            const forty = demoStore.measurables.find(
              (m) => m.athlete_id === a.id && m.metric === "forty_yard" && m.is_pr
            );
            const vert = demoStore.measurables.find(
              (m) => m.athlete_id === a.id && m.metric === "vertical" && m.is_pr
            );
            return (
              <Link
                key={a.id}
                href={`/scout/athletes/${a.id}`}
                className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md"
              >
                <Image
                  src={a.photo_url}
                  alt=""
                  width={64}
                  height={64}
                  className="rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold">
                    {a.first_name} {a.last_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {a.school} · Class of {a.graduation_year}
                  </p>
                  {forty && (
                    <p className="mt-1 text-xs text-gray-600">
                      40: {forty.value}s
                      {vert ? ` · Vert: ${vert.value}"` : ""}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
