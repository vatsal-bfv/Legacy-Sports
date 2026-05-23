"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const HOLOGRAM_MODEL = "/models/human-body.glb";
const HOLOGRAM_ACCENT = "#ff5a1f";

function applyHologramMaterial(root: THREE.Object3D, accent: string) {
  root.traverse((node) => {
    if (!(node instanceof THREE.Mesh)) {
      return;
    }

    node.material = new THREE.MeshPhysicalMaterial({
      color: accent,
      emissive: accent,
      emissiveIntensity: 0.28,
      transparent: true,
      opacity: 0.88,
      metalness: 0.35,
      roughness: 0.4,
      clearcoat: 0.25,
    });
  });
}

function HumanBodyHologram({ autoRotate }: { autoRotate: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(HOLOGRAM_MODEL);
  const model = useMemo(() => scene.clone(true), [scene]);

  useLayoutEffect(() => {
    applyHologramMaterial(model, HOLOGRAM_ACCENT);
  }, [model]);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={model} scale={2.45} />
      </Center>
    </group>
  );
}

function HologramPlatform() {
  const outerRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (outerRef.current) {
      outerRef.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <group position={[0, -1.05, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.2, 64]} />
        <meshBasicMaterial color={HOLOGRAM_ACCENT} transparent opacity={0.06} />
      </mesh>
      <mesh ref={outerRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.55, 1.95, 64]} />
        <meshBasicMaterial color={HOLOGRAM_ACCENT} transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

export function AthleteHologramScene({ autoRotate = true }: { autoRotate?: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 40, position: [0, 1.1, 4.35], near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true }}
      className="h-full w-full touch-none"
    >
      <ambientLight intensity={0.75} />
      <directionalLight intensity={0.9} position={[3, 6, 4]} color="#fff7f0" />
      <pointLight intensity={0.55} position={[-3, 2, 2]} color={HOLOGRAM_ACCENT} />
      <HologramPlatform />
      <HumanBodyHologram autoRotate={autoRotate} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 0.85, 0]}
      />
    </Canvas>
  );
}

useGLTF.preload(HOLOGRAM_MODEL);
