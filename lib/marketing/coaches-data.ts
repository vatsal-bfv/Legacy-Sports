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
      "I'm Spoon. We built Legacy to give every athlete the pro standard from day one — no shortcuts, no excuses.",
    shortBio:
      "First-round NFL linebacker and Pro Bowl talent who brings championship-level intensity to every session at Legacy.",
    history: [
      "First-round pick (19th overall) by the Atlanta Falcons in the 2010 NFL Draft after a decorated career at the University of Missouri.",
      "Named to the Pro Bowl in 2012 and earned All-Pro honors while anchoring the Falcons defense for six seasons.",
      "Finished his NFL career with over 470 tackles, establishing himself as one of the most physical linebackers of his era.",
      "Co-founded Legacy Sports Complex to translate pro-level standards — film study, accountability, and measurable progress — into youth and high school athlete development nationwide.",
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
      "Oversees baseball and multi-sport athlete pipelines at Legacy campuses in the Southeast.",
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
      "Legacy CEO and co-founder who built Legacy's nationwide campus network on discipline forged in professional combat sports.",
    history: [
      "Competed professionally in mixed martial arts, developing the work ethic and systems thinking that shaped Legacy's operating model.",
      "Founded Legacy Sports Complex with a vision of inclusive, pro-standard training accessible coast to coast.",
      "Scaled the brand from a single flagship to a multi-state network while maintaining unified coaching standards and Legacy Command integration.",
      "Sets facility culture, hiring standards, and the athlete-first philosophy that every Legacy coach is held to.",
    ],
    highlights: [
      { value: "CEO", label: "Legacy Sports Complex" },
      { value: "8+", label: "Campus locations" },
      { value: "Pro", label: "MMA background" },
    ],
    programSlugs: [
      "adult-performance",
      "youth-performance",
      "team-training",
      "hs-combine-prep",
    ],
    locationSlugs: ["suwanee", "alpharetta", "canton", "lawrenceville"],
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
    programSlugs: ["college-recruit-track", "hs-combine-prep", "team-training", "youth-performance"],
    locationSlugs: ["suwanee", "alpharetta", "lawrenceville"],
    specialties: ["Wide receiver", "Route running", "Recruiting"],
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
