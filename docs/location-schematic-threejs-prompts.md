# Location schematic — Three.js production prompts

This document describes how to replace the **procedural placeholder** schematics on each `/locations/[slug]` page with production-quality 3D facility models.

The live placeholder is built with `@react-three/fiber` and zone data in `lib/marketing/location-schematics.ts`.

---

## Global art direction

| Token | Hex | Usage |
|-------|-----|--------|
| Field | `#f8f7f4` | Canvas / floor background |
| Chalk | `#f0eee9` | Roof, lobby volumes |
| Bone | `#e5e2db` | Grid lines, borders |
| Pitch | `#111111` | Edge outlines, labels |
| Orange | `#ff5a1f` | Turf sideline accents, lab emissive |
| Slate | `#4a4744` | Label text |

**Camera:** isometric cutaway — `PerspectiveCamera(42°)` at `[48, 38, 48]`, target turf centroid, `OrbitControls` with pan disabled.

**Geometry style:** low-poly architectural massing — boxes for zones, optional extruded door/window cuts, 15% opacity roof shell, no photoreal equipment clutter in v1.

---

## Per-location briefs

### Suwanee (flagship — 15,000 sq ft)

**Layout narrative:** Rectangular industrial bay. Front lobby + check-in spans the entry. Central **70-yard turf spine** dominates the floor plate. West wing: open rack **weight room** with rubber flooring. East wing: **recovery suite** (tables, normatec stations as abstract pods). Rear-east: **combine lab** with timing gates as orange emissive frames.

**Three.js prompt seed:**
```
Suwanee flagship Legacy Sports Complex cutaway: 15,000 sq ft rectangular shell, 14 ft ceiling, steel truss roof at 15% opacity. Central green turf runway (28x18 units), bone lobby at front, dark weight floor west, gray recovery east, orange-accent combine lab rear-east. Legacy palette, edge outlines, zone labels, isometric camera.
```

**Zone checklist:** Lobby · Turf Field · Weight Room · Recovery · Combine Lab

---

### Lawrenceville (12,000 sq ft)

**Layout narrative:** L-shaped floor plan. Turf center spine. **Film room** in rear corner (dark enclosed volume). Weight floor front-left with high traffic from lobby.

**Three.js prompt seed:**
```
Lawrenceville Legacy location cutaway: 12,000 sq ft L-plan, turf center, film room as dark enclosed rear corner block, weight room front-left, compact lobby entry. Minimal props, readable zone colors, orange accent on film room door frame only.
```

**Zone checklist:** Lobby · Turf Field · Weight Room · Film Room

---

### Hoschton (11,000 sq ft)

**Layout narrative:** Narrow bay — linear turf runway. Weight racks along west wall. Recovery nook on east side. Single continuous athlete circulation loop.

**Three.js prompt seed:**
```
Hoschton Legacy narrow-bay schematic: 11,000 sq ft, linear turf runway, weight racks west wall, recovery east nook, low lobby at front. Emphasize length over width; keep roof open for cutaway readability.
```

**Zone checklist:** Lobby · Turf Field · Weight Room · Recovery

---

### Canton (13,000 sq ft)

**Layout narrative:** Wide bay with **sports science / testing** rear-right. Turf center-left. Expanded strength zone front-left.

**Three.js prompt seed:**
```
Canton Legacy facility cutaway: 13,000 sq ft wide bay, turf center-left, sports science testing lab rear-right with orange emissive sensor frames, weight floor front-left, lobby entry. Slightly taller ceiling (13 ft) for testing rig clearance — show as taller rear zone.
```

**Zone checklist:** Lobby · Turf Field · Weight Room · Sports Science

---

### Alpharetta (12,500 sq ft)

**Layout narrative:** Premium suburban shell — mirrors flagship zones at tighter footprint. Turf spine, recovery suite, pro weight floor, minimal lobby.

**Three.js prompt seed:**
```
Alpharetta Legacy north Fulton cutaway: 12,500 sq ft, turf spine, recovery suite, pro weight floor, minimal front lobby. Clean suburban industrial aesthetic, Legacy orange turf sideline LEDs, bone and field palette.
```

**Zone checklist:** Lobby · Turf Field · Weight Room · Recovery

---

## Implementation workflow

### 1. Block out in code (current placeholder)

Zone positions live in `lib/marketing/location-schematics.ts`. Adjust `x`, `z`, `width`, `depth`, `height` until the 2D fallback SVG matches your intended floor plan.

### 2. Replace with GLB (recommended for production)

1. Model in Blender using zone dimensions as meters/feet.
2. Export **glTF/GLB** with Draco compression optional.
3. Place assets at `public/schematics/{slug}.glb`.
4. Load in `LocationSchematicScene.tsx`:

```tsx
import { useGLTF } from "@react-three/drei";

function ProductionFacility({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}
```

5. Swap procedural `FacilityModel` when `url` exists:

```tsx
const assetUrl = `/schematics/${schematic.slug}.glb`;
// if file exists → ProductionFacility, else → FacilityModel
```

### 3. Programmatic Three.js (no DCC tool)

Use the per-location prompt seeds in this document. Core scene graph:

```tsx
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color("#f8f7f4");

const camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 200);
camera.position.set(48, 38, 48);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;

const root = new THREE.Group();

zones.forEach((zone) => {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(zone.width, zone.height, zone.depth),
    new THREE.MeshStandardMaterial({ color: zone.color })
  );
  mesh.position.set(zone.x, zone.height / 2, zone.z);
  mesh.castShadow = true;
  root.add(mesh);

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(mesh.geometry),
    new THREE.LineBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.35 })
  );
  mesh.add(edges);
});

scene.add(root);
```

### 4. AI 3D generation prompts

Append to any location seed:

> Output: low-poly architectural cutaway, no people, no logos, game-ready topology under 50k tris, PBR materials with flat color zones matching Legacy Sports palette, orthographic-friendly silhouette, export as GLB.

---

## QA checklist before shipping production assets

- [ ] All amenity zones from `location.amenities` are visually represented
- [ ] Labels readable at 375px viewport width
- [ ] OrbitControls feel smooth on mobile (touch-action: none on canvas)
- [ ] `prefers-reduced-motion: reduce` falls back to 2D SVG (`LocationSchematicFallback`)
- [ ] Draw calls &lt; 40 on mid-tier mobile
- [ ] GLB total size &lt; 2 MB per location

---

## File reference

| File | Purpose |
|------|---------|
| `lib/marketing/location-schematics.ts` | Zone data per location |
| `components/marketing/locations/LocationSchematic.tsx` | Canvas wrapper, reduced-motion fallback |
| `components/marketing/locations/LocationSchematicScene.tsx` | R3F procedural placeholder |
| `components/marketing/locations/LocationSchematicFallback.tsx` | 2D SVG floor plan |
| `app/(marketing)/locations/[slug]/page.tsx` | Layout: schematic center, details around |
