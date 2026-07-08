"use client";

import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Sparkles } from "@react-three/drei";
import MiraModel from "./MiraModel";

/**
 * Dials the HDRI environment contribution up/down. Done via
 * `scene.environmentIntensity` (three r163+) so it works regardless of
 * which drei version's <Environment /> props are available.
 */
function EnvironmentIntensity({ value }: { value: number }) {
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    scene.environmentIntensity = value;
  }, [scene, value]);
  return null;
}

/**
 * Hero 3D stage — classic 3-point rig tuned for the cyberpunk theme:
 * - ambient fill: lifts the shadows so no detail crushes to black
 * - key: bright, slightly cyan-tinted directional from front-right
 * - rim: violet point light from behind-left separating her from the dark bg
 * - HDRI environment ("city") gives Sketchfab PBR materials real reflections,
 *   which is what keeps metal/leather from rendering flat and dark
 */
export default function HeroScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0.4, 5.2], fov: 42 }}
      dpr={[1, 1.75]} // cap pixel ratio — big perf win on high-DPI screens
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="!absolute inset-0"
    >
      {/* --- 3-point lighting rig --- */}
      {/* Fill: cool ambient so shadow sides stay readable */}
      <ambientLight intensity={0.7} color="#cfc7bb" />
      {/* Key: main light, subtle cyan tint to match the theme */}
      <directionalLight
        position={[3, 5, 4]}
        intensity={2.4}
        color="#ffe4c8"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Rim: violet back light — separates her silhouette from the void */}
      <pointLight position={[-3.5, 2.5, -3.5]} intensity={40} color="#a78bfa" />
      {/* Secondary cyan kicker for the neon edge on the other side */}
      <pointLight position={[4, 1.5, -2]} intensity={18} color="#c97b5d" />
      {/* Low front bounce so her lower half isn't lost in shadow */}
      <pointLight position={[0, -1.5, 3]} intensity={6} color="#cf9a62" />

      <Suspense fallback={null}>
        {/* HDRI reflections for PBR materials — kept subtle at 0.5 */}
        <Environment preset="city" />
        <EnvironmentIntensity value={0.5} />

        <MiraModel />
        {/* Floating holo-particles around the character */}
        <Sparkles count={70} scale={[6, 5, 4]} size={1.6} speed={0.35} color="#c97b5d" opacity={0.45} />
        <Sparkles count={30} scale={[5, 4, 3]} size={2.2} speed={0.2} color="#a78bfa" opacity={0.3} />
        {/* Soft grounding shadow under the character */}
        <ContactShadows position={[0, -1.75, 0]} opacity={0.55} scale={8} blur={2.4} far={3} color="#c97b5d" />
      </Suspense>
    </Canvas>
  );
}
