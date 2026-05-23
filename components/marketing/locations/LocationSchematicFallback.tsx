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
}: {
  schematic: LocationSchematic;
}) {
  return (
    <div className="flex h-full min-h-[320px] flex-col items-center justify-center bg-field p-6">
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
          return (
            <g key={zone.id}>
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                fill={zone.color}
                fillOpacity={0.85}
                stroke="#111111"
                strokeOpacity={0.25}
                strokeWidth="0.4"
                rx="0.8"
              />
              <text
                x={x + w / 2}
                y={y + h / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#f8f7f4"
                fontSize="3.2"
                fontWeight="700"
                style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}
              >
                {zone.label}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-4 text-center text-xs text-smoke">2D schematic preview — drag to explore in 3D when available</p>
    </div>
  );
}
