import { demoStore } from "@/lib/demo/store";
import { getProgramBySlug } from "@/lib/marketing/programs";

export type MarketingCoachHighlight = {
  value: string;
  label: string;
};

export type MarketingCoach = {
  slug: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  title: string;
  roles: string[];
  isOwner: boolean;
  quote: string;
  shortBio: string;
  history: string[];
  highlights: MarketingCoachHighlight[];
  programSlugs: string[];
  locationSlugs: string[];
  specialties: string[];
};

/** Local coach headshots — add files under `public/images/coaches/` (see README there). */
export function getCoachPhotoPath(slug: string) {
  return `/images/coaches/${slug}.jpg`;
}

export const marketingCoaches: MarketingCoach[] = [
  {
    slug: "sean-weatherspoon",
    firstName: "Sean",
    lastName: "Weatherspoon",
    nickname: "Spoon",
    title: "Trainer | Owner",
    roles: ["Owner", "Head Trainer", "Linebacker Development"],
    isOwner: true,
    quote:
      "I'm Spoon. We built Legacy to give Georgia athletes the pro standard from day one — no shortcuts, no excuses.",
    shortBio:
      "First-round NFL linebacker and Pro Bowl talent who brings championship-level intensity to every session at Legacy.",
    history: [
      "First-round pick (19th overall) by the Atlanta Falcons in the 2010 NFL Draft after a decorated career at the University of Missouri.",
      "Named to the Pro Bowl in 2012 and earned All-Pro honors while anchoring the Falcons defense for six seasons.",
      "Finished his NFL career with over 470 tackles, establishing himself as one of the most physical linebackers of his era.",
      "Co-founded Legacy Sports Complex to translate pro-level standards — film study, accountability, and measurable progress — into youth and high school athlete development across Georgia.",
    ],
    highlights: [
      { value: "2012", label: "Pro Bowl selection" },
      { value: "1st", label: "Round NFL draft pick" },
      { value: "6", label: "NFL seasons played" },
    ],
    programSlugs: ["hs-combine-prep", "college-recruit-track", "team-training"],
    locationSlugs: ["suwanee", "lawrenceville"],
    specialties: ["Linebacker development", "Combine prep", "Leadership"],
  },
  {
    slug: "johnny-venters",
    firstName: "Johnny",
    lastName: "Venters",
    title: "Former MLB Pro | Owner",
    roles: ["Owner", "Baseball Performance", "Youth Development"],
    isOwner: true,
    quote: "Hey, I'm Jonny. Legacy is where you make your mark!",
    shortBio:
      "Former professional baseball player and Legacy co-owner focused on building complete athletes from the ground up.",
    history: [
      "Played professional baseball before transitioning into athlete development and facility ownership.",
      "Brings a pitcher's mindset to coaching — precision, repetition, and mental toughness under pressure.",
      "Helped design Legacy's youth curriculum to emphasize movement quality before max-effort testing.",
      "Oversees baseball and multi-sport athlete pipelines at Legacy's Hoschton and Suwanee locations.",
    ],
    highlights: [
      { value: "MLB", label: "Professional career" },
      { value: "10+", label: "Years coaching" },
      { value: "2", label: "Legacy locations" },
    ],
    programSlugs: ["youth-performance", "team-training", "hs-combine-prep"],
    locationSlugs: ["hoschton", "suwanee"],
    specialties: ["Baseball", "Youth development", "Throwing mechanics"],
  },
  {
    slug: "dustin-chovanic",
    firstName: "Dustin",
    lastName: "Chovanic",
    title: "CEO | Owner",
    roles: ["CEO", "Owner", "Performance Director"],
    isOwner: true,
    quote:
      "Hi, I'm Dustin. My pro MMA career has given me the discipline to birth this inclusive vision!",
    shortBio:
      "Legacy CEO and co-founder who built the five-location Georgia network on discipline forged in professional combat sports.",
    history: [
      "Competed professionally in mixed martial arts, developing the work ethic and systems thinking that shaped Legacy's operating model.",
      "Founded Legacy Sports Complex with a vision of inclusive, pro-standard training accessible across metro Atlanta and North Georgia.",
      "Scaled the brand from a single Suwanee flagship to five locations while maintaining unified coaching standards and Legacy Command integration.",
      "Sets facility culture, hiring standards, and the athlete-first philosophy that every Legacy coach is held to.",
    ],
    highlights: [
      { value: "CEO", label: "Legacy Sports Complex" },
      { value: "5", label: "Georgia locations" },
      { value: "Pro", label: "MMA background" },
    ],
    programSlugs: [
      "adult-performance",
      "youth-performance",
      "team-training",
      "hs-combine-prep",
    ],
    locationSlugs: ["suwanee", "alpharetta", "canton"],
    specialties: ["Operations", "Adult performance", "Culture"],
  },
  {
    slug: "christian-blake",
    firstName: "Christian",
    lastName: "Blake",
    nickname: "Coach Blake",
    title: "Trainer | Former NFL Pro | Owner",
    roles: ["Owner", "Wide Receiver Development", "Recruiting"],
    isOwner: true,
    quote:
      "Hey, I'm Christian. My passion is developing premier athletes to be their best!",
    shortBio:
      "Former NFL wide receiver and Legacy owner specializing in route running, speed development, and recruiting exposure.",
    history: [
      "Signed with the Atlanta Falcons and carved out a multi-year NFL career as a reliable wide receiver and special teams contributor.",
      "Known for meticulous route-running detail and football IQ — traits he now installs in every receiver and skill-position athlete at Legacy.",
      "Works directly with College Recruit Track athletes on highlight film, pro-day prep, and scout-facing measurables.",
      "Co-owns Legacy locations and mentors younger coaches on the pro accountability standard.",
    ],
    highlights: [
      { value: "NFL", label: "Career with Falcons" },
      { value: "WR", label: "Position specialist" },
      { value: "40+", label: "Scout network access" },
    ],
    programSlugs: ["college-recruit-track", "hs-combine-prep", "team-training"],
    locationSlugs: ["suwanee", "alpharetta"],
    specialties: ["Wide receiver", "Route running", "Recruiting"],
  },
  {
    slug: "elijah-wilkinson",
    firstName: "Elijah",
    lastName: "Wilkinson",
    title: "NFL Pro and Owner",
    roles: ["Owner", "Offensive Line", "Strength Development"],
    isOwner: true,
    quote: "I'm Elijah. We're all about the work! No excuses.",
    shortBio:
      "NFL offensive lineman and Legacy owner who builds trench warriors — power, mobility, and relentless effort.",
    history: [
      "Played offensive line in the NFL for multiple franchises including the Denver Broncos, Arizona Cardinals, and Atlanta Falcons.",
      "Brings offensive-line-specific strength progressions, pass-pro footwork, and run-game leverage coaching to Legacy athletes.",
      "Emphasizes no-excuses accountability — the same standard that kept him on NFL rosters as an undrafted free agent.",
      "Leads adult and high school strength blocks focused on building durable, powerful athletes.",
    ],
    highlights: [
      { value: "NFL", label: "OL career" },
      { value: "7+", label: "Pro seasons" },
      { value: "OL", label: "Position specialist" },
    ],
    programSlugs: ["adult-performance", "hs-combine-prep", "team-training"],
    locationSlugs: ["lawrenceville", "canton"],
    specialties: ["Offensive line", "Strength", "Power development"],
  },
  {
    slug: "mohamed-sanu",
    firstName: "Mohamed",
    lastName: "Sanu",
    nickname: "Coach Mo",
    title: "Trainer | Former NFL Pro | Owner",
    roles: ["Owner", "Wide Receiver Development", "Mentorship"],
    isOwner: true,
    quote:
      "Hey! I'm Mohamed. I'm ready to challenge you mentally and sharpen your skillsets.",
    shortBio:
      "Super Bowl veteran and Rutgers star who mentors the next generation of Georgia's most driven skill-position athletes.",
    history: [
      "Drafted by the Cincinnati Bengals and later starred for the Atlanta Falcons, reaching Super Bowl LI with the franchise.",
      "One of the most productive receivers in Rutgers history, setting the foundation for a decade-long NFL career.",
      "Known for mental toughness coaching — pushing athletes to perform when fatigued, pressured, and scout-evaluated.",
      "Mentors College Recruit Track and combine athletes on pro-day preparation, interview readiness, and recruiter communication.",
    ],
    highlights: [
      { value: "SB LI", label: "Super Bowl appearance" },
      { value: "10", label: "NFL seasons" },
      { value: "Rutgers", label: "All-time great" },
    ],
    programSlugs: [
      "college-recruit-track",
      "hs-combine-prep",
      "team-training",
      "youth-performance",
    ],
    locationSlugs: ["lawrenceville", "alpharetta", "suwanee"],
    specialties: ["Wide receiver", "Mental performance", "Recruiting"],
  },
];

export function getMarketingCoachesForProgram(programSlug: string) {
  return marketingCoaches.filter((coach) =>
    coach.programSlugs.includes(programSlug)
  );
}

export function getMarketingCoachesForLocation(locationSlug: string) {
  return marketingCoaches.filter((coach) =>
    coach.locationSlugs.includes(locationSlug)
  );
}

export function getMarketingCoachesForProgramAtLocation(
  programSlug: string,
  locationSlug: string
) {
  return marketingCoaches.filter(
    (coach) =>
      coach.programSlugs.includes(programSlug) &&
      coach.locationSlugs.includes(locationSlug)
  );
}

export function getMarketingCoachBySlug(slug: string) {
  return marketingCoaches.find((coach) => coach.slug === slug);
}

export function getCoachDisplayName(coach: MarketingCoach) {
  return `${coach.firstName} ${coach.lastName}`;
}

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
