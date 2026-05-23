"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { demoStore } from "@/lib/demo/store";
import { Button } from "@/components/ui/button";

const DEFAULT_SAVED = [
  { id: "1", name: "2027 QBs under 4.7", position: "quarterback", fortyMax: "4.7", gpaMin: "" },
  { id: "2", name: "High GPA WRs", position: "wide receiver", fortyMax: "", gpaMin: "3.5" },
];

type SavedSearch = (typeof DEFAULT_SAVED)[0];

export default function ScoutSearchPage() {
  const [position, setPosition] = useState("");
  const [fortyMax, setFortyMax] = useState("4.7");
  const [gpaMin, setGpaMin] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [sport, setSport] = useState("");
  const [saved, setSaved] = useState<SavedSearch[]>(DEFAULT_SAVED);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("legacy-scout-saved-searches");
      if (raw) setSaved(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  function persistSaved(next: SavedSearch[]) {
    setSaved(next);
    localStorage.setItem("legacy-scout-saved-searches", JSON.stringify(next));
  }

  function saveCurrentSearch() {
    const name = prompt("Name this search");
    if (!name) return;
    persistSaved([
      ...saved,
      {
        id: String(Date.now()),
        name,
        position,
        fortyMax,
        gpaMin,
      },
    ]);
  }

  function applySaved(s: SavedSearch) {
    setPosition(s.position);
    setFortyMax(s.fortyMax);
    setGpaMin(s.gpaMin);
  }

  const results = useMemo(() => {
    return demoStore.athletes
      .filter((a) => a.scout_visible)
      .filter((a) => {
        if (sport && a.sport !== sport) return false;
        if (position && a.position !== position && a.sport !== position)
          return false;
        if (gradYear && String(a.graduation_year) !== gradYear) return false;
        if (gpaMin && a.gpa < parseFloat(gpaMin)) return false;
        if (fortyMax && a.sport === "football") {
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
  }, [position, fortyMax, gpaMin, gradYear, sport]);

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-6 py-12">
      <aside className="w-64 shrink-0 space-y-4">
        <h1 className="text-xl font-bold">Search athletes</h1>
        <div>
          <label className="text-sm font-medium">Sport</label>
          <select
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="football">Football</option>
            <option value="basketball">Basketball</option>
            <option value="baseball">Baseball</option>
          </select>
        </div>
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
            <option value="running back">RB</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Class year</label>
          <select
            value={gradYear}
            onChange={(e) => setGradYear(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">All</option>
            {[2025, 2026, 2027, 2028, 2029].map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
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
        <Button size="sm" variant="outline" onClick={saveCurrentSearch}>
          Save search
        </Button>
        <div>
          <p className="text-sm font-medium">Saved searches</p>
          <ul className="mt-2 space-y-1">
            {saved.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => applySaved(s)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {s.name}
                </button>
              </li>
            ))}
          </ul>
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
