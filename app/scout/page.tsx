import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/guards";
import { isScoutRole } from "@/lib/auth/roles";
import { demoStore } from "@/lib/demo/store";
import { HERO_IDS } from "@/lib/constants";
import { getAthleteHighlightMetrics } from "@/lib/scout/profile-helpers";

export default async function ScoutDashboardPage() {
  const session = await getSession();
  if (!session || !isScoutRole(session.role)) {
    redirect("/scout/login");
  }

  const visible = demoStore.athletes.filter((a) => a.scout_visible);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-2xl font-bold">Welcome, {session.displayName}</h1>
      <p className="text-gray-500">Sun Devil State University</p>

      <section className="mt-12">
        <h2 className="text-lg font-semibold">Saved searches</h2>
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
          <p className="font-medium">2027 QBs — 40 under 4.7</p>
          <Link href="/scout/search" className="text-sm text-blue-600">
            Run search →
          </Link>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold">Recently viewed</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {visible.slice(0, 4).map((a) => {
            const highlights = getAthleteHighlightMetrics(
              a.id,
              demoStore.measurables
            );
            return (
              <Link
                key={a.id}
                href={`/scout/athletes/${a.id}`}
                className="rounded-lg border border-gray-200 bg-white p-4 hover:border-[#1A2332]"
              >
                <p className="font-medium">
                  {a.first_name} {a.last_name}
                </p>
                <p className="text-sm text-gray-500 capitalize">
                  {a.sport}
                  {a.position ? ` · ${a.position}` : ""} · Class of{" "}
                  {a.graduation_year}
                </p>
                {highlights.length > 0 && (
                  <p className="mt-2 text-xs text-gray-600">
                    {highlights.join(" · ")}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold">Recommended for you</h2>
        <p className="mt-2 text-sm text-gray-500">
          Based on QB and WR positions, Southwest focus
        </p>
        <Link
          href={`/scout/athletes/${HERO_IDS.marcus}`}
          className="mt-4 inline-block rounded-lg border border-gray-200 bg-white p-4"
        >
          <p className="font-medium">Marcus Johnson — QB, 2027</p>
          <p className="text-sm text-gray-500">40: 4.62 · Vertical: 36&quot;</p>
        </Link>
      </section>
    </div>
  );
}
