import { notFound } from "next/navigation";
import { AthleteProfile } from "@/components/app/AthleteProfile";
import { demoStore } from "@/lib/demo/store";
import { HERO_IDS } from "@/lib/constants";
import { redirect } from "next/navigation";

export default async function AthleteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (id === "default") redirect(`/command-os/athletes/${HERO_IDS.marcus}`);

  const athlete = demoStore.athletes.find((a) => a.id === id);
  if (!athlete) notFound();

  return <AthleteProfile athlete={athlete} />;
}
