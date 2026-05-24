"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { demoStore } from "@/lib/demo/store";
import { Button } from "@/components/ui/button";
import {
  ScoutCard,
  ScoutPageHeading,
  ScoutSectionLabel,
} from "@/components/scout/ScoutCard";
import { SectionTexture } from "@/components/marketing/landing/SectionTexture";

const DEFAULT_SAVED = [
  {
    id: "1",
    name: "2027 QBs under 4.7",
    position: "quarterback",
    fortyMax: "4.7",
    gpaMin: "",
  },
  {
    id: "2",
    name: "High GPA WRs",
    position: "wide receiver",
    fortyMax: "",
    gpaMin: "3.5",
  },
];

type SavedSearch = (typeof DEFAULT_SAVED)[0];

const labelClassName =
  "text-[11px] font-bold uppercase tracking-[0.1em] text-slate";

const fieldClassName =
  "mt-1.5 w-full rounded-[8px] border-[1.5px] border-bone bg-field px-3 py-2.5 text-sm text-pitch focus:border-orange focus:outline-none focus:ring-4 focus:ring-orange/10";

export default function ScoutSearchPage() {
  const [position, setPosition] = useState("");
  const [fortyMax, setFortyMax] = useState("4.7");
  const [gpaMin, setGpaMin] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [sport, setSport] = useState("");
  const [saved, setSaved] = useState<SavedSearch[]>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_SAVED;
    }

    try {
      const raw = localStorage.getItem("legacy-scout-saved-searches");
      if (raw) {
        return JSON.parse(raw) as SavedSearch[];
      }
    } catch {
      /* ignore */
    }

    return DEFAULT_SAVED;
  });

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
    <div className="relative px-[var(--legacy-gutter)] py-[clamp(48px,8vw,80px)]">
      <SectionTexture pattern="dots" tone="light" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:gap-12">
        <aside className="w-full shrink-0 lg:w-72">
          <ScoutCard className="p-6">
            <ScoutSectionLabel>Filters</ScoutSectionLabel>
            <div className="mt-4">
              <ScoutPageHeading title="Search athletes" />
            </div>

            <div className="mt-8 space-y-5">
              <div>
                <label className={labelClassName}>Sport</label>
                <select
                  value={sport}
                  onChange={(e) => setSport(e.target.value)}
                  className={fieldClassName}
                >
                  <option value="">All</option>
                  <option value="football">Football</option>
                  <option value="basketball">Basketball</option>
                  <option value="baseball">Baseball</option>
                </select>
              </div>
              <div>
                <label className={labelClassName}>Position</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className={fieldClassName}
                >
                  <option value="">All</option>
                  <option value="quarterback">QB</option>
                  <option value="wide receiver">WR</option>
                  <option value="point guard">PG</option>
                  <option value="running back">RB</option>
                </select>
              </div>
              <div>
                <label className={labelClassName}>Class year</label>
                <select
                  value={gradYear}
                  onChange={(e) => setGradYear(e.target.value)}
                  className={fieldClassName}
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
                <label className={labelClassName}>40-yard ≤ (sec)</label>
                <input
                  type="number"
                  step="0.01"
                  value={fortyMax}
                  onChange={(e) => setFortyMax(e.target.value)}
                  className={fieldClassName}
                />
              </div>
              <div>
                <label className={labelClassName}>GPA min</label>
                <input
                  type="number"
                  step="0.1"
                  value={gpaMin}
                  onChange={(e) => setGpaMin(e.target.value)}
                  className={fieldClassName}
                />
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={saveCurrentSearch}
              className="mt-6 w-full border-bone bg-field text-pitch hover:border-orange hover:bg-chalk hover:text-pitch"
            >
              Save search
            </Button>

            {saved.length > 0 && (
              <div className="mt-8 border-t border-bone pt-6">
                <p className={labelClassName}>Saved searches</p>
                <ul className="mt-3 space-y-2">
                  {saved.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => applySaved(s)}
                        className="text-left text-sm text-slate transition-colors hover:text-orange"
                      >
                        {s.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </ScoutCard>
        </aside>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate">
            {results.length} athletes found
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {results.slice(0, 20).map((a) => {
              const forty = demoStore.measurables.find(
                (m) =>
                  m.athlete_id === a.id && m.metric === "forty_yard" && m.is_pr
              );
              const vert = demoStore.measurables.find(
                (m) => m.athlete_id === a.id && m.metric === "vertical" && m.is_pr
              );
              return (
                <Link key={a.id} href={`/scout/athletes/${a.id}`}>
                  <ScoutCard className="flex gap-4 p-4" hover>
                    <Image
                      src={a.photo_url}
                      alt=""
                      width={72}
                      height={72}
                      className="h-[72px] w-[72px] shrink-0 rounded-[8px] object-cover"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-pitch">
                        {a.first_name} {a.last_name}
                      </p>
                      <p className="mt-0.5 text-sm text-slate">
                        {a.school} · Class of {a.graduation_year}
                      </p>
                      {forty && (
                        <p className="mt-2 text-xs text-smoke">
                          40: {forty.value}s
                          {vert ? ` · Vert: ${vert.value}"` : ""}
                        </p>
                      )}
                    </div>
                  </ScoutCard>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
