import { demoStore } from "@/lib/demo/store";
import { getProgramBySlug } from "@/lib/marketing/programs";
import {
  getCoachDisplayName,
  getCoachPhotoPath,
  getMarketingCoachBySlug,
  getMarketingCoachesForLocation,
  getMarketingCoachesForProgram,
  getMarketingCoachesForProgramAtLocation,
  marketingCoaches,
  type MarketingCoach,
  type MarketingCoachHighlight,
} from "@/lib/marketing/coaches-data";

export type { MarketingCoach, MarketingCoachHighlight };
export {
  getCoachDisplayName,
  getCoachPhotoPath,
  getMarketingCoachBySlug,
  getMarketingCoachesForLocation,
  getMarketingCoachesForProgram,
  getMarketingCoachesForProgramAtLocation,
  marketingCoaches,
};

export function getCoachPrograms(coach: MarketingCoach) {
  return coach.programSlugs
    .map((slug) => getProgramBySlug(slug))
    .filter((program): program is NonNullable<typeof program> => Boolean(program));
}

export function getCoachLocations(coach: MarketingCoach) {
  return coach.locationSlugs
    .map((slug) => demoStore.locations.find((location) => location.slug === slug))
    .filter((location): location is NonNullable<typeof location> => Boolean(location));
}

export const coachCards = marketingCoaches.map((coach) => ({
  slug: coach.slug,
  name: getCoachDisplayName(coach),
  title: coach.title,
  quote: coach.quote,
  image: getCoachPhotoPath(coach.slug),
  isOwner: coach.isOwner,
  specialties: coach.specialties.slice(0, 2),
}));
