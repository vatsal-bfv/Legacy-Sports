import { notFound } from "next/navigation";
import { demoStore } from "@/lib/demo/store";
import { LocationDetailExperience } from "@/components/marketing/locations/LocationDetailExperience";
import { getLocationSchematic } from "@/lib/marketing/location-schematics";
import { getMarketingCoachesForLocation } from "@/lib/marketing/coaches";
import { getProgramsForLocation } from "@/lib/marketing/programs";

export function generateStaticParams() {
  return demoStore.locations.map((location) => ({ slug: location.slug }));
}

export default async function LocationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = demoStore.locations.find((entry) => entry.slug === slug);
  if (!location) {
    notFound();
  }

  const schematic = getLocationSchematic(slug);
  if (!schematic) {
    notFound();
  }

  const coaches = getMarketingCoachesForLocation(slug);

  const locationPrograms = getProgramsForLocation(location.id);

  return (
    <LocationDetailExperience
      key={location.slug}
      location={location}
      schematic={schematic}
      coaches={coaches}
      locationPrograms={locationPrograms}
      allLocations={demoStore.locations}
      allPrograms={demoStore.programs}
    />
  );
}
