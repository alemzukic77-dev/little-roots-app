export const TAU = Math.PI * 2;
export const LOOP_FRAMES = 150;
export const BEAT = 30; // one pom-pom hop per second

// Brand palette (mirrors app src/theme/tokens.ts — video workspace stays standalone)
export const COLORS = {
  cream: "#FDF4EE",
  creamDeep: "#F7E8DC",
  shadow: "#F0DFCE",
  ink: "#1C1A20",
  white: "#FFFFFF",
  ember: "#FF6D3B",
  bunny: "#FFF9F2",
  bunnyInner: "#FBE3D4",
  blush: "#F8C5B0",
  tray: "#E8D5BC",
  trayRim: "#D9C0A0",
  // pom-pom + cup accent colors (app category tints)
  poms: ["#FF6D3B", "#3D5A9E", "#3E7A4E", "#6650A8"],
  pomsLight: ["#FFE3D7", "#E8EEFB", "#E5F3E8", "#EEE9FB"],
};

/** Sine that completes `cycles` full periods over the loop — value/phase identical at frame 0 and LOOP_FRAMES. */
export function loopSin(frame: number, cycles: number, amplitude: number, phase = 0): number {
  return Math.sin((TAU * cycles * frame) / LOOP_FRAMES + phase) * amplitude;
}

/** Damped oscillation impulse fired at `start` — wiggle that decays to ~0 within ~3·decay frames. */
export function dampedImpulse(frame: number, start: number, freq: number, decay: number): number {
  const t = frame - start;
  if (t <= 0) return 0;
  return Math.exp(-t / decay) * Math.sin(t * freq);
}

export function clamp01(t: number): number {
  return Math.max(0, Math.min(1, t));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
