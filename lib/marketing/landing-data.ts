import {
  featuredAthletes,
  formatFeaturedSport,
  getFeaturedAthleteName,
} from "@/lib/marketing/featured-athletes";

export const heroMarqueeItems = [
  "Hand Trained",
  "One On One",
  "Combine Prep",
  "Speed & Agility",
  "College Recruiting",
  "Legacy Command AI",
  "Sean Weatherspoon",
  "Johnny Venters",
  "Dustin Chovanic",
  "Georgia's Best",
];

export const statItems = [
  { value: 1200, suffix: "+", label: "Athletes Trained" },
  { value: 5, suffix: "", label: "Georgia Locations" },
  { value: 3, suffix: "", label: "D1 Commitments This Season" },
  { value: 10, suffix: "+", label: "Years Building Champions" },
];

export const credentialCards = [
  {
    icon: "bolt",
    title: "Owned By The Pros",
    description:
      "Sean Weatherspoon - Johnny Venters - Christian Blake - Dustin Chovanic - bringing pro-level standards to every session.",
  },
  {
    icon: "target",
    title: "The Recruiting Pipeline",
    description:
      "40+ active college scouts access athlete measurables through Legacy Command. Your data works even when you're not in the facility.",
  },
  {
    icon: "cpu",
    title: "AI-Powered Operations",
    description:
      "Legacy Command replaces Mindbody, Hudl, TeamBuildr, and Mailchimp. One system. Every athlete. Every location.",
  },
];

export const programCards = [
  {
    number: "01",
    slug: "youth-performance",
    icon: "rocket",
    name: "Youth Performance",
    meta: "Ages 6-13 - Foundational Track",
    description:
      "Building the movement foundation. Speed, agility, coordination.",
  },
  {
    number: "02",
    slug: "hs-combine-prep",
    icon: "gauge",
    name: "HS Combine Prep",
    meta: "Ages 14-18 - 90-Min Sessions",
    description:
      "40-yard, vertical, bench - measured monthly. Your numbers, on record.",
  },
  {
    number: "03",
    slug: "college-recruit-track",
    icon: "radar",
    name: "College Recruit Track",
    meta: "Ages 15-18 - Exposure Track",
    description:
      "Your measurables in front of 40+ scouts. The path from local to national.",
  },
  {
    number: "04",
    slug: "adult-performance",
    icon: "shield",
    name: "Adult Performance",
    meta: "18+ - Elite Conditioning",
    description: "Pro-level programming without the pro roster.",
  },
  {
    number: "05",
    slug: "team-training",
    icon: "users",
    name: "Team Training",
    meta: "All Ages - Seasonal Blocks",
    description:
      "Off-season conditioning. Pre-season dominance.",
  },
];

export const originsStory = {
  lead:
    "From first session to college signing - Legacy's system doesn't stop at the facility wall.",
  paragraphs: [
    "Legacy started when a group of former NFL and MLB athletes asked a simple question: why does athlete development still feel fragmented? Training in one place, recruiting in another, data scattered across five different apps.",
    "They built Legacy to answer it - pro-level coaching standards, a statewide facility network, and Legacy Command, the AI operating system that tracks every measurable from first session to college commitment.",
  ],
  ownershipIntro:
    "The ownership group isn't ceremonial. They set coaching standards, review programming, and hold every location accountable to the same pro-level bar.",
  facilityIntro:
    "Suwanee was the first facility. Five Georgia locations now run the same development system - same coaches, same measurables, same path to recruitment.",
};

export const originsHero = {
  src: "https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=1800",
  alt: "Athletes training on the turf at Legacy Sports Complex's Suwanee flagship facility",
  location: "Suwanee Flagship",
  detail: "15,000 sq ft - Turf, weight room, recovery",
};

export const originsOwners = [
  {
    name: "Sean Weatherspoon",
    role: "Former Atlanta Falcon",
  },
  {
    name: "Dustin Chovanic",
    role: "CEO | Legacy Sports Complex",
  },
  {
    name: "Johnny Venters",
    role: "MLB Veteran",
  },
  {
    name: "Christian Blake",
    role: "Pro Football Alum",
  },
];

export const originsMilestones = [
  { value: "15K", label: "Sq Ft Flagship" },
  { value: "5", label: "Georgia Locations" },
  { value: "10+", label: "Years Building Champions" },
];

export const athleteCards = featuredAthletes.map((athlete) => ({
  slug: athlete.slug,
  name: getFeaturedAthleteName(athlete),
  school: athlete.school,
  sport: formatFeaturedSport(athlete.sport),
  image: athlete.photo_url,
  stats: athlete.stats,
}));

export const familyTestimonials = [
  {
    quote:
      "Legacy didn't just train my son - they gave him a recruiting profile. He had two D1 conversations by the end of the year. I didn't know that was possible at 16.",
    name: "Darnell P.",
    role: "Parent, Suwanee",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
  },
  {
    quote:
      "The data they track is unlike anything I'd seen at another facility. My daughter's 40-yard time dropped by 0.3 seconds in four months. We have the charts to prove it.",
    name: "Kimberly R.",
    role: "Parent, Lawrenceville",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    quote:
      "Coming in as a walk-on candidate, I needed something that would get me noticed. Legacy's combine prep and the scout portal got me in front of three programs.",
    name: "Marcus T.",
    role: "Athlete, Class of 2026",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
  },
];

export const testimonialMarqueeItems = [
  "Speed & Agility",
  "Combine Prep",
  "Strength Training",
  "College Recruiting",
  "Team Training",
  "1 On 1 Coaching",
  "Wearable Analytics",
  "Legacy Command",
];

export const commandFeatures = [
  "Athlete performance tracking & measurables",
  "AI-generated re-engagement for at-risk athletes",
  "Real-time lead capture from your website",
  "College scout portal - your data as a revenue stream",
  'Natural language query: "show me all QBs under 4.7"',
];

export const trustSignals = [
  "No commitment required",
  "Free first session",
  "Response within 24 hours",
];
