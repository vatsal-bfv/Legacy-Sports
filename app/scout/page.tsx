import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSession } from "@/lib/auth/guards";
import { isScoutRole } from "@/lib/auth/roles";
import { demoStore } from "@/lib/demo/store";
import { HERO_IDS } from "@/lib/constants";
import { getAthleteHighlightMetrics } from "@/lib/scout/profile-helpers";
import {
  ScoutCard,
  ScoutPageHeading,
  ScoutSectionLabel,
} from "@/components/scout/ScoutCard";
import { SectionTexture } from "@/components/marketing/landing/SectionTexture";

export default async function ScoutDashboardPage() {
  const session = await getSession();
  if (!session || !isScoutRole(session.role)) {
    redirect("/scout/login");
  }

  const visible = demoStore.athletes.filter((a) => a.scout_visible);

  return (
    <div className="relative px-[var(--legacy-gutter)] py-[clamp(48px,8vw,80px)]">
      <SectionTexture pattern="dots" tone="light" />

      <div className="relative mx-auto max-w-7xl">
        <ScoutSectionLabel>Dashboard</ScoutSectionLabel>
        <div className="mt-4">
          <ScoutPageHeading
            title={`Welcome, ${session.displayName}`}
            subtitle="Sun Devil State University"
          />
        </div>

        <section className="mt-14">
          <h2 className="text-lg font-extrabold tracking-[-0.02em] text-pitch">
            Saved searches
          </h2>
          <ScoutCard className="mt-4 p-6" hover>
            <p className="font-semibold text-pitch">2027 QBs — 40 under 4.7</p>
            <Link
              href="/scout/search"
              className="group relative mt-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.1em] text-slate hover:text-pitch"
            >
              Run search
              <ArrowRight className="h-3.5 w-3.5" />
              <span className="absolute inset-x-0 bottom-[-3px] h-px origin-left scale-x-0 bg-orange transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          </ScoutCard>
        </section>

        <section className="mt-14">
          <h2 className="text-lg font-extrabold tracking-[-0.02em] text-pitch">
            Recently viewed
          </h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {visible.slice(0, 4).map((a) => {
              const highlights = getAthleteHighlightMetrics(
                a.id,
                demoStore.measurables
              );
              return (
                <Link key={a.id} href={`/scout/athletes/${a.id}`}>
                  <ScoutCard className="p-5" hover>
                    <p className="font-semibold text-pitch">
                      {a.first_name} {a.last_name}
                    </p>
                    <p className="mt-1 text-sm capitalize text-slate">
                      {a.sport}
                      {a.position ? ` · ${a.position}` : ""} · Class of{" "}
                      {a.graduation_year}
                    </p>
                    {highlights.length > 0 && (
                      <p className="mt-2 text-xs text-smoke">
                        {highlights.join(" · ")}
                      </p>
                    )}
                  </ScoutCard>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-lg font-extrabold tracking-[-0.02em] text-pitch">
            Recommended for you
          </h2>
          <p className="mt-2 text-sm text-slate">
            Based on QB and WR positions, Southwest focus
          </p>
          <Link href={`/scout/athletes/${HERO_IDS.marcus}`} className="mt-4 block">
            <ScoutCard className="p-5" hover>
              <p className="font-semibold text-pitch">
                Marcus Johnson — QB, 2027
              </p>
              <p className="mt-1 text-sm text-slate">
                40: 4.62 · Vertical: 36&quot;
              </p>
            </ScoutCard>
          </Link>
        </section>
      </div>
    </div>
  );
}
