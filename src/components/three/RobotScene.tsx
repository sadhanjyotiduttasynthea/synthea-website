"use client";

/*
 * React Three Fiber renders imperatively: Three.js objects (materials,
 * geometries, joint groups) are created once and then mutated inside the
 * useFrame render loop, outside React's render phase. This is the documented
 * R3F pattern, so the React Compiler immutability rule is disabled here.
 */
/* eslint-disable react-hooks/immutability */

import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";

export type VisualizationMode = "real" | "cad" | "analysis";

export type RobotSceneProps = {
  mode: VisualizationMode;
  /** Enable drag-to-rotate and pointer reaction (desktop) */
  interactive?: boolean;
  /** "high" for desktop, "low" for phones / weak GPUs */
  quality?: "high" | "low";
  /** Freeze idle animation (prefers-reduced-motion) */
  still?: boolean;
  /** Pause rendering entirely (off-screen) */
  paused?: boolean;
  /** Keep the drawing buffer (only needed for screenshots) */
  preserveDrawingBuffer?: boolean;
  onReady?: () => void;
};

/* ------------------------------------------------------------------------ */
/* Materials — shared and cross-faded between visualization modes            */
/* ------------------------------------------------------------------------ */

type Materials = ReturnType<typeof createMaterials>;

function createMaterials() {
  const solid = (params: THREE.MeshPhysicalMaterialParameters) =>
    new THREE.MeshPhysicalMaterial({ transparent: true, ...params });
  return {
    shell: solid({ color: "#eef0f2", metalness: 0.25, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.18 }),
    dark: solid({ color: "#2b2e34", metalness: 0.85, roughness: 0.38 }),
    machined: solid({ color: "#b9c0ca", metalness: 1, roughness: 0.2 }),
    accent: solid({ color: "#d71932", metalness: 0.35, roughness: 0.35, clearcoat: 0.6 }),
    rubber: solid({ color: "#16181c", metalness: 0, roughness: 0.85 }),
    edges: new THREE.LineBasicMaterial({ color: "#111111", transparent: true, opacity: 0 }),
    axis: new THREE.MeshBasicMaterial({ color: "#d71932", transparent: true, opacity: 0, depthWrite: false }),
    grid: new THREE.LineBasicMaterial({ color: "#9aa3ae", transparent: true, opacity: 0 }),
  };
}

const MaterialsContext = createContext<Materials | null>(null);
function useMaterials() {
  const m = useContext(MaterialsContext);
  if (!m) throw new Error("Materials missing");
  return m;
}

/** Target look for each mode: solid opacity, edge opacity, analysis overlay opacity, grid. */
const MODE_TARGETS: Record<VisualizationMode, { solid: number; edges: number; overlay: number; grid: number }> = {
  real: { solid: 1, edges: 0, overlay: 0, grid: 0 },
  cad: { solid: 0.04, edges: 0.85, overlay: 0, grid: 0.55 },
  analysis: { solid: 0.3, edges: 0.35, overlay: 1, grid: 0.25 },
};

/* ------------------------------------------------------------------------ */
/* Geometry helpers                                                          */
/* ------------------------------------------------------------------------ */

type Geo = { mesh: THREE.BufferGeometry; edges: THREE.BufferGeometry };

type PartProps = {
  geometry: Geo;
  material: THREE.Material;
  position?: [number, number, number];
  rotation?: [number, number, number];
};

/** A solid mesh plus its CAD feature edges (derived from a low-poly proxy). */
function Part({ geometry, material, position, rotation }: PartProps) {
  const m = useMaterials();
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geometry.mesh} material={material} />
      <lineSegments geometry={geometry.edges} material={m.edges} />
    </group>
  );
}

function useGeometries(quality: "high" | "low") {
  return useMemo(() => {
    const seg = quality === "high" ? 48 : 28;
    // Smooth mesh for rendering + 16-sided proxy whose facet edges read as CAD generator lines.
    const cyl = (rt: number, rb: number, h: number): Geo => ({
      mesh: new THREE.CylinderGeometry(rt, rb, h, seg, 1),
      edges: new THREE.EdgesGeometry(new THREE.CylinderGeometry(rt, rb, h, 16, 1), 20),
    });
    const box = (w: number, h: number, d: number, r: number): Geo => ({
      mesh: new RoundedBoxGeometry(w, h, d, 4, r),
      edges: new THREE.EdgesGeometry(new RoundedBoxGeometry(w, h, d, 1, r), 10),
    });
    const cone = (r: number, h: number): Geo => ({
      mesh: new THREE.ConeGeometry(r, h, seg, 1),
      edges: new THREE.EdgesGeometry(new THREE.ConeGeometry(r, h, 12, 1), 20),
    });
    return {
      basePlate: cyl(0.95, 0.98, 0.1),
      pedestal: cyl(0.58, 0.68, 0.46),
      pedestalRing: cyl(0.7, 0.7, 0.05),
      turret: cyl(0.52, 0.56, 0.3),
      shoulderHousing: cyl(0.34, 0.34, 0.66),
      shoulderCap: cyl(0.24, 0.24, 0.06),
      motor: cyl(0.17, 0.17, 0.42),
      upperArm: box(0.34, 1.62, 0.36, 0.1),
      elbowHousing: cyl(0.27, 0.27, 0.52),
      elbowCap: cyl(0.18, 0.18, 0.05),
      forearm: box(1.18, 0.26, 0.28, 0.08),
      forearmCollar: cyl(0.17, 0.17, 0.16),
      wristHousing: cyl(0.15, 0.15, 0.3),
      flange: cyl(0.12, 0.12, 0.05),
      toolBody: cyl(0.09, 0.09, 0.26),
      toolBand: cyl(0.095, 0.095, 0.035),
      nozzle: cone(0.055, 0.2),
      accentRing: new THREE.TorusGeometry(0.2, 0.014, 12, 64),
      accentRingSmall: new THREE.TorusGeometry(0.145, 0.011, 12, 64),
      axisRing: new THREE.TorusGeometry(0.42, 0.006, 8, 96),
      axisRingSmall: new THREE.TorusGeometry(0.26, 0.005, 8, 72),
    };
  }, [quality]);
}

function disposeGeometries(g: Record<string, Geo | THREE.BufferGeometry>) {
  for (const v of Object.values(g)) {
    if (v instanceof THREE.BufferGeometry) v.dispose();
    else {
      v.mesh.dispose();
      v.edges.dispose();
    }
  }
}

/* ------------------------------------------------------------------------ */
/* Robot                                                                     */
/* ------------------------------------------------------------------------ */

const TRAIL_POINTS = 240;

/**
 * Idle articulation — slow, physically plausible motion within joint limits,
 * resembling a dispensing tool tracing a path over a work surface.
 */
function jointAngles(t: number, px: number, py: number) {
  const a1 = 0.55 * Math.sin(t * 0.32) + px * 0.35;
  const a2 = -0.18 + 0.16 * Math.sin(t * 0.47 + 0.6) + py * 0.08;
  const a3 = 0.32 + 0.2 * Math.sin(t * 0.47 + 2.1);
  const a4 = 0.12 * Math.sin(t * 0.29);
  // Wrist compensates so the dispensing tool stays close to vertical.
  const a5 = -(a2 + a3) * 0.92 + 0.06 * Math.sin(t * 0.8);
  const a6 = t * 0.45;
  return [a1, a2, a3, a4, a5, a6] as const;
}
const HALF_PI = Math.PI / 2;

function Robot({
  quality,
  still,
  interactive,
  mode,
}: {
  quality: "high" | "low";
  still: boolean;
  interactive: boolean;
  mode: VisualizationMode;
}) {
  const m = useMaterials();
  const g = useGeometries(quality);

  const j1 = useRef<THREE.Group>(null);
  const j2 = useRef<THREE.Group>(null);
  const j3 = useRef<THREE.Group>(null);
  const j4 = useRef<THREE.Group>(null);
  const j5 = useRef<THREE.Group>(null);
  const j6 = useRef<THREE.Group>(null);
  const tip = useRef<THREE.Object3D>(null);
  const overlay = useRef<THREE.Group>(null);

  const pointer = useRef({ x: 0, y: 0 });
  const mix = useRef({ ...MODE_TARGETS[mode] });

  // Motion trail of the tool tip, drawn as a fat line (Line2)
  const trail = useMemo(() => {
    const geometry = new LineGeometry();
    const positions = new Float32Array(TRAIL_POINTS * 3);
    const colors = new Float32Array(TRAIL_POINTS * 3);
    const pale = new THREE.Color("#f6d3d8");
    const red = new THREE.Color("#d71932");
    const col = new THREE.Color();
    for (let i = 0; i < TRAIL_POINTS; i++) {
      const f = i / (TRAIL_POINTS - 1);
      col.copy(pale).lerp(red, f * f);
      colors.set([col.r, col.g, col.b], i * 3);
    }
    geometry.setPositions(positions);
    geometry.setColors(colors);
    const material = new LineMaterial({
      linewidth: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      worldUnits: false,
    });
    const line = new Line2(geometry, material);
    line.frustumCulled = false;
    return { line, geometry, material, positions };
  }, []);

  const envelope = useMemo(() => {
    const pts: number[] = [];
    const r = 2.45;
    for (let i = 0; i <= 160; i++) {
      const a = (i / 160) * Math.PI * 2;
      pts.push(Math.cos(a) * r, 0.012, Math.sin(a) * r);
    }
    const geometry = new LineGeometry();
    geometry.setPositions(pts);
    const material = new LineMaterial({
      color: "#d71932",
      linewidth: 1.2,
      dashed: true,
      dashSize: 0.08,
      gapSize: 0.08,
      transparent: true,
      opacity: 0,
    });
    const line = new Line2(geometry, material);
    line.computeLineDistances();
    return { line, material, geometry };
  }, []);

  const grid = useMemo(() => {
    const helper = new THREE.GridHelper(9, 36);
    helper.material = m.grid;
    helper.position.y = 0.002;
    return helper;
  }, [m.grid]);

  useEffect(
    () => () => {
      trail.geometry.dispose();
      trail.material.dispose();
      envelope.geometry.dispose();
      envelope.material.dispose();
      grid.geometry.dispose();
      disposeGeometries(g);
    },
    [trail, envelope, grid, g],
  );

  const tmp = useMemo(() => new THREE.Vector3(), []);

  /** Apply the joint angles for time t (idle cycle + pointer offsets). */
  function applyPose(t: number, px: number, py: number) {
    const a = jointAngles(t, px, py);
    if (j1.current) j1.current.rotation.y = a[0];
    if (j2.current) j2.current.rotation.z = a[1];
    if (j3.current) j3.current.rotation.z = a[2];
    if (j4.current) j4.current.rotation.x = a[3];
    if (j5.current) j5.current.rotation.z = a[4];
    if (j6.current) j6.current.rotation.y = a[5];
  }

  function writeTrailPoint(index: number) {
    if (!tip.current) return;
    tip.current.updateWorldMatrix(true, false);
    tip.current.getWorldPosition(tmp);
    trail.positions[index * 3] = tmp.x;
    trail.positions[index * 3 + 1] = tmp.y;
    trail.positions[index * 3 + 2] = tmp.z;
  }

  const seeded = useRef(false);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 20);
    const t = still ? 2.4 : state.clock.elapsedTime;

    // Smoothed pointer influence (desktop only)
    const px = interactive ? state.pointer.x : 0;
    const py = interactive ? state.pointer.y : 0;
    pointer.current.x += (px - pointer.current.x) * Math.min(1, dt * 2.5);
    pointer.current.y += (py - pointer.current.y) * Math.min(1, dt * 2.5);

    applyPose(t, pointer.current.x, pointer.current.y);

    // Cross-fade visualization modes
    const target = MODE_TARGETS[mode];
    const k = Math.min(1, dt * 4.2);
    const c = mix.current;
    c.solid += (target.solid - c.solid) * k;
    c.edges += (target.edges - c.edges) * k;
    c.overlay += (target.overlay - c.overlay) * k;
    c.grid += (target.grid - c.grid) * k;

    for (const mat of [m.shell, m.dark, m.machined, m.accent, m.rubber]) {
      mat.opacity = c.solid;
      mat.depthWrite = c.solid > 0.25;
      mat.visible = c.solid > 0.01;
    }
    m.edges.opacity = c.edges;
    m.edges.visible = c.edges > 0.01;
    m.axis.opacity = c.overlay * 0.9;
    m.grid.opacity = c.grid;
    trail.material.opacity = c.overlay;
    envelope.material.opacity = c.overlay * 0.55;
    if (overlay.current) overlay.current.visible = c.overlay > 0.01;

    // Seed the trail with the recent motion history so the path is visible
    // immediately (and in still mode, where the robot does not move).
    if (!seeded.current && tip.current) {
      seeded.current = true;
      const step = 1 / 30;
      for (let i = 0; i < TRAIL_POINTS; i++) {
        applyPose(t - (TRAIL_POINTS - 1 - i) * step, pointer.current.x, pointer.current.y);
        writeTrailPoint(i);
      }
      trail.geometry.setPositions(trail.positions);
    } else if (!still && tip.current) {
      trail.positions.copyWithin(0, 3);
      writeTrailPoint(TRAIL_POINTS - 1);
      trail.geometry.setPositions(trail.positions);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <primitive object={grid} />

      <group ref={overlay}>
        <primitive object={envelope.line} />
        <primitive object={trail.line} />
      </group>

      {/* Fixed base */}
      <Part geometry={g.basePlate} material={m.dark} position={[0, 0.05, 0]} />
      <Part geometry={g.pedestal} material={m.shell} position={[0, 0.33, 0]} />
      <Part geometry={g.pedestalRing} material={m.accent} position={[0, 0.125, 0]} />

      {/* J1 — base yaw */}
      <group ref={j1} position={[0, 0.56, 0]}>
        <mesh geometry={g.axisRing} material={m.axis} rotation={[HALF_PI, 0, 0]} position={[0, 0.02, 0]} />
        <Part geometry={g.turret} material={m.dark} position={[0, 0.15, 0]} />
        <Part geometry={g.motor} material={m.machined} position={[-0.42, 0.42, -0.1]} />

        {/* J2 — shoulder pitch (axis Z) */}
        <group ref={j2} position={[0, 0.62, 0]}>
          <mesh geometry={g.axisRing} material={m.axis} position={[0, 0, 0.42]} />
          <Part geometry={g.shoulderHousing} material={m.shell} rotation={[HALF_PI, 0, 0]} />
          <Part geometry={g.shoulderCap} material={m.machined} rotation={[HALF_PI, 0, 0]} position={[0, 0, 0.36]} />
          <mesh geometry={g.accentRing} material={m.accent} position={[0, 0, 0.395]} />
          <Part geometry={g.shoulderCap} material={m.machined} rotation={[HALF_PI, 0, 0]} position={[0, 0, -0.36]} />
          <Part geometry={g.upperArm} material={m.shell} position={[0, 0.78, 0]} />

          {/* J3 — elbow pitch (axis Z) */}
          <group ref={j3} position={[0, 1.56, 0]}>
            <mesh geometry={g.axisRingSmall} material={m.axis} position={[0, 0, 0.32]} />
            <Part geometry={g.elbowHousing} material={m.dark} rotation={[HALF_PI, 0, 0]} />
            <Part geometry={g.elbowCap} material={m.machined} rotation={[HALF_PI, 0, 0]} position={[0, 0, 0.275]} />
            <mesh geometry={g.accentRingSmall} material={m.accent} position={[0, 0, 0.305]} />
            <Part geometry={g.motor} material={m.machined} rotation={[0, 0, HALF_PI]} position={[-0.38, 0.06, 0]} />

            {/* J4 — forearm roll (axis X) */}
            <group ref={j4} position={[0.12, 0.06, 0]}>
              <Part geometry={g.forearm} material={m.shell} position={[0.62, 0, 0]} />
              <Part geometry={g.forearmCollar} material={m.machined} rotation={[0, 0, HALF_PI]} position={[1.25, 0, 0]} />

              {/* J5 — wrist pitch (axis Z) */}
              <group ref={j5} position={[1.38, 0, 0]}>
                <mesh geometry={g.axisRingSmall} material={m.axis} position={[0, 0, 0.2]} scale={0.6} />
                <Part geometry={g.wristHousing} material={m.dark} rotation={[HALF_PI, 0, 0]} />

                {/* J6 — flange roll (axis −Y), dispensing tool */}
                <group ref={j6} position={[0, -0.17, 0]}>
                  <Part geometry={g.flange} material={m.machined} />
                  <Part geometry={g.toolBody} material={m.shell} position={[0, -0.155, 0]} />
                  <Part geometry={g.toolBand} material={m.accent} position={[0, -0.12, 0]} />
                  <Part geometry={g.nozzle} material={m.rubber} position={[0, -0.385, 0]} rotation={[Math.PI, 0, 0]} />
                  <object3D ref={tip} position={[0, -0.49, 0]} />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------------ */
/* Scene                                                                     */
/* ------------------------------------------------------------------------ */

function ReadySignal({ onReady }: { onReady?: () => void }) {
  const fired = useRef(false);
  useFrame(() => {
    if (!fired.current) {
      fired.current = true;
      onReady?.();
    }
  });
  return null;
}

function Studio({ quality }: { quality: "high" | "low" }) {
  // Studio lighting rendered locally with light-formers — no external HDR files.
  return (
    <Environment resolution={quality === "high" ? 256 : 128} frames={1}>
      <color attach="background" args={["#f5f6f7"]} />
      <Lightformer form="rect" intensity={3} position={[0, 6, 2]} rotation={[HALF_PI, 0, 0]} scale={[10, 4, 1]} />
      <Lightformer form="rect" intensity={1.6} position={[-6, 2, 1]} rotation={[0, HALF_PI, 0]} scale={[4, 8, 1]} />
      <Lightformer form="rect" intensity={1.2} position={[6, 3, -2]} rotation={[0, -HALF_PI, 0]} scale={[3, 6, 1]} />
      <Lightformer form="ring" color="#ffe3e6" intensity={0.6} position={[0, 2, -6]} scale={3} />
    </Environment>
  );
}

function CameraRig() {
  const { camera } = useThree();
  useEffect(() => {
    camera.lookAt(0.5, 1.3, 0);
  }, [camera]);
  return null;
}

export default function RobotScene({
  mode,
  interactive = true,
  quality = "high",
  still = false,
  paused = false,
  preserveDrawingBuffer = false,
  onReady,
}: RobotSceneProps) {
  const materials = useMemo(() => createMaterials(), []);
  useEffect(() => () => Object.values(materials).forEach((mat) => mat.dispose()), [materials]);

  return (
    <Canvas
      frameloop={paused ? "never" : "always"}
      dpr={quality === "high" ? [1, 1.75] : [1, 1.25]}
      shadows={false}
      camera={{ position: [5.9, 3.3, 7.2], fov: 30, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      aria-hidden
      style={{ touchAction: interactive ? "none" : "pan-y" }}
    >
      <CameraRig />
      <MaterialsContext.Provider value={materials}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 8, 5]} intensity={1.4} />
        <directionalLight position={[-5, 3, -3]} intensity={0.5} color="#dfe6ef" />
        <Studio quality={quality} />
        <Robot quality={quality} still={still} interactive={interactive} mode={mode} />
        <ContactShadows
          position={[0, 0.001, 0]}
          opacity={mode === "real" ? 0.42 : 0.12}
          scale={9}
          blur={2.6}
          far={4}
          resolution={quality === "high" ? 512 : 256}
          frames={still ? 1 : Infinity}
          color="#111111"
        />
      </MaterialsContext.Provider>
      {interactive && (
        <OrbitControls
          target={[0.5, 1.3, 0]}
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.55}
          minPolarAngle={0.95}
          maxPolarAngle={1.45}
          minAzimuthAngle={-0.4}
          maxAzimuthAngle={1.6}
        />
      )}
      <ReadySignal onReady={onReady} />
    </Canvas>
  );
}
