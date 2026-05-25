export const DEMO_PASSWORD = "LegacyDemo2026!";
export const STAFF_EMAIL = "amber@legacy.demo";
export const SCOUT_EMAIL = "mike.chen@scout.demo";

export const HERO_IDS = {
  marcus: "a0000001-0001-4000-8000-000000000001",
  tyler: "a0000001-0001-4000-8000-000000000002",
  sofia: "a0000001-0001-4000-8000-000000000003",
  deshawn: "a0000001-0001-4000-8000-000000000004",
  emma: "a0000001-0001-4000-8000-000000000005",
} as const;

export const COACH_RODRIGUEZ_ID = "c0000001-0001-4000-8000-000000000002";

/** Georgia facility ids (legacy constant keys retained for stable references). */
export const LOCATION_IDS = {
  /** Suwanee flagship */
  phoenix: "l0000001-0001-4000-8000-000000000001",
  /** Lawrenceville */
  mesa: "l0000001-0001-4000-8000-000000000002",
  /** Hoschton */
  gilbert: "l0000001-0001-4000-8000-000000000003",
  /** Canton */
  scottsdale: "l0000001-0001-4000-8000-000000000004",
  /** Alpharetta */
  chandler: "l0000001-0001-4000-8000-000000000005",
} as const;

export const LOCATION_SLUGS = {
  suwanee: LOCATION_IDS.phoenix,
  lawrenceville: LOCATION_IDS.mesa,
  hoschton: LOCATION_IDS.gilbert,
  canton: LOCATION_IDS.scottsdale,
  alpharetta: LOCATION_IDS.chandler,
} as const;
