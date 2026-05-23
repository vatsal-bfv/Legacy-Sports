import { notFound } from "next/navigation";
import { featuredAthletes } from "@/lib/marketing/featured-athletes";
import { AthleteProfileExperience } from "@/components/marketing/athletes/AthleteProfileExperience";

export function generateStaticParams() {
  return featuredAthletes.map((athlete) => ({ slug: athlete.slug }));
}

export default async function PublicAthletePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const athlete = featuredAthletes.find((entry) => entry.slug === slug);

  if (!athlete) {
    notFound();
  }

  return <AthleteProfileExperience athlete={athlete} />;
}
