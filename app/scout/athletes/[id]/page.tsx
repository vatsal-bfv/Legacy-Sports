import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth/guards";
import { isScoutRole } from "@/lib/auth/roles";
import { demoStore } from "@/lib/demo/store";
import { ScoutAthleteProfile } from "@/components/scout/ScoutAthleteProfile";

export default async function ScoutAthletePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session || !isScoutRole(session.role)) {
    redirect("/scout/login");
  }

  const { id } = await params;
  const athlete = demoStore.athletes.find(
    (a) => a.id === id && a.scout_visible
  );
  if (!athlete) notFound();

  const measurables = demoStore.measurables.filter((m) => m.athlete_id === id);
  const videos = demoStore.videoClips.filter((v) => v.athlete_id === id);

  return (
    <ScoutAthleteProfile
      athlete={athlete}
      measurables={measurables}
      videos={videos}
    />
  );
}
