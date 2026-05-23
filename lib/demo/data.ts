import {
  COACH_RODRIGUEZ_ID,
  HERO_IDS,
  LOCATION_IDS,
} from "@/lib/constants";
import { featuredAthletes } from "@/lib/marketing/featured-athletes";
import type {
  Athlete,
  Attendance,
  Coach,
  CoachNote,
  Lead,
  Location,
  Measurable,
  Payment,
  Program,
  ScoutUser,
  Session,
  VideoClip,
  WearableData,
} from "./types";

const STOCK_VIDEO =
  "https://videos.pexels.com/video-files/4761414/4761414-uhd_2560_1440_25fps.mp4";
const STOCK_THUMB =
  "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=400";

export const locations: Location[] = [
  {
    id: LOCATION_IDS.phoenix,
    name: "Suwanee",
    slug: "suwanee",
    address: "4120 Suwanee Dam Rd, Suwanee, GA 30024",
    lat: 34.0492,
    lng: -84.0713,
    square_footage: 15000,
    amenities: ["turf", "weight room", "recovery", "combine lab"],
    photo_urls: [
      "https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    phone: "(470) 555-0101",
    hours: {
      Mon: "6am-9pm",
      Tue: "6am-9pm",
      Wed: "6am-9pm",
      Thu: "6am-9pm",
      Fri: "6am-8pm",
      Sat: "8am-5pm",
      Sun: "10am-4pm",
    },
  },
  {
    id: LOCATION_IDS.mesa,
    name: "Lawrenceville",
    slug: "lawrenceville",
    address: "1475 Buford Dr, Lawrenceville, GA 30043",
    lat: 33.9581,
    lng: -84.0044,
    square_footage: 12000,
    amenities: ["turf", "weight room", "film room"],
    photo_urls: [
      "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    phone: "(678) 555-0102",
    hours: {
      Mon: "6am-9pm",
      Tue: "6am-9pm",
      Wed: "6am-9pm",
      Thu: "6am-9pm",
      Fri: "6am-8pm",
      Sat: "8am-4pm",
      Sun: "Closed",
    },
  },
  {
    id: LOCATION_IDS.gilbert,
    name: "Hoschton",
    slug: "hoschton",
    address: "204 Industrial Blvd, Hoschton, GA 30548",
    lat: 34.1007,
    lng: -83.7621,
    square_footage: 11000,
    amenities: ["turf", "weight room", "recovery"],
    photo_urls: [
      "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    phone: "(706) 555-0103",
    hours: {
      Mon: "6am-8pm",
      Tue: "6am-8pm",
      Wed: "6am-8pm",
      Thu: "6am-8pm",
      Fri: "6am-7pm",
      Sat: "8am-3pm",
      Sun: "Closed",
    },
  },
  {
    id: LOCATION_IDS.scottsdale,
    name: "Canton",
    slug: "canton",
    address: "105 Brown Industrial Pkwy, Canton, GA 30114",
    lat: 34.2367,
    lng: -84.4908,
    square_footage: 13000,
    amenities: ["turf", "weight room", "sports science"],
    photo_urls: [
      "https://images.pexels.com/photos/262524/pexels-photo-262524.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    phone: "(770) 555-0104",
    hours: {
      Mon: "6am-9pm",
      Tue: "6am-9pm",
      Wed: "6am-9pm",
      Thu: "6am-9pm",
      Fri: "6am-7pm",
      Sat: "8am-4pm",
      Sun: "Closed",
    },
  },
  {
    id: LOCATION_IDS.chandler,
    name: "Alpharetta",
    slug: "alpharetta",
    address: "6400 North Point Pkwy, Alpharetta, GA 30022",
    lat: 34.0387,
    lng: -84.2782,
    square_footage: 12500,
    amenities: ["turf", "weight room", "recovery"],
    photo_urls: [
      "https://images.pexels.com/photos/4672184/pexels-photo-4672184.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    phone: "(678) 555-0105",
    hours: {
      Mon: "6am-9pm",
      Tue: "6am-9pm",
      Wed: "6am-9pm",
      Thu: "6am-9pm",
      Fri: "6am-8pm",
      Sat: "8am-4pm",
      Sun: "Closed",
    },
  },
];

export const programs: Program[] = [
  {
    id: "p0000001-0001-4000-8000-000000000001",
    name: "Youth Performance",
    description:
      "Foundational athletic development for ages 10–14. Speed, agility, and sport-specific fundamentals.",
    monthly_price: 199,
    target_age_min: 10,
    target_age_max: 14,
  },
  {
    id: "p0000001-0001-4000-8000-000000000002",
    name: "HS Combine Prep",
    description:
      "Elite combine training for high school athletes targeting college recruitment.",
    monthly_price: 349,
    target_age_min: 14,
    target_age_max: 18,
  },
  {
    id: "p0000001-0001-4000-8000-000000000003",
    name: "College Recruit Track",
    description:
      "Advanced measurables tracking, film study, and recruiter-facing profiles.",
    monthly_price: 449,
    target_age_min: 16,
    target_age_max: 19,
  },
  {
    id: "p0000001-0001-4000-8000-000000000004",
    name: "Adult Performance",
    description: "Strength and conditioning for adult athletes and weekend warriors.",
    monthly_price: 149,
    target_age_min: 18,
    target_age_max: 55,
  },
  {
    id: "p0000001-0001-4000-8000-000000000005",
    name: "Team Training",
    description: "Custom team packages for clubs and high school programs.",
    monthly_price: 299,
    target_age_min: 12,
    target_age_max: 18,
  },
];

export const coaches: Coach[] = [
  {
    id: "c0000001-0001-4000-8000-000000000001",
    first_name: "James",
    last_name: "Mitchell",
    email: "james@legacy.demo",
    photo_url: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Former D1 QB coach specializing in combine prep and quarterback development.",
    specialties: ["football", "quarterback", "combine"],
    primary_location_id: LOCATION_IDS.phoenix,
    voice_sample:
      "Hey there — I wanted to reach out because we've been tracking your athlete's progress closely. The work they've put in is showing up in the numbers, and I think a quick check-in would help us keep that momentum going. Let me know when works for a call.",
  },
  {
    id: COACH_RODRIGUEZ_ID,
    first_name: "Mike",
    last_name: "Rodriguez",
    email: "mike.r@legacy.demo",
    photo_url: "https://randomuser.me/api/portraits/men/45.jpg",
    bio: "Basketball performance coach with 12 years of youth development experience.",
    specialties: ["basketball", "strength"],
    primary_location_id: LOCATION_IDS.mesa,
    voice_sample:
      "Hi — it's Coach Mike. I noticed we haven't seen your athlete in a few days and wanted to check in. They hit a big squat PR recently and I'd hate for that momentum to slip. Can we get them back on the schedule this week?",
  },
  {
    id: "c0000001-0001-4000-8000-000000000003",
    first_name: "Sarah",
    last_name: "Kim",
    email: "sarah@legacy.demo",
    photo_url: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "Multi-sport speed and agility specialist.",
    specialties: ["soccer", "track", "speed"],
    primary_location_id: LOCATION_IDS.gilbert,
    voice_sample:
      "Quick note from Coach Sarah — your athlete has been crushing it in speed work. Let's keep building on that progress.",
  },
  {
    id: "c0000001-0001-4000-8000-000000000004",
    first_name: "David",
    last_name: "Thompson",
    email: "david@legacy.demo",
    photo_url: "https://randomuser.me/api/portraits/men/22.jpg",
    bio: "Wide receiver and route-running specialist.",
    specialties: ["football", "wide receiver"],
    primary_location_id: LOCATION_IDS.scottsdale,
    voice_sample:
      "Hey — Coach David here. Wanted to celebrate the progress we've seen and talk about next steps for recruitment.",
  },
  {
    id: "c0000001-0001-4000-8000-000000000005",
    first_name: "Lisa",
    last_name: "Nguyen",
    email: "lisa@legacy.demo",
    photo_url: "https://randomuser.me/api/portraits/women/68.jpg",
    bio: "Volleyball and vertical jump development coach.",
    specialties: ["volleyball", "vertical"],
    primary_location_id: LOCATION_IDS.chandler,
    voice_sample:
      "Hi! Coach Lisa checking in — your athlete's vertical numbers have been trending up and I want to make sure we keep that going.",
  },
  {
    id: "c0000001-0001-4000-8000-000000000006",
    first_name: "Carlos",
    last_name: "Rivera",
    email: "carlos@legacy.demo",
    photo_url: "https://randomuser.me/api/portraits/men/55.jpg",
    bio: "Strength and power development across all sports.",
    specialties: ["strength", "power"],
    primary_location_id: LOCATION_IDS.phoenix,
    voice_sample:
      "Coach Carlos here — great session last week. Let's lock in the next one.",
  },
  {
    id: "c0000001-0001-4000-8000-000000000007",
    first_name: "Amy",
    last_name: "Foster",
    email: "amy@legacy.demo",
    photo_url: "https://randomuser.me/api/portraits/women/26.jpg",
    bio: "Recovery and sports science integration.",
    specialties: ["recovery", "wearables"],
    primary_location_id: LOCATION_IDS.mesa,
    voice_sample:
      "Hi — Coach Amy. Your recovery metrics looked solid this week. Keep it up!",
  },
  {
    id: "c0000001-0001-4000-8000-000000000008",
    first_name: "Ryan",
    last_name: "O'Brien",
    email: "ryan@legacy.demo",
    photo_url: "https://randomuser.me/api/portraits/men/36.jpg",
    bio: "Baseball performance and arm care.",
    specialties: ["baseball", "throwing"],
    primary_location_id: LOCATION_IDS.gilbert,
    voice_sample:
      "Coach Ryan — wanted to follow up on your athlete's throwing program progress.",
  },
];

const marcusSummary = `Marcus Johnson is one of Legacy's standout quarterback prospects — a 6'2", 195 lb junior at Desert Vista with a 3.6 GPA. Over the past nine months, his 40-yard dash has dropped from 4.78 to 4.62 seconds, and his vertical has climbed from 31" to 36", placing him in the top tier of 2027 recruits in the Southwest. Coaches consistently note his improved hip mobility and faster release. With three D1 programs expressing interest, Marcus profiles as a high-likelihood Power Five commit if his trajectory continues through summer camp season.`;

const tylerSummary = `Tyler Chen is a 15-year-old point guard in our Youth Performance program at Mesa. After eight months of consistent 3x/week attendance, he's shown strong lower-body development — a recent squat PR of 245 lbs (up from 225). However, Tyler has missed his last two scheduled sessions this week, representing a 6-day gap that triggers our at-risk protocol. His coach Mike Rodriguez recommends immediate parent outreach referencing his recent strength gains to re-engage before habit decay sets in.`;

export const heroAthletes: Athlete[] = [
  {
    id: HERO_IDS.marcus,
    first_name: "Marcus",
    last_name: "Johnson",
    date_of_birth: "2009-03-15",
    sport: "football",
    position: "quarterback",
    gender: "male",
    graduation_year: 2027,
    school: "Desert Vista High School",
    gpa: 3.6,
    home_location_id: LOCATION_IDS.phoenix,
    photo_url: "https://randomuser.me/api/portraits/men/75.jpg",
    parent_name: "Robert Johnson",
    parent_email: "r.johnson@email.demo",
    parent_phone: "(602) 555-1001",
    program_id: programs[1].id,
    enrollment_date: "2024-06-01",
    status: "active",
    ai_summary: marcusSummary,
    scout_visible: true,
    recruit_status: "considering",
    created_at: "2024-06-01T00:00:00Z",
    updated_at: new Date().toISOString(),
  },
  {
    id: HERO_IDS.tyler,
    first_name: "Tyler",
    last_name: "Chen",
    date_of_birth: "2010-08-22",
    sport: "basketball",
    position: "point guard",
    gender: "male",
    graduation_year: 2028,
    school: "Mesa High School",
    gpa: 3.4,
    home_location_id: LOCATION_IDS.mesa,
    photo_url: "https://randomuser.me/api/portraits/men/18.jpg",
    parent_name: "Jennifer Chen",
    parent_email: "j.chen@email.demo",
    parent_phone: "(480) 555-1002",
    program_id: programs[0].id,
    enrollment_date: "2024-04-15",
    status: "at_risk",
    ai_summary: tylerSummary,
    scout_visible: true,
    recruit_status: "uncommitted",
    created_at: "2024-04-15T00:00:00Z",
    updated_at: new Date().toISOString(),
    risk_score: 87,
  },
  {
    id: HERO_IDS.sofia,
    first_name: "Sofia",
    last_name: "Martinez",
    date_of_birth: "2011-01-10",
    sport: "multi",
    position: null,
    gender: "female",
    graduation_year: 2029,
    school: "Gilbert High School",
    gpa: 4.0,
    home_location_id: LOCATION_IDS.gilbert,
    photo_url: "https://randomuser.me/api/portraits/women/65.jpg",
    parent_name: "Maria Martinez",
    parent_email: "m.martinez@email.demo",
    parent_phone: "(480) 555-1003",
    program_id: programs[0].id,
    enrollment_date: "2024-05-01",
    status: "active",
    ai_summary:
      "Sofia Martinez is a 14-year-old multi-sport athlete showing clear soccer specialization signals after 12 months of training. Multiple PRs in 100m and vertical jump, with a perfect 4.0 GPA.",
    scout_visible: true,
    recruit_status: "uncommitted",
    created_at: "2024-05-01T00:00:00Z",
    updated_at: new Date().toISOString(),
  },
  {
    id: HERO_IDS.deshawn,
    first_name: "DeShawn",
    last_name: "Williams",
    date_of_birth: "2008-11-05",
    sport: "football",
    position: "wide receiver",
    gender: "male",
    graduation_year: 2026,
    school: "Chaparral High School",
    gpa: 3.2,
    home_location_id: LOCATION_IDS.scottsdale,
    photo_url: "https://randomuser.me/api/portraits/men/52.jpg",
    parent_name: "Darnell Williams",
    parent_email: "d.williams@email.demo",
    parent_phone: "(480) 555-1004",
    program_id: programs[2].id,
    enrollment_date: "2023-09-01",
    status: "active",
    ai_summary:
      "DeShawn Williams transformed from an overlooked prospect to a two-offer D1 wide receiver over 12 months. His measurable progression curve is among the steepest in our system.",
    scout_visible: true,
    recruit_status: "committed",
    created_at: "2023-09-01T00:00:00Z",
    updated_at: new Date().toISOString(),
  },
  {
    id: HERO_IDS.emma,
    first_name: "Emma",
    last_name: "Patel",
    date_of_birth: "2012-04-18",
    sport: "volleyball",
    position: "outside hitter",
    gender: "female",
    graduation_year: 2030,
    school: "Hamilton High School",
    gpa: 3.8,
    home_location_id: LOCATION_IDS.chandler,
    photo_url: "https://randomuser.me/api/portraits/women/32.jpg",
    parent_name: "Priya Patel",
    parent_email: "p.patel@email.demo",
    parent_phone: "(480) 555-1005",
    program_id: programs[0].id,
    enrollment_date: "2024-08-01",
    status: "active",
    ai_summary:
      "Emma Patel is a 13-year-old volleyball athlete with exceptionally engaged parent communication. Strong vertical development and consistent attendance.",
    scout_visible: false,
    recruit_status: "uncommitted",
    created_at: "2024-08-01T00:00:00Z",
    updated_at: new Date().toISOString(),
  },
];

function generateBackgroundAthletes(): Athlete[] {
  const firstNames = [
    "Alex",
    "Jordan",
    "Taylor",
    "Morgan",
    "Casey",
    "Riley",
    "Jamie",
    "Quinn",
    "Avery",
    "Blake",
    "Cameron",
    "Drew",
    "Elliot",
    "Finley",
    "Harper",
    "Jesse",
    "Kai",
    "Logan",
    "Noah",
    "Parker",
  ];
  const lastNames = [
    "Adams",
    "Baker",
    "Clark",
    "Davis",
    "Evans",
    "Fisher",
    "Garcia",
    "Hill",
    "Iverson",
    "James",
    "Kim",
    "Lopez",
    "Martinez",
    "Nguyen",
    "Owens",
    "Patel",
    "Reed",
    "Singh",
    "Torres",
    "Walker",
  ];
  const sports = [
    { sport: "football", weight: 35 },
    { sport: "basketball", weight: 25 },
    { sport: "baseball", weight: 15 },
    { sport: "soccer", weight: 10 },
    { sport: "multi", weight: 10 },
    { sport: "volleyball", weight: 5 },
  ];
  const statuses: Athlete["status"][] = [
    "active",
    "active",
    "active",
    "paused",
    "at_risk",
    "churned",
  ];
  const locIds = Object.values(LOCATION_IDS);
  const athletes: Athlete[] = [];

  for (let i = 0; i < 145; i++) {
    const sportIdx = i % sports.length;
    const locIdx = i % locIds.length;
    const status = statuses[i % statuses.length];
    athletes.push({
      id: `a0000002-${String(i + 1).padStart(4, "0")}-4000-8000-000000000000`,
      first_name: firstNames[i % firstNames.length],
      last_name: lastNames[(i * 3 + 1) % lastNames.length],
      date_of_birth: `20${10 + (i % 6)}-${String((i % 12) + 1).padStart(2, "0")}-15`,
      sport: sports[sportIdx].sport,
      position: i % 3 === 0 ? "athlete" : null,
      gender: i % 2 === 0 ? "male" : "female",
      graduation_year: 2025 + (i % 5),
      school: `Valley High School ${i + 1}`,
      gpa: 2.8 + (i % 8) * 0.1,
      home_location_id: locIds[locIdx],
      photo_url: `https://randomuser.me/api/portraits/${i % 2 === 0 ? "men" : "women"}/${(i % 70) + 1}.jpg`,
      parent_name: `Parent ${i + 1}`,
      parent_email: `parent${i + 1}@email.demo`,
      parent_phone: `(480) 555-${String(2000 + i).slice(-4)}`,
      program_id: programs[i % programs.length].id,
      enrollment_date: "2024-01-15",
      status,
      ai_summary: `Athlete profile for training program tracking. ${status === "active" ? "Currently active in program." : `Status: ${status}.`}`,
      scout_visible: i % 3 !== 0,
      recruit_status: ["uncommitted", "considering", "committed", "signed"][
        i % 4
      ],
      created_at: "2024-01-15T00:00:00Z",
      updated_at: new Date().toISOString(),
      risk_score:
        status === "at_risk" ? 60 + ((i * 11 + 7) % 30) : undefined,
    });
  }
  return athletes;
}

export const athletes: Athlete[] = [
  ...heroAthletes,
  ...generateBackgroundAthletes(),
];

const sixMonths = (() => {
  const dates: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    dates.push(d.toISOString());
  }
  return dates;
})();

function generateMarcusMeasurables(): Measurable[] {
  const metrics: Measurable[] = [];
  const fortyValues = [4.78, 4.74, 4.71, 4.68, 4.65, 4.62];
  const vertValues = [31, 32, 33, 34, 35, 36];
  for (let i = 0; i < sixMonths.length; i++) {
    metrics.push({
      id: `m-marcus-40-${i}`,
      athlete_id: HERO_IDS.marcus,
      recorded_at: sixMonths[i],
      metric: "forty_yard",
      value: fortyValues[i],
      unit: "seconds",
      is_pr: i === fortyValues.length - 1,
      recorded_by_coach_id: coaches[0].id,
    });
    metrics.push({
      id: `m-marcus-v-${i}`,
      athlete_id: HERO_IDS.marcus,
      recorded_at: sixMonths[i],
      metric: "vertical",
      value: vertValues[i],
      unit: "inches",
      is_pr: i === vertValues.length - 1,
      recorded_by_coach_id: coaches[0].id,
    });
  }
  metrics.push({
    id: "m-marcus-h",
    athlete_id: HERO_IDS.marcus,
    recorded_at: new Date().toISOString(),
    metric: "height",
    value: 74,
    unit: "inches",
    is_pr: false,
    recorded_by_coach_id: coaches[0].id,
  });
  metrics.push({
    id: "m-marcus-w",
    athlete_id: HERO_IDS.marcus,
    recorded_at: new Date().toISOString(),
    metric: "weight",
    value: 195,
    unit: "pounds",
    is_pr: false,
    recorded_by_coach_id: coaches[0].id,
  });
  return metrics;
}

export const measurables: Measurable[] = [
  ...generateMarcusMeasurables(),
  {
    id: "m-tyler-squat",
    athlete_id: HERO_IDS.tyler,
    recorded_at: new Date(Date.now() - 21 * 86400000).toISOString(),
    metric: "squat_max",
    value: 245,
    unit: "pounds",
    is_pr: true,
    recorded_by_coach_id: COACH_RODRIGUEZ_ID,
  },
  {
    id: "m-tyler-squat-old",
    athlete_id: HERO_IDS.tyler,
    recorded_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    metric: "squat_max",
    value: 225,
    unit: "pounds",
    is_pr: false,
    recorded_by_coach_id: COACH_RODRIGUEZ_ID,
  },
];

export const scoutUsers: ScoutUser[] = [
  {
    id: "s0000001-0001-4000-8000-000000000001",
    email: "mike.chen@scout.demo",
    name: "Coach Mike Chen",
    organization: "Sun Devil State University",
    role: "head_coach",
    interested_positions: ["quarterback", "wide receiver"],
    geographic_focus: "Southwest",
    auth_user_id: "auth-scout-001",
  },
  {
    id: "s0000001-0001-4000-8000-000000000002",
    email: "recruiter@coppercanyon.edu",
    name: "Coach Williams",
    organization: "Copper Canyon University",
    role: "recruiter",
    interested_positions: ["running back", "linebacker"],
    geographic_focus: "Arizona",
    auth_user_id: null,
  },
  {
    id: "s0000001-0001-4000-8000-000000000003",
    email: "coach@desertstate.edu",
    name: "Coach Anderson",
    organization: "Desert State University",
    role: "assistant_coach",
    interested_positions: ["quarterback"],
    geographic_focus: "Southwest",
    auth_user_id: null,
  },
  {
    id: "s0000001-0001-4000-8000-000000000004",
    email: "scout@valleyu.edu",
    name: "Coach Rivera",
    organization: "Valley University",
    role: "recruiter",
    interested_positions: ["wide receiver", "defensive back"],
    geographic_focus: "Arizona",
    auth_user_id: null,
  },
  {
    id: "s0000001-0001-4000-8000-000000000005",
    email: "coach@grandcanyon.edu",
    name: "Coach Lee",
    organization: "Grand Canyon College",
    role: "head_coach",
    interested_positions: ["basketball"],
    geographic_focus: "Southwest",
    auth_user_id: null,
  },
  {
    id: "s0000001-0001-4000-8000-000000000006",
    email: "recruit@azstate.edu",
    name: "Coach Brown",
    organization: "Arizona State Prep",
    role: "recruiter",
    interested_positions: ["all"],
    geographic_focus: "National",
    auth_user_id: null,
  },
];

export const initialLeads: Lead[] = [
  {
    id: "lead-001",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    source: "website",
    first_name: "Michael",
    last_name: "Torres",
    email: "m.torres@email.demo",
    phone: "(602) 555-3001",
    athlete_name: "Lucas Torres",
    athlete_age: 15,
    interested_program_id: programs[1].id,
    interested_location_id: LOCATION_IDS.phoenix,
    notes: "Interested in combine prep",
    status: "contacted",
    assigned_coach_id: coaches[0].id,
  },
  {
    id: "lead-002",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    source: "referral",
    first_name: "Amanda",
    last_name: "Foster",
    email: "a.foster@email.demo",
    phone: "(480) 555-3002",
    athlete_name: "Sophie Foster",
    athlete_age: 13,
    interested_program_id: programs[0].id,
    interested_location_id: LOCATION_IDS.gilbert,
    notes: "",
    status: "scheduled",
    assigned_coach_id: coaches[2].id,
  },
  ...generateBackgroundLeads(),
];

function generateBackgroundLeads(): Lead[] {
  const firstNames = [
    "James", "Sarah", "David", "Emily", "Chris", "Lisa", "Ryan", "Nicole",
    "Kevin", "Maria", "Brian", "Jessica", "Daniel", "Ashley", "Mark",
  ];
  const lastNames = [
    "Wilson", "Martinez", "Anderson", "Thomas", "Jackson", "White",
    "Harris", "Martin", "Thompson", "Garcia", "Robinson", "Lewis",
  ];
  const sources = ["website", "referral", "walk-in", "social", "event"];
  const statuses: Lead["status"][] = [
    "new", "new", "contacted", "contacted", "scheduled", "converted", "lost",
  ];
  const locIds = Object.values(LOCATION_IDS);
  const leads: Lead[] = [];

  for (let i = 0; i < 198; i++) {
    const daysAgo = Math.floor((i * 90) / 198);
    const created = new Date(Date.now() - daysAgo * 86400000);
    created.setHours(8 + (i % 10), (i * 7) % 60, 0, 0);
    leads.push({
      id: `lead-gen-${String(i + 3).padStart(4, "0")}`,
      created_at: created.toISOString(),
      source: sources[i % sources.length],
      first_name: firstNames[i % firstNames.length],
      last_name: lastNames[i % lastNames.length],
      email: `lead${i + 3}@email.demo`,
      phone: `(480) 555-${String(4000 + i).slice(-4)}`,
      athlete_name: `${firstNames[(i + 3) % firstNames.length]} Jr.`,
      athlete_age: 10 + (i % 9),
      interested_program_id: programs[i % programs.length].id,
      interested_location_id: locIds[i % locIds.length],
      notes: i % 5 === 0 ? "Requested callback" : "",
      status: statuses[i % statuses.length],
      assigned_coach_id: i % 3 === 0 ? coaches[i % coaches.length].id : null,
    });
  }
  return leads;
}

export { messages } from "./messages-seed";

export const videoClips: VideoClip[] = [
  {
    id: "v-001",
    athlete_id: HERO_IDS.marcus,
    title: "Dropback & Throw",
    thumbnail_url: STOCK_THUMB,
    video_url: STOCK_VIDEO,
    ai_tags: ["hip mobility", "release speed", "footwork"],
    recorded_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: "v-002",
    athlete_id: HERO_IDS.marcus,
    title: "Vertical Jump Test",
    thumbnail_url: STOCK_THUMB,
    video_url: STOCK_VIDEO,
    ai_tags: ["explosive first step", "vertical power"],
    recorded_at: new Date(Date.now() - 45 * 86400000).toISOString(),
  },
  {
    id: "v-003",
    athlete_id: HERO_IDS.marcus,
    title: "Agility Drill",
    thumbnail_url: STOCK_THUMB,
    video_url: STOCK_VIDEO,
    ai_tags: ["lateral cut", "change of direction"],
    recorded_at: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    id: "v-004",
    athlete_id: HERO_IDS.marcus,
    title: "40-Yard Dash",
    thumbnail_url: STOCK_THUMB,
    video_url: STOCK_VIDEO,
    ai_tags: ["acceleration", "top-end speed"],
    recorded_at: new Date(Date.now() - 75 * 86400000).toISOString(),
  },
  {
    id: "v-005",
    athlete_id: HERO_IDS.deshawn,
    title: "Route Running",
    thumbnail_url: STOCK_THUMB,
    video_url: STOCK_VIDEO,
    ai_tags: ["route precision", "separation"],
    recorded_at: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
];

export const coachNotes: CoachNote[] = [
  {
    id: "n-001",
    athlete_id: HERO_IDS.marcus,
    coach_id: coaches[0].id,
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    content:
      "Marcus showing elite hip mobility in dropback drills. Release time down 0.15s.",
    tags: ["mobility", "quarterback", "improvement"],
  },
  {
    id: "n-002",
    athlete_id: HERO_IDS.marcus,
    coach_id: coaches[0].id,
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    content:
      "Flagged for recruiter showcase — vertical now at 36 inches. Top 5% in cohort.",
    tags: ["recruitment", "vertical"],
  },
  {
    id: "n-003",
    athlete_id: HERO_IDS.tyler,
    coach_id: COACH_RODRIGUEZ_ID,
    created_at: new Date(Date.now() - 21 * 86400000).toISOString(),
    content:
      "Tyler hit squat PR at 245 lbs. Lower body strength translating to court speed.",
    tags: ["strength", "PR"],
  },
];

export function generateWearables(athleteId: string): WearableData[] {
  const data: WearableData[] = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    data.push(
      {
        id: `w-${athleteId}-sleep-${i}`,
        athlete_id: athleteId,
        recorded_at: d.toISOString(),
        source: "whoop",
        metric: "sleep_hours",
        value: 6.5 + Math.random() * 2,
      },
      {
        id: `w-${athleteId}-hrv-${i}`,
        athlete_id: athleteId,
        recorded_at: d.toISOString(),
        source: "whoop",
        metric: "hrv",
        value: 45 + Math.random() * 30,
      },
      {
        id: `w-${athleteId}-strain-${i}`,
        athlete_id: athleteId,
        recorded_at: d.toISOString(),
        source: "whoop",
        metric: "strain",
        value: 8 + Math.random() * 8,
      },
      {
        id: `w-${athleteId}-recovery-${i}`,
        athlete_id: athleteId,
        recorded_at: d.toISOString(),
        source: "whoop",
        metric: "recovery_score",
        value: 50 + Math.random() * 45,
      }
    );
  }
  return data;
}

export const wearables: WearableData[] = [
  ...generateWearables(HERO_IDS.marcus),
  ...generateWearables(HERO_IDS.tyler),
  ...generateWearables(HERO_IDS.sofia),
  ...generateWearables(HERO_IDS.deshawn),
];

export const payments: Payment[] = athletes
  .filter((a) => a.status === "active")
  .slice(0, 20)
  .flatMap((a, i) => [
    {
      id: `pay-${a.id}-1`,
      athlete_id: a.id,
      amount: 349,
      status: i < 8 ? "failed" : "succeeded",
      processed_at: new Date().toISOString(),
      description: "Monthly membership",
    },
  ]);

function generateSessions(): Session[] {
  const base = new Date();
  base.setMinutes(0, 0, 0);

  const slots: {
    locationIndex: number;
    hour: number;
    programIndex: number;
    room: string;
    capacity: number;
  }[] = [
    // Phoenix — busy flagship, morning + late afternoon
    { locationIndex: 0, hour: 7, programIndex: 0, room: "Turf A", capacity: 24 },
    { locationIndex: 0, hour: 9, programIndex: 0, room: "Turf B", capacity: 20 },
    { locationIndex: 0, hour: 11, programIndex: 1, room: "Combine Lab", capacity: 16 },
    { locationIndex: 0, hour: 16, programIndex: 3, room: "Weight Room", capacity: 18 },
    // Mesa — mid-morning teams, afternoon recruit track
    { locationIndex: 1, hour: 8, programIndex: 0, room: "Court 1", capacity: 22 },
    { locationIndex: 1, hour: 10, programIndex: 4, room: "Turf A", capacity: 20 },
    { locationIndex: 1, hour: 14, programIndex: 1, room: "Turf B", capacity: 16 },
    { locationIndex: 1, hour: 17, programIndex: 2, room: "Film Room", capacity: 12 },
    // Gilbert — lighter morning, strong after-school block
    { locationIndex: 2, hour: 9, programIndex: 0, room: "Field 1", capacity: 20 },
    { locationIndex: 2, hour: 15, programIndex: 1, room: "Turf A", capacity: 18 },
    { locationIndex: 2, hour: 18, programIndex: 3, room: "Weight", capacity: 15 },
    // Scottsdale — premium recovery + combine windows
    { locationIndex: 3, hour: 7, programIndex: 3, room: "Recovery", capacity: 10 },
    { locationIndex: 3, hour: 11, programIndex: 2, room: "Turf A", capacity: 14 },
    { locationIndex: 3, hour: 13, programIndex: 1, room: "Combine Lab", capacity: 16 },
    { locationIndex: 3, hour: 16, programIndex: 4, room: "Court 1", capacity: 20 },
    // Chandler — late morning + lunch-hour team slot
    { locationIndex: 4, hour: 10, programIndex: 0, room: "Court 2", capacity: 22 },
    { locationIndex: 4, hour: 12, programIndex: 4, room: "Turf A", capacity: 24 },
    { locationIndex: 4, hour: 15, programIndex: 1, room: "Turf B", capacity: 16 },
  ];

  return slots.map((slot, i) => {
    const loc = locations[slot.locationIndex];
    const start = new Date(base);
    start.setHours(slot.hour, 0, 0, 0);
    const end = new Date(start);
    end.setHours(slot.hour + 1);
    return {
      id: `sess-${loc.slug}-${slot.hour}-${i}`,
      location_id: loc.id,
      coach_id: coaches[slot.locationIndex % coaches.length].id,
      program_id: programs[slot.programIndex].id,
      starts_at: start.toISOString(),
      ends_at: end.toISOString(),
      room: slot.room,
      capacity: slot.capacity,
    };
  });
}

export const sessions: Session[] = generateSessions();

export const attendance: Attendance[] = heroAthletes.flatMap((a) =>
  Array.from({ length: 12 }, (_, i) => ({
    id: `att-${a.id}-${i}`,
    athlete_id: a.id,
    session_id: sessions[i % sessions.length].id,
    checked_in_at: new Date(
      Date.now() - i * 3 * 86400000
    ).toISOString(),
    status: i < 2 && a.id === HERO_IDS.tyler ? "no_show" : "attended",
  }))
);

export const TYLER_REENGAGEMENT_MESSAGE =
  "Hi Jennifer — Coach Mike here. Tyler crushed a 245 squat PR 3 weeks ago & we've missed him this week. Let's get him back on the schedule — that momentum is worth protecting!";

export const publicAthletes = featuredAthletes.map(
  ({ id, first_name, last_name, sport, school, photo_url, story, slug, stats }) => ({
    id,
    first_name,
    last_name,
    sport,
    school,
    photo_url,
    story,
    slug,
    stats,
  })
);
