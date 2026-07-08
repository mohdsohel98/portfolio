"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";

const MODEL_URL = "/mira.glb";

/* --- Drag-to-rotate tuning --- */
/** Radians of rotation per pixel of horizontal drag */
const DRAG_SENSITIVITY = 0.008;
/** Idle auto-rotation speed (rad/s) when the user isn't dragging */
const AUTO_ROTATE_SPEED = 0.18;
/** Per-frame decay applied to fling velocity after the pointer is released */
const INERTIA_DECAY = 0.94;

/* --- Cursor-follow tuning --- */
/** How far (world units) she shifts per unit of normalized mouse travel */
const FOLLOW_RANGE_X = 1.0;
const FOLLOW_RANGE_Y = 0.5;
/**
 * Hard clamps on her travel (world units, relative to center).
 * Left is tighter than right so she never drifts over the hero text,
 * and the top is capped so she stays clear of the navbar.
 */
const CLAMP_X: [number, number] = [-0.55, 0.9];
const CLAMP_Y: [number, number] = [-0.3, 0.35];
/** Lerp factor for the glide — lower = floatier */
const FOLLOW_EASE = 0.045;
/** How strongly she rolls into her direction of travel (max radians) */
const LEAN_STRENGTH = 0.9;
const LEAN_MAX = 0.14;

/**
 * Mira — rigged sci-fi mercenary character.
 * - Plays the baked "Take 001" clip on loop; all interaction below is layered
 *   on top of the group transform, never touching the animated bones
 * - Cursor-follow: she glides toward the mouse within a clamped box (mouse only;
 *   drifts back to center when the cursor leaves the window)
 * - Lean: rolls slightly into her direction of travel while moving
 * - Drag (mouse or touch) spins her around her own Y-axis; camera stays fixed.
 *   Touch devices get drag-rotate only — no cursor follow
 * - Auto-rotates slowly while idle, with fling inertia after a drag
 * - Auto-normalized: scaled + centered from its bounding box so it frames
 *   correctly regardless of the export's native units
 */
export default function MiraModel() {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions, names } = useAnimations(animations, group);
  const gl = useThree((s) => s.gl);

  // All interaction state lives in refs — handlers never touch React state,
  // so mouse movement and dragging cause zero re-renders (no jank).
  const drag = useRef({
    active: false,
    lastX: 0,
    velocity: 0, // rad/frame carried into inertia after release
    offset: 0, // accumulated user + auto rotation (radians)
  });
  const follow = useRef({
    x: 0, // normalized mouse position, -1..1
    y: 0,
    active: false, // false = no mouse in window → return to center
  });
  // Smoothed follow position, kept separate from the group so the idle
  // float can be layered on top without feedback loops.
  const smooth = useRef({ x: 0, y: 0 });

  // Play "Take 001" (or whatever the first clip is called) on loop
  useEffect(() => {
    const clipName = names.includes("Take 001") ? "Take 001" : names[0];
    const action = clipName ? actions[clipName] : null;
    action?.reset().fadeIn(0.6).play();
    return () => {
      action?.fadeOut(0.3);
    };
  }, [actions, names]);

  // Normalize scale/position once: fit the character to ~3.4 world units tall
  useEffect(() => {
    if (!inner.current) return;
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const targetHeight = 3.4;
    const scale = size.y > 0 ? targetHeight / size.y : 1;
    inner.current.scale.setScalar(scale);
    // Center horizontally/depth-wise, rest feet on y = -1.7
    inner.current.position.set(
      -center.x * scale,
      -box.min.y * scale - targetHeight / 2,
      -center.z * scale
    );

    // Make sure everything casts/receives shadows and pops under rim light
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  // Cursor-follow tracking: window-level so moving over the hero text still
  // steers her. Touch pointers are ignored — on touch she stays centered and
  // drag-to-rotate (below) is the interaction instead.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      follow.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      follow.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
      follow.current.active = true;
    };
    // Mouse left the window entirely → drift back to default center pose
    const onLeave = () => {
      follow.current.active = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Drag-to-rotate: native pointer events on the canvas element.
  // Pointer events unify mouse + touch; `touch-action: pan-y` keeps vertical
  // page scrolling working on touch screens while horizontal drags rotate her.
  useEffect(() => {
    const el = gl.domElement;
    el.style.touchAction = "pan-y";
    el.style.cursor = "grab";

    const onDown = (e: PointerEvent) => {
      drag.current.active = true;
      drag.current.lastX = e.clientX;
      drag.current.velocity = 0;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };

    const onMove = (e: PointerEvent) => {
      if (!drag.current.active) return;
      const dx = e.clientX - drag.current.lastX;
      drag.current.lastX = e.clientX;
      drag.current.offset += dx * DRAG_SENSITIVITY;
      drag.current.velocity = dx * DRAG_SENSITIVITY; // remembered for the fling
    };

    const onUp = (e: PointerEvent) => {
      drag.current.active = false;
      el.style.cursor = "grab";
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* pointer may already be released */
      }
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [gl]);

  // Per-frame: cursor-follow glide + lean, drag/auto rotation, idle float,
  // and scroll-driven pose shift — all on the group, on top of the animation.
  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const d = drag.current;
    const f = follow.current;
    const s = smooth.current;

    /* --- Position: glide toward the (clamped) cursor target --- */
    // Inactive mouse → target reverts to (0,0) and she drifts home
    const targetX = f.active
      ? THREE.MathUtils.clamp(f.x * FOLLOW_RANGE_X, CLAMP_X[0], CLAMP_X[1])
      : 0;
    const targetYPos = f.active
      ? THREE.MathUtils.clamp(f.y * FOLLOW_RANGE_Y, CLAMP_Y[0], CLAMP_Y[1])
      : 0;

    s.x = THREE.MathUtils.lerp(s.x, targetX, FOLLOW_EASE);
    s.y = THREE.MathUtils.lerp(s.y, targetYPos, FOLLOW_EASE);

    group.current.position.x = s.x;
    // Idle hover float layers on top of the follow position
    group.current.position.y = s.y + Math.sin(t * 0.9) * 0.06;

    /* --- Lean: roll into the direction of travel --- */
    // Remaining distance to the target doubles as a velocity proxy: big gap
    // = fast movement = strong lean; settles to 0 as she arrives.
    const leanZ = THREE.MathUtils.clamp(
      -(targetX - s.x) * LEAN_STRENGTH,
      -LEAN_MAX,
      LEAN_MAX
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      leanZ,
      0.08
    );

    /* --- Rotation: drag / inertia / idle auto-spin --- */
    if (!d.active) {
      // Fling inertia winds down, then the slow idle spin takes over
      d.velocity *= INERTIA_DECAY;
      d.offset += d.velocity + AUTO_ROTATE_SPEED * delta;
    }

    // Yaw = user/auto rotation + tiny mouse sway + slow turn while scrolling
    const targetYaw =
      d.offset + state.pointer.x * 0.12 + scrollState.progress * Math.PI * 0.6;
    // Slight pitch toward the cursor vertically
    const targetPitch = -state.pointer.y * 0.08;

    // Tight lerp while dragging so she tracks the pointer 1:1, relaxed when idle
    const ease = d.active ? 0.35 : 0.06;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetYaw, ease);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetPitch, 0.06);
  });

  return (
    <group ref={group}>
      <group ref={inner}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_URL);
