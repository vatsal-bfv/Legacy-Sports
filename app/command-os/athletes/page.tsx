"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocationScope } from "@/components/app/LocationProvider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { demoStore } from "@/lib/demo/store";
import { useMemo, useState } from "react";

const SPORTS = ["football", "basketball", "baseball", "soccer", "volleyball", "multi"];
const RECRUIT_STATUSES = ["uncommitted", "considering", "committed", "signed"];

export default function AthletesListPage() {
  const { locationId } = useLocationScope();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sportFilter, setSportFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [recruitFilter, setRecruitFilter] = useState("");
  const [attendedWithin, setAttendedWithin] = useState("");

  const athletes = useMemo(() => {
    const cutoff =
      attendedWithin === "7"
        ? Date.now() - 7 * 86400000
        : attendedWithin === "30"
          ? Date.now() - 30 * 86400000
          : null;

    return demoStore.athletes.filter((a) => {
      if (locationId && a.home_location_id !== locationId) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (sportFilter && a.sport !== sportFilter) return false;
      if (positionFilter && a.position !== positionFilter) return false;
      if (recruitFilter && a.recruit_status !== recruitFilter) return false;
      if (cutoff) {
        const lastAtt = demoStore.attendance
          .filter((att) => att.athlete_id === a.id && att.status === "attended")
          .sort(
            (x, y) =>
              new Date(y.checked_in_at).getTime() -
              new Date(x.checked_in_at).getTime()
          )[0];
        if (!lastAtt || new Date(lastAtt.checked_in_at).getTime() < cutoff)
          return false;
      }
      if (search) {
        const q = search.toLowerCase();
        return (
          a.first_name.toLowerCase().includes(q) ||
          a.last_name.toLowerCase().includes(q) ||
          (a.position?.toLowerCase().includes(q) ?? false)
        );
      }
      return true;
    });
  }, [
    locationId,
    search,
    statusFilter,
    sportFilter,
    positionFilter,
    recruitFilter,
    attendedWithin,
  ]);

  const selectClass =
    "rounded-md border border-[#2A2D34] bg-[#15171B] px-3 py-2 text-sm";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Athletes</h1>
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search athletes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={selectClass}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="at_risk">At risk</option>
          <option value="paused">Paused</option>
          <option value="churned">Churned</option>
        </select>
        <select
          value={sportFilter}
          onChange={(e) => setSportFilter(e.target.value)}
          className={selectClass}
        >
          <option value="">All sports</option>
          {SPORTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <Input
          placeholder="Position"
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
          className="max-w-[140px]"
        />
        <select
          value={recruitFilter}
          onChange={(e) => setRecruitFilter(e.target.value)}
          className={selectClass}
        >
          <option value="">Recruit status</option>
          {RECRUIT_STATUSES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          value={attendedWithin}
          onChange={(e) => setAttendedWithin(e.target.value)}
          className={selectClass}
        >
          <option value="">Last attended</option>
          <option value="7">Within 7 days</option>
          <option value="30">Within 30 days</option>
        </select>
      </div>
      <p className="text-sm text-[#9DA3AE]">{athletes.length} athletes</p>
      <div className="overflow-hidden rounded-lg border border-[#2A2D34]">
        <table className="w-full text-sm">
          <thead className="bg-[#12141A] text-left text-[#9DA3AE]">
            <tr>
              <th className="p-4">Athlete</th>
              <th className="p-4">Sport</th>
              <th className="p-4">Program</th>
              <th className="p-4">Location</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {athletes.slice(0, 50).map((a) => {
              const loc = demoStore.locations.find(
                (l) => l.id === a.home_location_id
              );
              const prog = demoStore.programs.find((p) => p.id === a.program_id);
              return (
                <tr
                  key={a.id}
                  className="border-t border-[#2A2D34]/50 hover:bg-[#15171B]"
                >
                  <td className="p-4">
                    <Link
                      href={`/command-os/athletes/${a.id}`}
                      className="flex items-center gap-3 font-medium hover:text-[#3B82F6]"
                    >
                      <Image
                        src={a.photo_url}
                        alt=""
                        width={36}
                        height={36}
                        className="rounded-full"
                      />
                      {a.first_name} {a.last_name}
                    </Link>
                  </td>
                  <td className="p-4 capitalize">{a.sport}</td>
                  <td className="p-4">{prog?.name}</td>
                  <td className="p-4">{loc?.name}</td>
                  <td className="p-4">
                    <Badge
                      variant={
                        a.status === "at_risk"
                          ? "danger"
                          : a.status === "active"
                            ? "success"
                            : "default"
                      }
                    >
                      {a.status.replace("_", " ")}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
