import {
  coaches,
  locations,
  programs,
  sessions,
} from "@/lib/demo/data";
import type { Coach, Location, Program, Session } from "@/lib/demo/types";
import {
  getMarketingCoachesForProgramAtLocation,
  type MarketingCoach,
} from "@/lib/marketing/coaches";

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export type ProgramAgeBatch = {
  label: string;
  ages: string;
  description: string;
};

export type ProgramMarketingDetail = {
  tagline: string;
  overview: string;
  highlights: string[];
  sessionLength: string;
  sessionsPerWeek: string;
  ageBatches: ProgramAgeBatch[];
  seatsTotal: number;
  seatsAvailable: number;
  averageParticipantAge: number;
  image: string;
};

export const programMarketingDetails: Record<string, ProgramMarketingDetail> = {
  "youth-performance": {
    tagline: "Build the foundation before the spotlight finds them.",
    overview:
      "Youth Performance is Legacy's entry track for developing athletes ages 10–14. Sessions blend speed mechanics, agility ladders, bodyweight strength, and sport-agnostic movement literacy — all measured and tracked in Legacy Command from day one. Coaches progress athletes through age-appropriate batches so no one is rushed into combine-style work before they're ready.",
    highlights: [
      "60-minute coached sessions with max 12 athletes per group",
      "Monthly movement screen and progress report for parents",
      "Sport-agnostic speed, agility, and coordination curriculum",
      "Legacy Command athlete profile from first session",
    ],
    sessionLength: "60 min",
    sessionsPerWeek: "2–3 recommended",
    ageBatches: [
      {
        label: "Foundation",
        ages: "10–11",
        description:
          "Coordination, deceleration, and introductory sprint mechanics.",
      },
      {
        label: "Development",
        ages: "12–13",
        description:
          "Introductory strength, change-of-direction, and sport crossover.",
      },
      {
        label: "Pre-Combine",
        ages: "14",
        description:
          "Bridge batch preparing athletes for HS Combine Prep measurables.",
      },
    ],
    seatsTotal: 108,
    seatsAvailable: 23,
    averageParticipantAge: 11.8,
    image:
      "https://images.pexels.com/photos/4672184/pexels-photo-4672184.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  "hs-combine-prep": {
    tagline: "Your numbers. On record. Every month.",
    overview:
      "HS Combine Prep is built for high school athletes who need verified measurables — 40-yard dash, vertical, broad jump, pro agility, and position-specific drills. Every session is 90 minutes on the combine lab turf with laser timing and force plates. Results sync to Legacy Command and your recruiter-facing profile automatically.",
    highlights: [
      "Laser-timed 40-yard and shuttle every 4 weeks",
      "Position-specific drill blocks with film review",
      "Monthly combine report card shared with families",
      "Scout-visible measurables when athlete opts in",
    ],
    sessionLength: "90 min",
    sessionsPerWeek: "2–3 recommended",
    ageBatches: [
      {
        label: "Freshman / Sophomore",
        ages: "14–15",
        description:
          "Baseline testing, technique refinement, and injury-prevention strength.",
      },
      {
        label: "Junior",
        ages: "16–17",
        description:
          "Peak combine prep with recruiter timeline planning and camp strategy.",
      },
      {
        label: "Senior",
        ages: "17–18",
        description:
          "Final-cycle measurables push and signing-day readiness.",
      },
    ],
    seatsTotal: 80,
    seatsAvailable: 11,
    averageParticipantAge: 16.2,
    image:
      "https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  "college-recruit-track": {
    tagline: "From local standout to national prospect.",
    overview:
      "College Recruit Track is Legacy's exposure program for athletes actively pursuing D1, D2, or NAIA recruitment. Beyond combine numbers, athletes get curated highlight reels, scout outreach support, academic eligibility check-ins, and direct access to Legacy's network of 40+ active college scouts through Legacy Command.",
    highlights: [
      "Recruiter-facing athlete dossier updated weekly",
      "Film breakdown sessions with position coaches",
      "Camp calendar planning and scout introduction requests",
      "Dedicated recruiting coordinator check-ins",
    ],
    sessionLength: "90 min",
    sessionsPerWeek: "3 recommended",
    ageBatches: [
      {
        label: "Early Exposure",
        ages: "15–16",
        description:
          "Profile building, baseline measurables, and introductory scout visibility.",
      },
      {
        label: "Active Recruit",
        ages: "16–17",
        description:
          "Weekly scout activity tracking, visit planning, and offer management.",
      },
      {
        label: "Commit Cycle",
        ages: "17–19",
        description:
          "Signing support, NIL readiness, and pre-college transition prep.",
      },
    ],
    seatsTotal: 48,
    seatsAvailable: 6,
    averageParticipantAge: 17.1,
    image:
      "https://images.pexels.com/photos/262524/pexels-photo-262524.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  "adult-performance": {
    tagline: "Pro-level programming without the pro roster.",
    overview:
      "Adult Performance delivers the same strength, power, and conditioning systems Legacy uses with college-bound athletes — scaled for working professionals, former athletes, and weekend competitors. Small-group sessions cap at 10 so every lifter gets coached reps, not just a printed workout.",
    highlights: [
      "Periodized strength and conditioning blocks",
      "Recovery room access at participating locations",
      "Wearable integration via Legacy Command",
      "Flexible drop-in and monthly membership options",
    ],
    sessionLength: "75 min",
    sessionsPerWeek: "3–4 recommended",
    ageBatches: [
      {
        label: "Return-to-Train",
        ages: "18–30",
        description:
          "Rebuild base strength and conditioning after time away from training.",
      },
      {
        label: "Competitive Adult",
        ages: "25–40",
        description:
          "Sport-specific power, speed maintenance, and recovery protocols.",
      },
      {
        label: "Legacy Masters",
        ages: "40+",
        description:
          "Joint-friendly progressions with mobility and durability emphasis.",
      },
    ],
    seatsTotal: 54,
    seatsAvailable: 18,
    averageParticipantAge: 31.4,
    image:
      "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  "team-training": {
    tagline: "Your whole roster. One development system.",
    overview:
      "Team Training gives club, travel, and high school programs a dedicated seasonal block inside Legacy facilities. Coaches get a shared team dashboard in Legacy Command, synchronized off-season conditioning, and pre-season combine testing for the entire roster — billed as a team package rather than individual memberships.",
    highlights: [
      "Custom seasonal periodization for your sport",
      "Full-roster combine testing days",
      "Team dashboard with attendance and measurables",
      "Dedicated team liaison coach assigned",
    ],
    sessionLength: "90 min",
    sessionsPerWeek: "2–4 per team block",
    ageBatches: [
      {
        label: "Middle School Teams",
        ages: "12–14",
        description:
          "Foundational team speed and strength with lower contact volume.",
      },
      {
        label: "JV / Varsity",
        ages: "14–18",
        description:
          "Off-season power development and in-season maintenance blocks.",
      },
      {
        label: "Club / Travel",
        ages: "12–18",
        description:
          "Tournament-calendar-aware conditioning with travel recovery protocols.",
      },
    ],
    seatsTotal: 36,
    seatsAvailable: 4,
    averageParticipantAge: 15.6,
    image:
      "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
};

export function formatSessionHour(hour: number) {
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:00 ${period}`;
}

export function formatSessionTime(session: Session) {
  return `${DAY_NAMES[session.day_of_week - 1]} ${formatSessionHour(session.hour)}`;
}

export function getProgramBySlug(slug: string): Program | undefined {
  return programs.find((program) => program.slug === slug);
}

export function getProgramMarketingDetail(slug: string): ProgramMarketingDetail {
  const detail = programMarketingDetails[slug];
  if (!detail) {
    throw new Error(`Missing marketing detail for program slug: ${slug}`);
  }
  return detail;
}

export function getSessionsForProgram(programId: string): Session[] {
  return sessions
    .filter((session) => session.program_id === programId)
    .sort((a, b) => a.day_of_week - b.day_of_week || a.hour - b.hour);
}

export function getCoachesForProgram(programId: string): Coach[] {
  const coachIds = new Set(
    getSessionsForProgram(programId).map((session) => session.coach_id)
  );

  return coaches.filter((coach) => coachIds.has(coach.id));
}

export type ProgramLocationOffering = {
  location: Location;
  schedule: string[];
};

export function getLocationOfferingsForProgram(
  programId: string
): ProgramLocationOffering[] {
  const programSessions = getSessionsForProgram(programId);
  const byLocation = new Map<string, Session[]>();

  for (const session of programSessions) {
    const existing = byLocation.get(session.location_id) ?? [];
    existing.push(session);
    byLocation.set(session.location_id, existing);
  }

  return locations
    .filter((location) => byLocation.has(location.id))
    .map((location) => ({
      location,
      schedule: (byLocation.get(location.id) ?? []).map(formatSessionTime),
    }));
}

export type LocationProgramOffering = {
  program: Program;
  schedule: string[];
  coaches: MarketingCoach[];
};

export function getProgramsForLocation(locationId: string): LocationProgramOffering[] {
  const location = locations.find((entry) => entry.id === locationId);
  if (!location) {
    return [];
  }

  const locationSessions = sessions.filter(
    (session) => session.location_id === locationId
  );
  const byProgram = new Map<string, Session[]>();

  for (const session of locationSessions) {
    const existing = byProgram.get(session.program_id) ?? [];
    existing.push(session);
    byProgram.set(session.program_id, existing);
  }

  return programs
    .filter((program) => byProgram.has(program.id))
    .map((program) => {
      const programSessions = (byProgram.get(program.id) ?? []).sort(
        (a, b) => a.day_of_week - b.day_of_week || a.hour - b.hour
      );

      return {
        program,
        schedule: programSessions.map(formatSessionTime),
        coaches: getMarketingCoachesForProgramAtLocation(program.slug, location.slug),
      };
    });
}
