export const LANDING_SECTIONS = {
  about: "/#about",
  locations: "/#locations",
  programs: "/#programs",
  coaches: "/#coaches",
  athletes: "/#athletes",
  testimonials: "/#testimonials",
  command: "/#command",
  intake: "/#intake",
} as const;

export type LandingSectionHref = (typeof LANDING_SECTIONS)[keyof typeof LANDING_SECTIONS];
