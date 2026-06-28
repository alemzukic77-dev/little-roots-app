import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Giraffe } from "../../characters/Giraffe";
import { Sparkle } from "../../lib/Sparkle";
import { BEAT, COLORS, clamp01, dampedImpulse, lerp, loopSin } from "../../lib/utils";

const POLE_X = 790;
const POLE_BASE = 880;
const POLE_TOP = 620;

// rings big → small, resting beside the giraffe before being stacked
const RINGS = [
  { rx: 92, ry: 30, start: [520, 870] as [number, number] },
  { rx: 78, ry: 26, start: [520, 838] as [number, number] },
  { rx: 64, ry: 22, start: [520, 810] as [number, number] },
  { rx: 50, ry: 18, start: [520, 786] as [number, number] },
];
const stackY = (k: number) => POLE_BASE - 26 - k * 44;
const flyAt = (k: number) => k * BEAT + 6;
const FLIGHT = 14;
const unstackAt = (k: number) => 126 + (3 - k) * 5; // reverse order, top ring first

const Ring: React.FC<{ x: number; y: number; rx: number; ry: number; color: string; light: string; squash?: number }> = ({
  x,
  y,
  rx,
  ry,
  color,
  light,
  squash = 0,
}) => (
  <g transform={`translate(${x} ${y}) scale(${1 + squash * 0.08} ${1 - squash * 0.08})`}>
    <ellipse rx={rx} ry={ry} fill={color} stroke={COLORS.ink} strokeWidth={6} />
    <ellipse rx={rx * 0.42} ry={ry * 0.42} fill={COLORS.cream} stroke={COLORS.ink} strokeWidth={5} />
    <ellipse cx={-rx * 0.3} cy={-ry * 0.3} rx={rx * 0.28} ry={ry * 0.22} fill={light} opacity={0.7} />
  </g>
);

function ringPos(frame: number, k: number): { x: number; y: number; squash: number } {
  const F = flyAt(k);
  const U = unstackAt(k);
  const [sx, sy] = RINGS[k].start;

  if (frame >= U) {
    // floating back to the side pile (celebration rewind)
    const t = clamp01((frame - U) / 12);
    return {
      x: lerp(POLE_X, sx, t),
      y: lerp(stackY(k), sy, t) - Math.sin(Math.PI * t) * 160,
      squash: 0,
    };
  }
  if (frame < F) return { x: sx, y: sy, squash: 0 };
  if (frame < F + FLIGHT) {
    // arc up over the pole, then slide down onto it
    const t = (frame - F) / FLIGHT;
    if (t < 0.6) {
      const u = t / 0.6;
      return { x: lerp(sx, POLE_X, u), y: lerp(sy, POLE_TOP - 60, u) - Math.sin(Math.PI * u) * 120, squash: 0 };
    }
    const u = (t - 0.6) / 0.4;
    return { x: POLE_X, y: lerp(POLE_TOP - 60, stackY(k), u * u), squash: 0 };
  }
  return { x: POLE_X, y: stackY(k), squash: dampedImpulse(frame, F + FLIGHT, 0.9, 5) };
}

export const StackingRings: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraY = loopSin(frame, 1, 8);

  let nod = 0;
  for (let k = 0; k < 4; k++) nod += dampedImpulse(frame, flyAt(k) + FLIGHT, 0.8, 7) * 6;
  const neckSway = loopSin(frame, 1, 3.5) + (frame < 4 * BEAT ? loopSin(frame % BEAT, 1, 2) : 0);
  const bounceY = frame >= 120 ? -Math.abs(Math.sin((Math.PI * (frame - 120)) / 15)) * 18 : 0;
  const mouthOpen = frame >= 120 ? clamp01((frame - 122) / 5) * clamp01((148 - frame) / 5) * 0.5 : 0;

  const rings = RINGS.map((_, k) => ({ k, pos: ringPos(frame, k) }));

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <svg viewBox="0 0 1080 1080" style={{ width: "100%", height: "100%" }}>
        <g transform={`translate(0 ${cameraY})`}>
          <circle cx={160} cy={170} r={110} fill={COLORS.creamDeep} opacity={0.55} />
          <circle cx={950} cy={140} r={70} fill={COLORS.creamDeep} opacity={0.45} />
          {COLORS.poms.map((c, i) => (
            <circle key={i} cx={140 + i * 270} cy={290 + loopSin(frame, 2, 13, i * 1.7)} r={12} fill={c} opacity={0.25} />
          ))}

          <ellipse cx={540} cy={928} rx={460} ry={44} fill={COLORS.shadow} opacity={0.55} />

          <Giraffe frame={frame} x={300} y={892} neckSway={neckSway} nod={nod} mouthOpen={mouthOpen} bounceY={bounceY} />

          {/* rings flying behind the pole base, in size order so smaller sit on top */}
          {rings
            .filter(({ pos }) => pos.y < POLE_BASE - 100 || pos.x !== POLE_X)
            .map(({ k, pos }) => (
              <Ring key={k} x={pos.x} y={pos.y} rx={RINGS[k].rx} ry={RINGS[k].ry} color={COLORS.poms[k]} light={COLORS.pomsLight[k]} squash={pos.squash} />
            ))}

          {/* pole */}
          <ellipse cx={POLE_X} cy={POLE_BASE} rx={110} ry={26} fill={COLORS.tray} stroke={COLORS.trayRim} strokeWidth={6} />
          <rect x={POLE_X - 11} y={POLE_TOP} width={22} height={POLE_BASE - POLE_TOP} rx={11} fill={COLORS.trayRim} stroke={COLORS.ink} strokeWidth={5} />
          <circle cx={POLE_X} cy={POLE_TOP} r={16} fill={COLORS.tray} stroke={COLORS.ink} strokeWidth={5} />

          {/* stacked rings (in front of the pole) */}
          {rings
            .filter(({ pos }) => pos.x === POLE_X && pos.y >= POLE_BASE - 100)
            .map(({ k, pos }) => (
              <Ring key={k} x={pos.x} y={pos.y} rx={RINGS[k].rx} ry={RINGS[k].ry} color={COLORS.poms[k]} light={COLORS.pomsLight[k]} squash={pos.squash} />
            ))}

          {[
            [620, 420],
            [930, 380],
            [560, 560],
            [990, 520],
            [760, 300],
            [870, 460],
          ].map(([sx, sy], i) => (
            <Sparkle key={i} x={sx} y={sy} born={122 + i * 3} frame={frame} size={24 + (i % 3) * 8} color={COLORS.poms[i % 4]} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
