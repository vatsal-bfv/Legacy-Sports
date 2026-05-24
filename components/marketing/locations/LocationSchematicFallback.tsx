import type { LocationSchematic } from "@/lib/marketing/location-schematics";

const PADDING = 4;
const VIEW_WIDTH = 100;
const VIEW_HEIGHT = 88;

function toSvgRect(zone: LocationSchematic["zones"][number], schematic: LocationSchematic) {
  const scaleX = (VIEW_WIDTH - PADDING * 2) / schematic.footprintWidth;
  const scaleZ = (VIEW_HEIGHT - PADDING * 2) / schematic.footprintDepth;

  const w = zone.width * scaleX;
  const h = zone.depth * scaleZ;
  const x = PADDING + (zone.x - zone.width / 2 + schematic.footprintWidth / 2) * scaleX;
  const y = PADDING + (zone.z - zone.depth / 2 + schematic.footprintDepth / 2) * scaleZ;

  return { x, y, w, h };
}

export function LocationSchematicFallback({
  schematic,
  selectedZoneId = null,
  onZoneSelect,
  onZoneHover,
}: {
  schematic: LocationSchematic;
  selectedZoneId?: string | null;
  onZoneSelect?: (zoneId: string) => void;
  onZoneHover?: (zoneId: string | null) => void;
}) {
  return (
    <div className="flex h-full min-h-[320px] flex-col items-center justify-center bg-field/40 p-6">
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        className="h-full w-full max-h-[420px] max-w-[640px]"
        role="img"
        aria-label={`${schematic.name} facility floor plan schematic`}
      >
        <rect
          x={PADDING}
          y={PADDING}
          width={VIEW_WIDTH - PADDING * 2}
          height={VIEW_HEIGHT - PADDING * 2}
          fill="#f0eee9"
          stroke="#e5e2db"
          strokeWidth="0.6"
          rx="1.5"
        />
        {schematic.zones.map((zone) => {
          const { x, y, w, h } = toSvgRect(zone, schematic);
          const isSelected = selectedZoneId === zone.id;

          return (
            <g key={zone.id}>
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                fill={zone.color}
                fillOpacity={isSelected ? 1 : 0.85}
                stroke={isSelected ? "#ff5a1f" : "#111111"}
                strokeOpacity={isSelected ? 1 : 0.25}
                strokeWidth={isSelected ? "0.8" : "0.4"}
                rx="0.8"
                className={onZoneSelect ? "cursor-pointer" : undefined}
                onClick={() => onZoneSelect?.(zone.id)}
                onMouseEnter={() => onZoneHover?.(zone.id)}
                onMouseLeave={() => onZoneHover?.(null)}
              />
              <text
                x={x + w / 2}
                y={y + h / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#f8f7f4"
                fontSize="3.2"
                fontWeight="700"
                style={{ pointerEvents: "none", textTransform: "uppercase", letterSpacing: "0.08em" }}
              >
                {zone.label}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-4 text-center text-xs text-smoke">
        2D schematic preview — tap a room to explore
      </p>
    </div>
  );
}
