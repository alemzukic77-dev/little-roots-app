import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bunny } from "../../characters/Bunny";
import { Sparkle } from "../../lib/Sparkle";
import { BEAT, COLORS, clamp01, dampedImpulse, loopSin, LOOP_FRAMES } from "../../lib/utils";

const BUBBLE_EDGE = "#9CCFE8";
const BUBBLE_FILL = "#E2F2F7";

/** loop-aware elapsed time since `start` */
const since = (frame: number, start: number) => (((frame - start) % LOOP_FRAMES) + LOOP_FRAMES) % LOOP_FRAMES;

const Bubble: React.FC<{ x: number; y: number; r: number; opacity?: number }> = ({ x, y, r, opacity = 1 }) => (
  <g transform={`translate(${x} ${y})`} opacity={opacity}>
    <circle r={r} fill={BUBBLE_FILL} fillOpacity={0.45} stroke={BUBBLE_EDGE} strokeWidth={5} />
    <path d={`M ${-r * 0.55} ${-r * 0.25} A ${r * 0.62} ${r * 0.62} 0 0 1 ${-r * 0.2} ${-r * 0.58}`} fill="none" stroke={COLORS.white} strokeWidth={6} strokeLinecap="round" />
  </g>
);

const Burst: React.FC<{ x: number; y: number; t: number; r: number }> = ({ x, y, t, r }) => (
  <g transform={`translate(${x} ${y})`} opacity={1 - t}>
    {Array.from({ length: 7 }, (_, i) => {
      const a = (i / 7) * Math.PI * 2;
      const d = r * (0.7 + t * 1.1);
      return (
        <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={6 * (1 - t)} fill={BUBBLE_EDGE} />
      );
    })}
  </g>
);

// target bubbles: rise for 33 frames, popped by the bunny's hop at the apex.
// k=0 spawns "before" frame 0 (wrap), so its pop lands at frame 9 — fully seamless.
const TARGETS = Array.from({ length: 5 }, (_, k) => ({
  spawn: (k * BEAT - 24 + LOOP_FRAMES) % LOOP_FRAMES,
  x: 470 + (k % 2) * 60,
  popY: 480,
}));
const RISE = 33;

// ambient background bubbles — fade in/out inside their window so the wrap is invisible
const AMBIENT = [
  { spawn: 10, x: 130, r: 26, speed: 5.4 },
  { spawn: 55, x: 870, r: 32, speed: 4.6 },
  { spawn: 95, x: 990, r: 22, speed: 5.8 },
  { spawn: 30, x: 740, r: 18, speed: 6.2 },
  { spawn: 120, x: 230, r: 20, speed: 5.0 },
];

export const BubbleChase: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraY = loopSin(frame, 1, 8);

  // bunny hops once per beat; pop happens at the apex
  const p = frame % BEAT;
  const hop = -Math.sin(Math.PI * clamp01(p / 18)) * (frame >= 120 ? 70 : 95);

  // reaching arm: swings up to touch the bubble at the hop apex
  let rightArm = interpolate(p, [0, 5, 9, 15, BEAT], [0, -110, -135, -25, 0]);
  let leftArm = 8 + loopSin(frame, 3, 3);
  if (frame >= 120) {
    const wave =
      Math.sin((frame - 127) * 0.8) * 12 * clamp01((frame - 127) / 3) * clamp01((143 - frame) / 3);
    rightArm =
      interpolate(frame, [120, 127, 143, 150], [0, -150, -150, 0], { extrapolateRight: "clamp" }) + wave;
    leftArm =
      interpolate(frame, [120, 127, 143, 150], [8, 150, 150, 8], { extrapolateRight: "clamp" }) - wave;
  }

  let ears = 0;
  for (let k = 0; k < 5; k++) ears += dampedImpulse(frame, (k * BEAT + 9) % LOOP_FRAMES, 0.85, 7) * 8;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <svg viewBox="0 0 1080 1080" style={{ width: "100%", height: "100%" }}>
        <g transform={`translate(0 ${cameraY})`}>
          <circle cx={160} cy={170} r={110} fill={COLORS.creamDeep} opacity={0.55} />
          <circle cx={950} cy={140} r={70} fill={COLORS.creamDeep} opacity={0.45} />

          <ellipse cx={520} cy={930} rx={440} ry={44} fill={COLORS.shadow} opacity={0.55} />

          {/* ambient bubbles drifting up */}
          {AMBIENT.map((b, i) => {
            const dt = since(frame, b.spawn);
            const win = 110;
            if (dt > win) return null;
            const o = clamp01(dt / 10) * clamp01((win - dt) / 10) * 0.7;
            return (
              <Bubble
                key={i}
                x={b.x + Math.sin(dt * 0.12 + i) * 16}
                y={1000 - dt * b.speed}
                r={b.r}
                opacity={o}
              />
            );
          })}

          {/* target bubbles + pops */}
          {TARGETS.map((t, k) => {
            const dt = since(frame, t.spawn);
            if (dt < RISE) {
              const y = interpolate(dt, [0, RISE], [1010, t.popY]);
              return <Bubble key={k} x={t.x + Math.sin(dt * 0.25) * 14} y={y} r={44} />;
            }
            if (dt < RISE + 9) {
              const bt = (dt - RISE) / 9;
              return <Burst key={k} x={t.x} y={t.popY} t={bt} r={44} />;
            }
            return null;
          })}

          <Bunny
            frame={frame}
            x={330}
            y={888}
            earWiggle={ears}
            rightArmAngle={rightArm}
            leftArmAngle={leftArm}
            bounceY={hop}
          />

          {[
            [620, 360],
            [840, 300],
            [560, 520],
            [950, 480],
            [720, 240],
            [1000, 600],
          ].map(([sx, sy], i) => (
            <Sparkle key={i} x={sx} y={sy} born={122 + i * 3} frame={frame} size={22 + (i % 3) * 8} color={i % 2 ? BUBBLE_EDGE : "#FFB938"} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
