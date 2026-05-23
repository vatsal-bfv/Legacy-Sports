"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocationScope } from "@/components/app/LocationProvider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { demoStore } from "@/lib/demo/store";
import { useMemo, useState } from "react";

export default function AthletesListPage() {
  const { locationId } = useLocationScope();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const athletes = useMemo(() => {
    return demoStore.athletes.filter((a) => {
      if (locationId && a.home_location_id !== locationId) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          a.first_name.toLowerCase().includes(q) ||
          a.last_name.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [locationId, search, statusFilter]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Athletes</h1>
      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Search athletes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-[#2A2D34] bg-[#15171B] px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="at_risk">At risk</option>
          <option value="paused">Paused</option>
          <option value="churned">Churned</option>
        </select>
      </div>
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
