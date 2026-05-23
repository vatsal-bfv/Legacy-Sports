import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { getSession } from "@/lib/auth/guards";
import { isScoutRole } from "@/lib/auth/roles";
import { demoStore } from "@/lib/demo/store";
import { Button } from "@/components/ui/button";

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
    <div className="relative mx-auto max-w-4xl px-6 py-12">
      <p className="absolute right-6 top-6 text-xs text-gray-400 rotate-12 opacity-50">
        Data licensed from Legacy Sports Complex
      </p>
      <div className="flex gap-8">
        <Image
          src={athlete.photo_url}
          alt=""
          width={160}
          height={160}
          className="rounded-xl"
        />
        <div>
          <h1 className="text-3xl font-bold">
            {athlete.first_name} {athlete.last_name}
          </h1>
          <p className="text-gray-500">
            {athlete.school} · Class of {athlete.graduation_year} · GPA{" "}
            {athlete.gpa}
          </p>
          <p className="mt-2 capitalize">
            {athlete.sport}
            {athlete.position ? ` · ${athlete.position}` : ""}
          </p>
          <p className="mt-1 text-sm capitalize text-blue-600">
            {athlete.recruit_status}
          </p>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-lg font-semibold">Measurables</h2>
        <div className="mt-4 flex flex-wrap gap-4">
          {measurables
            .filter((m) => m.is_pr)
            .map((m) => (
              <div
                key={m.id}
                className="rounded-lg border border-gray-200 bg-white px-4 py-3"
              >
                <p className="text-xs text-gray-500">
                  {m.metric.replace("_", " ")}
                </p>
                <p className="text-xl font-bold">
                  {m.value} {m.unit}
                </p>
              </div>
            ))}
        </div>
      </section>

      {videos.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold">Video</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {videos.map((v) => (
              <div
                key={v.id}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <p className="font-medium">{v.title}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {v.ai_tags.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-gray-100 px-2 py-0.5 text-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-12 flex gap-4">
        <Button variant="scout">Save to my list</Button>
        <Button variant="outline" className="border-gray-300 text-gray-900">
          Request introduction
        </Button>
      </div>
    </div>
  );
}
