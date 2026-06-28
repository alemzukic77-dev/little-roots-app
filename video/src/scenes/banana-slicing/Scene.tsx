import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Monkey } from "../../characters/Monkey";
import { Sparkle } from "../../lib/Sparkle";
import { BEAT, COLORS, clamp01, dampedImpulse, lerp, loopSin } from "../../lib/utils";

const BANANA = "#F7D060";
const BANANA_IN = "#FCEFC2";

const chopAt = (k: number) => k * BEAT + 13;
const PLATE = { x: 905, y: 862 };

const Slice: React.FC<{ x: number; y: number; rotation: number; opacity: number }> = ({ x, y, rotation, opacity }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotation})`} opacity={opacity}>
    <ellipse rx={27} ry={23} fill={BANANA} stroke={COLORS.ink} strokeWidth={5} />
    <ellipse rx={16} ry={13} fill={BANANA_IN} />
    <circle r={3.5} fill={BANANA} />
  </g>
);

export const BananaSlicing: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraY = loopSin(frame, 1, 8);

  // chop arm: raise → quick chop → rest
  let chop = 10;
  if (frame < 4 * BEAT) {
    const p = frame % BEAT;
    chop = interpolate(p, [0, 5, 10, 14, 20, BEAT], [10, -48, -48, 54, 10, 10]);
  } else {
    const wave =
      Math.sin((frame - 127) * 0.85) * 12 * clamp01((frame - 127) / 3) * clamp01((143 - frame) / 3);
    chop =
      interpolate(frame, [120, 127, 143, 150], [10, -150, -150, 10], { extrapolateRight: "clamp" }) +
      wave;
  }

  let ears = 0;
  for (let k = 0; k < 4; k++) ears += dampedImpulse(frame, chopAt(k), 0.85, 7) * 8;
  ears += dampedImpulse(frame, 124, 0.7, 8) * 12;

  const bounceY = frame >= 120 ? -Math.abs(Math.sin((Math.PI * (frame - 120)) / 15)) * 24 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <svg viewBox="0 0 1080 1080" style={{ width: "100%", height: "100%" }}>
        <g transform={`translate(0 ${cameraY})`}>
          <circle cx={150} cy={170} r={115} fill={COLORS.creamDeep} opacity={0.55} />
          <circle cx={945} cy={130} r={75} fill={COLORS.creamDeep} opacity={0.45} />
          {[BANANA, COLORS.poms[2], BANANA].map((c, i) => (
            <circle key={i} cx={210 + i * 320} cy={290 + loopSin(frame, 2, 13, i * 2)} r={12} fill={c} opacity={0.3} />
          ))}

          <ellipse cx={560} cy={930} rx={470} ry={44} fill={COLORS.shadow} opacity={0.55} />

          <Monkey frame={frame} x={310} y={892} chopAngle={chop} earWiggle={ears} bounceY={bounceY} holdKnife />

          {/* cutting board */}
          <rect x={440} y={852} width={330} height={42} rx={16} fill={COLORS.tray} stroke={COLORS.trayRim} strokeWidth={6} />

          {/* banana — gentle rock when chopped */}
          <g
            transform={`translate(590 842) rotate(${
              dampedImpulse(frame, chopAt(0), 0.9, 5) * 3 +
              dampedImpulse(frame, chopAt(1), 0.9, 5) * 3 +
              dampedImpulse(frame, chopAt(2), 0.9, 5) * 3 +
              dampedImpulse(frame, chopAt(3), 0.9, 5) * 3
            })`}>
            <path
              d="M -120 -6 Q -60 44 40 30 Q 110 18 132 -38 Q 136 -50 122 -46 Q 96 -6 36 4 Q -50 16 -104 -22 Q -122 -28 -120 -6 Z"
              fill={BANANA}
              stroke={COLORS.ink}
              strokeWidth={6}
              strokeLinejoin="round"
            />
            <path d="M 124 -44 L 136 -56 Q 140 -62 132 -62 L 120 -52 Z" fill="#8A6B3A" stroke={COLORS.ink} strokeWidth={4} />
          </g>

          {/* plate */}
          <ellipse cx={PLATE.x} cy={PLATE.y + 22} rx={92} ry={22} fill={COLORS.white} stroke={COLORS.trayRim} strokeWidth={6} />

          {/* slices: pop off at each chop, arc onto the plate, stack, then get "eaten" */}
          {Array.from({ length: 4 }, (_, k) => {
            const born = chopAt(k);
            if (frame < born) return null;
            const t = clamp01((frame - born) / 12);
            const sx = lerp(560, PLATE.x - 10 + k * 7, t);
            const sy = lerp(826, PLATE.y - k * 13, t) - Math.sin(Math.PI * t) * 150;
            const fade = interpolate(frame, [128 + k * 3, 138 + k * 3], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return <Slice key={k} x={sx} y={sy} rotation={t * 200} opacity={fade} />;
          })}

          {[
            [180, 360],
            [430, 300],
            [120, 520],
            [700, 560],
            [950, 620],
            [820, 500],
          ].map(([sx, sy], i) => (
            <Sparkle key={i} x={sx} y={sy} born={122 + i * 3} frame={frame} size={24 + (i % 3) * 8} color={i % 2 ? BANANA : "#FFB938"} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
