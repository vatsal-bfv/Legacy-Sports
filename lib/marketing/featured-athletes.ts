import { HERO_ATHLETE_PHOTOS } from "@/lib/demo/athlete-photos";

export type FeaturedAthleteStat = {
  value: string;
  label: string;
};

export type AthleteFloatingMetric = {
  id: string;
  value: string;
  label: string;
  x: number;
  y: number;
  detail?: string;
};

export type AthleteWearableVital = {
  id: string;
  label: string;
  value: string;
  unit?: string;
  note?: string;
  x: number;
  y: number;
  animation?: "heart" | "pulse" | "wave" | "step";
};

export type FeaturedAthlete = {
  id: string;
  first_name: string;
  last_name: string;
  sport: string;
  school: string;
  photo_url: string;
  story: string;
  slug: string;
  stats: FeaturedAthleteStat[];
  floatingMetrics: AthleteFloatingMetric[];
  wearableVitals: AthleteWearableVital[];
};

export const featuredAthletes: FeaturedAthlete[] = [
  {
    id: "a0000001-0001-4000-8000-000000000001",
    first_name: "Marcus",
    last_name: "Johnson",
    sport: "football",
    school: "North Gwinnett High School",
    photo_url: HERO_ATHLETE_PHOTOS.marcus,
    story:
      "Marcus arrived at Legacy as a sophomore quarterback running a 4.9 forty. Six months of combine prep dropped him to 4.58 with a 36-inch vertical. He now has active D1 conversations and a recruiting profile scouts review through Legacy Command.",
    slug: "marcus-johnson",
    stats: [
      { value: "4.58s", label: "40-Yard PR" },
      { value: '36"', label: "Vertical PR" },
    ],
    floatingMetrics: [
      {
        id: "forty",
        value: "4.58s",
        label: "40-Yard Dash",
        x: 22,
        y: 22,
        detail: "Combine PR · −0.32s since intake",
      },
      {
        id: "vertical",
        value: '36"',
        label: "Vertical Jump",
        x: 78,
        y: 22,
        detail: "Measured monthly at Suwanee",
      },
      {
        id: "power",
        value: "88",
        label: "Power Index",
        x: 22,
        y: 72,
        detail: "Legacy Command composite score",
      },
      {
        id: "attendance",
        value: "94%",
        label: "Session Attendance",
        x: 78,
        y: 72,
        detail: "Last 90 days",
      },
    ],
    wearableVitals: [
      { id: "hr", label: "Resting heart rate", value: "58", unit: "bpm", x: 16, y: 42, animation: "heart" },
      { id: "sleep", label: "Sleep duration", value: "7.2", unit: "hrs", x: 84, y: 42, animation: "pulse" },
      { id: "recovery", label: "Recovery score", value: "82", unit: "%", x: 16, y: 55, animation: "pulse" },
      { id: "hrv", label: "Heart rate variability", value: "64", unit: "ms", x: 84, y: 55, animation: "wave" },
      { id: "strain", label: "Training strain", value: "11.2", x: 40, y: 82, animation: "wave" },
      { id: "steps", label: "Daily movement", value: "8,420", unit: "steps", x: 60, y: 82, animation: "step" },
    ],
  },
  {
    id: "a0000001-0001-4000-8000-000000000002",
    first_name: "Ariana",
    last_name: "Brooks",
    sport: "track",
    school: "Mill Creek High School",
    photo_url: "https://randomuser.me/api/portraits/women/65.jpg",
    story:
      "Ariana joined Legacy's youth performance track before moving into high-school sprint work. Her 100m dropped from 12.4 to 11.9 in one season while power metrics improved 5.4x on Legacy Command's tracked progression charts.",
    slug: "ariana-brooks",
    stats: [
      { value: "11.9s", label: "100m PR" },
      { value: "5.4x", label: "Power Gain" },
    ],
    floatingMetrics: [
      {
        id: "sprint",
        value: "11.9s",
        label: "100m Sprint",
        x: 22,
        y: 22,
        detail: "Season PR · −0.5s YoY",
      },
      {
        id: "power",
        value: "5.4x",
        label: "Power Gain",
        x: 78,
        y: 22,
        detail: "Tracked on Legacy Command",
      },
      {
        id: "stride",
        value: "4.2",
        label: "Stride Frequency",
        x: 22,
        y: 72,
        detail: "Hz at max velocity",
      },
      {
        id: "rank",
        value: "Top 8%",
        label: "Program Rank",
        x: 78,
        y: 72,
        detail: "Within Legacy sprint cohort",
      },
    ],
    wearableVitals: [
      { id: "hr", label: "Resting heart rate", value: "54", unit: "bpm", x: 16, y: 42, animation: "heart" },
      { id: "sleep", label: "Sleep duration", value: "8.1", unit: "hrs", x: 84, y: 42, animation: "pulse" },
      { id: "recovery", label: "Recovery score", value: "88", unit: "%", x: 16, y: 55, animation: "pulse" },
      { id: "hrv", label: "Heart rate variability", value: "72", unit: "ms", x: 84, y: 55, animation: "wave" },
      { id: "strain", label: "Training strain", value: "9.8", x: 40, y: 82, animation: "wave" },
      { id: "cadence", label: "Avg run cadence", value: "182", unit: "spm", x: 60, y: 82, animation: "step" },
    ],
  },
  {
    id: "a0000001-0001-4000-8000-000000000004",
    first_name: "DeShawn",
    last_name: "Carter",
    sport: "football",
    school: "Roswell High School",
    photo_url: HERO_ATHLETE_PHOTOS.deshawn,
    story:
      "DeShawn entered as an overlooked wide receiver with limited recruiting exposure. Twelve months of measurable-focused training produced two D1 offers, a 38-inch vertical, and a scout portal profile viewed by 40+ college programs.",
    slug: "deshawn-carter",
    stats: [
      { value: "2", label: "D1 Offers" },
      { value: '38"', label: "Vertical PR" },
    ],
    floatingMetrics: [
      {
        id: "offers",
        value: "2",
        label: "D1 Offers",
        x: 22,
        y: 22,
        detail: "Active as of this season",
      },
      {
        id: "vertical",
        value: '38"',
        label: "Vertical Jump",
        x: 78,
        y: 22,
        detail: "PR at Legacy combine day",
      },
      {
        id: "scouts",
        value: "40+",
        label: "Scout Views",
        x: 22,
        y: 72,
        detail: "Legacy recruit portal",
      },
      {
        id: "yac",
        value: "+18%",
        label: "YAC Efficiency",
        x: 78,
        y: 72,
        detail: "Season-over-season",
      },
    ],
    wearableVitals: [
      { id: "hr", label: "Resting heart rate", value: "60", unit: "bpm", x: 16, y: 42, animation: "heart" },
      { id: "sleep", label: "Sleep duration", value: "6.9", unit: "hrs", x: 84, y: 42, animation: "pulse" },
      { id: "recovery", label: "Recovery score", value: "79", unit: "%", x: 16, y: 55, animation: "pulse" },
      { id: "hrv", label: "Heart rate variability", value: "58", unit: "ms", x: 84, y: 55, animation: "wave" },
      { id: "strain", label: "Training strain", value: "12.4", x: 40, y: 82, animation: "wave" },
      { id: "spo2", label: "Blood oxygen", value: "98", unit: "%", x: 60, y: 82, animation: "pulse" },
    ],
  },
  {
    id: "a0000001-0001-4000-8000-000000000005",
    first_name: "Emma",
    last_name: "Patel",
    sport: "volleyball",
    school: "Johns Creek High School",
    photo_url: HERO_ATHLETE_PHOTOS.emma,
    story:
      "Emma trains for approach vertical and explosive first-step power at Legacy's Suwanee location. She gained 18 inches on her approach jump in eight months while maintaining 91% session attendance across school and club seasons.",
    slug: "emma-patel",
    stats: [
      { value: '18"', label: "Approach Gain" },
      { value: "91%", label: "Attendance" },
    ],
    floatingMetrics: [
      {
        id: "approach",
        value: '+18"',
        label: "Approach Gain",
        x: 22,
        y: 22,
        detail: "Since joining Legacy",
      },
      {
        id: "attendance",
        value: "91%",
        label: "Attendance",
        x: 78,
        y: 22,
        detail: "School + club season",
      },
      {
        id: "contact",
        value: "10'4\"",
        label: "Contact Height",
        x: 22,
        y: 72,
        detail: "Approach reach PR",
      },
      {
        id: "power",
        value: "86",
        label: "Power Index",
        x: 78,
        y: 72,
        detail: "Legacy Command composite",
      },
    ],
    wearableVitals: [
      { id: "hr", label: "Resting heart rate", value: "56", unit: "bpm", x: 16, y: 42, animation: "heart" },
      { id: "sleep", label: "Sleep duration", value: "7.8", unit: "hrs", x: 84, y: 42, animation: "pulse" },
      { id: "recovery", label: "Recovery score", value: "85", unit: "%", x: 16, y: 55, animation: "pulse" },
      { id: "hrv", label: "Heart rate variability", value: "68", unit: "ms", x: 84, y: 55, animation: "wave" },
      { id: "strain", label: "Training strain", value: "10.1", x: 40, y: 82, animation: "wave" },
      { id: "jump", label: "Jump load", value: "142", unit: "count", x: 60, y: 82, animation: "step" },
    ],
  },
];

export function formatFeaturedSport(sport: string) {
  if (sport === "track") {
    return "Track";
  }

  return sport.charAt(0).toUpperCase() + sport.slice(1);
}

export function getFeaturedAthleteName(athlete: FeaturedAthlete) {
  return `${athlete.first_name} ${athlete.last_name}`;
}
