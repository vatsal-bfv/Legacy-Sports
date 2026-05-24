export type SchematicZone = {
  id: string;
  label: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  color: string;
  accent?: string;
  imageUrl: string;
  description: string;
};

export type LocationSchematic = {
  slug: string;
  name: string;
  footprintWidth: number;
  footprintDepth: number;
  ceilingHeight: number;
  zones: SchematicZone[];
  /** Short note shown under the schematic */
  caption: string;
  /** One-line prompt seed for asset pipelines */
  promptSeed: string;
};

const ZONE_COLORS = {
  turf: "#3d5c45",
  weight: "#2a2d38",
  recovery: "#4a5568",
  lab: "#ff5a1f",
  lobby: "#e5e2db",
  film: "#1c1f27",
  science: "#6b4c3b",
} as const;

const ZONE_MEDIA: Record<
  string,
  Pick<SchematicZone, "imageUrl" | "description">
> = {
  lobby: {
    imageUrl:
      "https://images.pexels.com/photos/4672184/pexels-photo-4672184.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Check-in, parent lounge, and athlete welcome area.",
  },
  turf: {
    imageUrl:
      "https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Full-speed turf runway for sprint work, agility, and position drills.",
  },
  weight: {
    imageUrl:
      "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Racks, platforms, and sport-specific strength stations.",
  },
  recovery: {
    imageUrl:
      "https://images.pexels.com/photos/6636339/pexels-photo-6636339.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Normatec, mobility tools, and active recovery protocols.",
  },
  combine: {
    imageUrl:
      "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Laser timing, vertical testing, and combine-style measurables.",
  },
  film: {
    imageUrl:
      "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Breakdown sessions, playbook installs, and recruiting review.",
  },
  science: {
    imageUrl:
      "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Force plates, biomechanics capture, and performance diagnostics.",
  },
};

function zone(
  id: string,
  label: string,
  layout: Omit<SchematicZone, "id" | "label" | "imageUrl" | "description">
): SchematicZone {
  const media = ZONE_MEDIA[id] ?? ZONE_MEDIA.turf;
  return { id, label, ...layout, ...media };
}

export const locationSchematics: LocationSchematic[] = [
  {
    slug: "suwanee",
    name: "Suwanee",
    footprintWidth: 42,
    footprintDepth: 36,
    ceilingHeight: 14,
    caption: "Flagship layout — full turf, combine lab, recovery suite, and pro-grade weight floor.",
    promptSeed:
      "Suwanee flagship: 15,000 sq ft rectangular industrial shell, central 70-yard turf spine, flanking weight + recovery pods, front lobby and check-in.",
    zones: [
      zone("lobby", "Lobby", { x: 0, z: 15, width: 14, depth: 6, height: 12, color: ZONE_COLORS.lobby }),
      zone("turf", "Turf Field", { x: 0, z: -2, width: 28, depth: 18, height: 10, color: ZONE_COLORS.turf, accent: "#ff5a1f" }),
      zone("weight", "Weight Room", { x: -14, z: 4, width: 12, depth: 14, height: 11, color: ZONE_COLORS.weight }),
      zone("recovery", "Recovery", { x: 14, z: 4, width: 10, depth: 12, height: 9, color: ZONE_COLORS.recovery }),
      zone("combine", "Combine Lab", { x: 14, z: -12, width: 10, depth: 10, height: 9, color: ZONE_COLORS.lab }),
    ],
  },
  {
    slug: "lawrenceville",
    name: "Lawrenceville",
    footprintWidth: 38,
    footprintDepth: 32,
    ceilingHeight: 13,
    caption: "Compact east-metro layout with turf spine, film room, and high-traffic weight floor.",
    promptSeed:
      "Lawrenceville: 12,000 sq ft L-shaped floor plan, turf center, film room rear corner, open rack weight area front-left.",
    zones: [
      zone("lobby", "Lobby", { x: -12, z: 13, width: 10, depth: 5, height: 11, color: ZONE_COLORS.lobby }),
      zone("turf", "Turf Field", { x: 2, z: -1, width: 24, depth: 16, height: 10, color: ZONE_COLORS.turf }),
      zone("weight", "Weight Room", { x: -13, z: 2, width: 11, depth: 13, height: 11, color: ZONE_COLORS.weight }),
      zone("film", "Film Room", { x: 13, z: -10, width: 9, depth: 8, height: 8, color: ZONE_COLORS.film }),
    ],
  },
  {
    slug: "hoschton",
    name: "Hoschton",
    footprintWidth: 34,
    footprintDepth: 30,
    ceilingHeight: 12,
    caption: "Efficient north-Georgia footprint — turf, racks, and recovery in a single continuous loop.",
    promptSeed:
      "Hoschton: 11,000 sq ft narrow bay, linear turf runway, weight racks along west wall, recovery nook east side.",
    zones: [
      zone("lobby", "Lobby", { x: 0, z: 12, width: 12, depth: 5, height: 10, color: ZONE_COLORS.lobby }),
      zone("turf", "Turf Field", { x: 0, z: -2, width: 22, depth: 14, height: 9, color: ZONE_COLORS.turf }),
      zone("weight", "Weight Room", { x: -11, z: 0, width: 9, depth: 12, height: 10, color: ZONE_COLORS.weight }),
      zone("recovery", "Recovery", { x: 11, z: 2, width: 8, depth: 10, height: 8, color: ZONE_COLORS.recovery }),
    ],
  },
  {
    slug: "canton",
    name: "Canton",
    footprintWidth: 40,
    footprintDepth: 33,
    ceilingHeight: 13,
    caption: "Sports-science forward layout with testing bay, turf, and expanded strength zone.",
    promptSeed:
      "Canton: 13,000 sq ft wide bay, turf center-left, sports science + testing lab rear-right, weight floor front.",
    zones: [
      zone("lobby", "Lobby", { x: -10, z: 14, width: 12, depth: 5, height: 11, color: ZONE_COLORS.lobby }),
      zone("turf", "Turf Field", { x: -2, z: -2, width: 26, depth: 16, height: 10, color: ZONE_COLORS.turf }),
      zone("weight", "Weight Room", { x: -14, z: 4, width: 11, depth: 13, height: 11, color: ZONE_COLORS.weight }),
      zone("science", "Sports Science", { x: 14, z: -8, width: 10, depth: 10, height: 9, color: ZONE_COLORS.science, accent: "#ff5a1f" }),
    ],
  },
  {
    slug: "alpharetta",
    name: "Alpharetta",
    footprintWidth: 38,
    footprintDepth: 32,
    ceilingHeight: 13,
    caption: "North Fulton layout mirroring flagship zones at a slightly tighter footprint.",
    promptSeed:
      "Alpharetta: 12,500 sq ft premium suburban shell, turf spine, recovery suite, pro weight floor, minimal lobby.",
    zones: [
      zone("lobby", "Lobby", { x: 0, z: 13, width: 11, depth: 5, height: 11, color: ZONE_COLORS.lobby }),
      zone("turf", "Turf Field", { x: 0, z: -1, width: 24, depth: 15, height: 10, color: ZONE_COLORS.turf }),
      zone("weight", "Weight Room", { x: -13, z: 3, width: 11, depth: 12, height: 11, color: ZONE_COLORS.weight }),
      zone("recovery", "Recovery", { x: 13, z: -6, width: 9, depth: 10, height: 8, color: ZONE_COLORS.recovery }),
    ],
  },
];

export function getLocationSchematic(slug: string): LocationSchematic | undefined {
  return locationSchematics.find((entry) => entry.slug === slug);
}
