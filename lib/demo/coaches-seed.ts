import { LOCATION_IDS } from "@/lib/constants";
import type { Coach } from "@/lib/demo/types";

/** Stable demo ids — keep in sync with hero measurables and session seeds. */
export const DEMO_COACH_IDS = {
  sean: "c0000001-0001-4000-8000-000000000001",
  sanu: "c0000001-0001-4000-8000-000000000002",
  venters: "c0000001-0001-4000-8000-000000000003",
  wilkinson: "c0000001-0001-4000-8000-000000000004",
  blake: "c0000001-0001-4000-8000-000000000005",
  chovanic: "c0000001-0001-4000-8000-000000000006",
} as const;

const SLUG_TO_LOCATION_ID: Record<string, string> = {
  suwanee: LOCATION_IDS.phoenix,
  lawrenceville: LOCATION_IDS.mesa,
  hoschton: LOCATION_IDS.gilbert,
  canton: LOCATION_IDS.scottsdale,
  alpharetta: LOCATION_IDS.chandler,
};

type SeedCoach = {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  primarySlug: string;
  shortBio: string;
  specialties: string[];
  voiceSample: string;
};

/** Owner-coach roster aligned with lib/marketing/coaches.ts (no import — avoids demo store cycle). */
const COMMAND_OS_COACHES: SeedCoach[] = [
  {
    id: DEMO_COACH_IDS.sean,
    slug: "sean-weatherspoon",
    firstName: "Sean",
    lastName: "Weatherspoon",
    primarySlug: "suwanee",
    shortBio:
      "First-round NFL linebacker and Pro Bowl talent who brings championship-level intensity to every session at Legacy.",
    specialties: ["linebacker development", "combine prep", "leadership"],
    voiceSample:
      "Hey — Coach Spoon here. We built Legacy to give Georgia athletes the pro standard from day one. Let's get your athlete back on the turf this week.",
  },
  {
    id: DEMO_COACH_IDS.sanu,
    slug: "mohamed-sanu",
    firstName: "Mohamed",
    lastName: "Sanu",
    primarySlug: "lawrenceville",
    shortBio:
      "Super Bowl veteran and Rutgers star who mentors the next generation of Georgia's most driven skill-position athletes.",
    specialties: ["wide receiver", "mental performance", "recruiting"],
    voiceSample:
      "Hey! Coach Mo checking in. I'm ready to challenge you mentally and sharpen your skillsets — let's lock in the next session.",
  },
  {
    id: DEMO_COACH_IDS.venters,
    slug: "johnny-venters",
    firstName: "Johnny",
    lastName: "Venters",
    primarySlug: "hoschton",
    shortBio:
      "Former professional baseball player and Legacy co-owner focused on building complete athletes from the ground up.",
    specialties: ["baseball", "youth development", "throwing mechanics"],
    voiceSample:
      "Hey, I'm Jonny. Legacy is where you make your mark — wanted to follow up on your athlete's progress and get the next session booked.",
  },
  {
    id: DEMO_COACH_IDS.wilkinson,
    slug: "elijah-wilkinson",
    firstName: "Elijah",
    lastName: "Wilkinson",
    primarySlug: "lawrenceville",
    shortBio:
      "NFL offensive lineman and Legacy owner who builds trench warriors — power, mobility, and relentless effort.",
    specialties: ["offensive line", "strength", "power development"],
    voiceSample:
      "I'm Elijah. We're all about the work — no excuses. Your numbers are trending the right way; let's keep that momentum going.",
  },
  {
    id: DEMO_COACH_IDS.blake,
    slug: "christian-blake",
    firstName: "Christian",
    lastName: "Blake",
    primarySlug: "suwanee",
    shortBio:
      "Former NFL wide receiver and Legacy owner specializing in route running, speed development, and recruiting exposure.",
    specialties: ["wide receiver", "route running", "recruiting"],
    voiceSample:
      "Hey, I'm Christian. My passion is developing premier athletes to be their best — let's talk about next steps for your athlete.",
  },
  {
    id: DEMO_COACH_IDS.chovanic,
    slug: "dustin-chovanic",
    firstName: "Dustin",
    lastName: "Chovanic",
    primarySlug: "suwanee",
    shortBio:
      "Legacy CEO and co-founder who built the five-location Georgia network on discipline forged in professional combat sports.",
    specialties: ["operations", "adult performance", "culture"],
    voiceSample:
      "Hi, I'm Dustin. Wanted to check in on training this week and make sure we're staying on track with your athlete's goals.",
  },
];

export function buildDemoCoaches(): Coach[] {
  return COMMAND_OS_COACHES.map((coach) => ({
    id: coach.id,
    first_name: coach.firstName,
    last_name: coach.lastName,
    email: `${coach.slug.replace(/-/g, ".")}@legacy.demo`,
    photo_url: `/images/coaches/${coach.slug}.jpg`,
    bio: coach.shortBio,
    specialties: coach.specialties,
    primary_location_id: SLUG_TO_LOCATION_ID[coach.primarySlug],
    voice_sample: coach.voiceSample,
  }));
}

/** Primary coach at Lawrenceville — Tyler Chen re-engagement flows. */
export const COACH_LAWRENCEVILLE_ID = DEMO_COACH_IDS.sanu;
