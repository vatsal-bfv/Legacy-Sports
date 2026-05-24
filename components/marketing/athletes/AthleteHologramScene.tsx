"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { AthleteGender } from "@/lib/marketing/featured-athletes";

const HOLOGRAM_MODEL = "/models/human-body.glb";
const HOLOGRAM_SCALE = 2.45;
const HOLOGRAM_SCALE_IMMERSIVE = 3.55;

const HOLOGRAM_ACCENT: Record<AthleteGender, string> = {
  male: "#ff5a1f",
  female: "#6eb5ff",
};

function applyHologramMaterial(root: THREE.Object3D, accent: string) {
  const hologramMaterial = new THREE.MeshPhysicalMaterial({
    color: accent,
    emissive: accent,
    emissiveIntensity: 0.28,
    transparent: true,
    opacity: 0.88,
    metalness: 0.35,
    roughness: 0.4,
    clearcoat: 0.25,
    side: THREE.DoubleSide,
  });

  root.traverse((node) => {
    if (!(node instanceof THREE.Mesh)) {
      return;
    }

    node.material = hologramMaterial;
    node.frustumCulled = false;
  });
}

function HumanBodyHologram({
  autoRotate,
  gender,
  immersive = false,
}: {
  autoRotate: boolean;
  gender: AthleteGender;
  immersive?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const accent = HOLOGRAM_ACCENT[gender];
  const { scene } = useGLTF(HOLOGRAM_MODEL);
  const model = useMemo(() => scene.clone(true), [scene]);

  useLayoutEffect(() => {
    applyHologramMaterial(model, accent);
  }, [model, accent]);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group ref={groupRef} position={immersive ? [0, -1.05, 0] : [0, 0, 0]}>
      <Center>
        <primitive
          object={model}
          scale={immersive ? HOLOGRAM_SCALE_IMMERSIVE : HOLOGRAM_SCALE}
        />
      </Center>
    </group>
  );
}

export function AthleteHologramScene({
  autoRotate = true,
  gender = "male",
  immersive = false,
}: {
  autoRotate?: boolean;
  gender?: AthleteGender;
  immersive?: boolean;
}) {
  const accent = HOLOGRAM_ACCENT[gender];
  const cameraPosition = useMemo<[number, number, number]>(
    () => (immersive ? [0, 0.25, 3.05] : [0, 1.1, 4.35]),
    [immersive]
  );

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{
        fov: immersive ? 36 : 40,
        position: cameraPosition,
        near: 0.1,
        far: 100,
      }}
      gl={{ antialias: true, alpha: true }}
      className="h-full w-full touch-none"
    >
      <ambientLight intensity={0.75} />
      <directionalLight intensity={0.9} position={[3, 6, 4]} color="#fff7f0" />
      <pointLight intensity={0.55} position={[-3, 2, 2]} color={accent} />
      <HumanBodyHologram
        autoRotate={autoRotate}
        gender={gender}
        immersive={immersive}
      />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, immersive ? 0.28 : 0.85, 0]}
      />
    </Canvas>
  );
}

useGLTF.preload(HOLOGRAM_MODEL);
