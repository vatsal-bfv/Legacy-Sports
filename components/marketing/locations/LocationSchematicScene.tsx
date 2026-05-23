"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, Html, OrbitControls } from "@react-three/drei";
import type { Group } from "three";
import type { LocationSchematic, SchematicZone } from "@/lib/marketing/location-schematics";

function ZoneBlock({ zone }: { zone: SchematicZone }) {
  const emissive = zone.accent ?? "#000000";
  const emissiveIntensity = zone.accent ? 0.18 : 0;

  return (
    <group position={[zone.x, zone.height / 2, zone.z]}>
      <mesh>
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
        <Edges color="#111111" threshold={15} opacity={0.35} transparent />
      </mesh>
      <Html
        center
        position={[0, zone.height / 2 + 1.2, 0]}
        distanceFactor={28}
        style={{ pointerEvents: "none" }}
      >
        <span className="whitespace-nowrap rounded bg-pitch/85 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-field">
          {zone.label}
        </span>
      </Html>
    </group>
  );
}

function FacilityModel({
  schematic,
  autoRotate,
}: {
  schematic: LocationSchematic;
  autoRotate: boolean;
}) {
  const rootRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!autoRotate || !rootRef.current) {
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
        <ZoneBlock key={zone.id} zone={zone} />
      ))}
    </group>
  );
}

export function LocationSchematicScene({
  schematic,
  autoRotate = true,
}: {
  schematic: LocationSchematic;
  autoRotate?: boolean;
}) {
  const cameraPosition = useMemo<[number, number, number]>(() => [42, 34, 42], []);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 42, position: cameraPosition, near: 0.1, far: 200 }}
      gl={{ antialias: true, alpha: true }}
      className="h-full w-full touch-none"
    >
      <color attach="background" args={["#f8f7f4"]} />
      <ambientLight intensity={0.55} />
      <directionalLight intensity={1.05} position={[20, 30, 10]} />
      <directionalLight intensity={0.35} position={[-15, 12, -8]} />
      <FacilityModel schematic={schematic} autoRotate={autoRotate} />
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
