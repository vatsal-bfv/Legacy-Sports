"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Edges, Html, OrbitControls } from "@react-three/drei";
import type { Group } from "three";
import type { LocationSchematic, SchematicZone } from "@/lib/marketing/location-schematics";

function ZoneBlock({
  zone,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: {
  zone: SchematicZone;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (zoneId: string) => void;
  onHover: (zoneId: string | null) => void;
}) {
  const emissive = zone.accent ?? (isSelected || isHovered ? "#ff5a1f" : "#000000");
  const emissiveIntensity =
    isSelected ? 0.42 : isHovered ? 0.28 : zone.accent ? 0.18 : 0;

  return (
    <group position={[zone.x, zone.height / 2, zone.z]}>
      <mesh
        onClick={(event: ThreeEvent<MouseEvent>) => {
          event.stopPropagation();
          onSelect(zone.id);
        }}
        onPointerOver={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();
          onHover(zone.id);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();
          onHover(null);
          document.body.style.cursor = "auto";
        }}
      >
        <boxGeometry args={[zone.width, zone.height, zone.depth]} />
        <meshStandardMaterial
          color={zone.color}
          metalness={zone.id === "weight" ? 0.35 : 0.12}
          roughness={zone.id === "turf" ? 0.85 : 0.55}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          transparent={zone.id === "lobby"}
          opacity={zone.id === "lobby" ? 0.92 : 1}
        />
        <Edges
          color={isSelected || isHovered ? "#ff5a1f" : "#111111"}
          threshold={15}
          opacity={isSelected || isHovered ? 0.85 : 0.35}
          transparent
        />
      </mesh>
      <Html
        center
        position={[0, zone.height / 2 + 1.2, 0]}
        distanceFactor={28}
        style={{ pointerEvents: "none" }}
      >
        <span
          className={`whitespace-nowrap rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] ${
            isSelected || isHovered
              ? "bg-orange text-field"
              : "bg-pitch/85 text-field"
          }`}
        >
          {zone.label}
        </span>
      </Html>
    </group>
  );
}

function FacilityModel({
  schematic,
  autoRotate,
  selectedZoneId,
  hoveredZoneId,
  onZoneSelect,
  onZoneHover,
}: {
  schematic: LocationSchematic;
  autoRotate: boolean;
  selectedZoneId: string | null;
  hoveredZoneId: string | null;
  onZoneSelect: (zoneId: string) => void;
  onZoneHover: (zoneId: string | null) => void;
}) {
  const rootRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!autoRotate || !rootRef.current || selectedZoneId) {
      return;
    }
    rootRef.current.rotation.y += delta * 0.08;
  });

  return (
    <group ref={rootRef}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[schematic.footprintWidth + 6, schematic.footprintDepth + 6]} />
        <meshStandardMaterial color="#f8f7f4" roughness={0.95} metalness={0} />
      </mesh>
      {schematic.zones.map((zone) => (
        <ZoneBlock
          key={zone.id}
          zone={zone}
          isSelected={selectedZoneId === zone.id}
          isHovered={hoveredZoneId === zone.id}
          onSelect={onZoneSelect}
          onHover={onZoneHover}
        />
      ))}
    </group>
  );
}

export function LocationSchematicScene({
  schematic,
  autoRotate = true,
  immersive = false,
  selectedZoneId = null,
  hoveredZoneId = null,
  onZoneSelect,
  onZoneHover,
}: {
  schematic: LocationSchematic;
  autoRotate?: boolean;
  immersive?: boolean;
  selectedZoneId?: string | null;
  hoveredZoneId?: string | null;
  onZoneSelect?: (zoneId: string) => void;
  onZoneHover?: (zoneId: string | null) => void;
}) {
  const cameraPosition = useMemo<[number, number, number]>(() => [42, 34, 42], []);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 42, position: cameraPosition, near: 0.1, far: 200 }}
      gl={{ antialias: true, alpha: immersive }}
      className="h-full w-full touch-none"
    >
      {!immersive ? <color attach="background" args={["#f8f7f4"]} /> : null}
      <ambientLight intensity={0.55} />
      <directionalLight intensity={1.05} position={[20, 30, 10]} />
      <directionalLight intensity={0.35} position={[-15, 12, -8]} />
      <FacilityModel
        schematic={schematic}
        autoRotate={autoRotate}
        selectedZoneId={selectedZoneId}
        hoveredZoneId={hoveredZoneId}
        onZoneSelect={onZoneSelect ?? (() => undefined)}
        onZoneHover={onZoneHover ?? (() => undefined)}
      />
      <OrbitControls
        enablePan={false}
        minDistance={32}
        maxDistance={88}
        maxPolarAngle={Math.PI / 2.15}
        target={[0, 4, 0]}
      />
    </Canvas>
  );
}
