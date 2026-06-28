import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Fox } from "../../characters/Fox";
import { Sparkle } from "../../lib/Sparkle";
import { BEAT, COLORS, clamp01, dampedImpulse, lerp, loopSin } from "../../lib/utils";

const PASTA = "#F2C879";
const PASTA_DARK = "#D9A441";
const LACE = "#D85A8E";

// lace runs across the lower right; threaded penne slide along it
const LACE_START: [number, number] = [560, 700];
const LACE_END: [number, number] = [1000, 820];
const lacePoint = (t: number): [number, number] => {
  const x = lerp(LACE_START[0], LACE_END[0], t);
  const y = lerp(LACE_START[1], LACE_END[1], t) + Math.sin(Math.PI * t) * 50;
  return [x, y];
};

const BOWL: [number, number] = [620, 880];
const threadAt = (k: number) => k * BEAT + 6;
const FLIGHT = 12;
const slideTarget = (k: number) => 0.78 - k * 0.16; // threaded pieces settle along the lace
const popBackAt = (k: number) => 126 + k * 5;

const Penne: React.FC<{ x: number; y: number; rotation: number; scale?: number }> = ({ x, y, rotation, scale = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}>
    <rect x={-34} y={-20} width={68} height={40} rx={14} fill={PASTA} stroke={COLORS.ink} strokeWidth={5} />
    <ellipse cx={-30} cy={0} rx={9} ry={17} fill={PASTA_DARK} stroke={COLORS.ink} strokeWidth={4} />
    <ellipse cx={30} cy={0} rx={9} ry={17} fill={PASTA_DARK} stroke={COLORS.ink} strokeWidth={4} />
  </g>
);

export const ThreadingPasta: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraY = loopSin(frame, 1, 8);

  let arm = 6 + loopSin(frame, 4, 6);
  if (frame >= 4 * BEAT) {
    const wave = Math.sin((frame - 127) * 0.85) * 12 * clamp01((frame - 127) / 3) * clamp01((143 - frame) / 3);
    arm = interpolate(frame, [120, 127, 143, 150], [6, -145, -145, 6], { extrapolateRight: "clamp" }) + wave;
  } else {
    const p = frame % BEAT;
    arm = interpolate(p, [0, 5, 11, 18, BEAT], [6, -38, 30, 6, 6]);
  }

  let tail = loopSin(frame, 2, 9);
  let ears = 0;
  for (let k = 0; k < 4; k++) {
    tail += dampedImpulse(frame, threadAt(k) + FLIGHT, 0.8, 7) * 7;
    ears += dampedImpulse(frame, threadAt(k) + FLIGHT, 0.85, 7) * 7;
  }
  ears += dampedImpulse(frame, 124, 0.7, 8) * 12;
  const bounceY = frame >= 120 ? -Math.abs(Math.sin((Math.PI * (frame - 120)) / 15)) * 22 : 0;

  // the lace gets a happy little wave during the celebration
  const laceWave = frame >= 120 ? loopSin(frame, 5, 6) * clamp01((frame - 120) / 6) * clamp01((150 - frame) / 6) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <svg viewBox="0 0 1080 1080" style={{ width: "100%", height: "100%" }}>
        <g transform={`translate(0 ${cameraY})`}>
          <circle cx={150} cy={170} r={115} fill={COLORS.creamDeep} opacity={0.55} />
          <circle cx={945} cy={130} r={75} fill={COLORS.creamDeep} opacity={0.45} />
          {COLORS.poms.map((c, i) => (
            <circle key={i} cx={130 + i * 270} cy={300 + loopSin(frame, 2, 14, i * 1.7)} r={13} fill={c} opacity={0.25} />
          ))}

          <ellipse cx={560} cy={930} rx={470} ry={44} fill={COLORS.shadow} opacity={0.55} />

          <Fox frame={frame} x={300} y={892} armAngle={arm} tailSwish={tail} earWiggle={ears} bounceY={bounceY} />

          {/* shoelace */}
          <g transform={`translate(0 ${laceWave})`}>
            <path
              d={`M ${LACE_START[0]} ${LACE_START[1]} Q ${(LACE_START[0] + LACE_END[0]) / 2} ${(LACE_START[1] + LACE_END[1]) / 2 + 100} ${LACE_END[0]} ${LACE_END[1]}`}
              fill="none"
              stroke={LACE}
              strokeWidth={10}
              strokeLinecap="round"
            />
            {/* aglet */}
            <g transform={`translate(${LACE_START[0]} ${LACE_START[1]}) rotate(-40)`}>
              <rect x={-7} y={-26} width={14} height={30} rx={6} fill="#C8CDD4" stroke={COLORS.ink} strokeWidth={4} />
            </g>
          </g>

          {/* bowl of penne */}
          <ellipse cx={BOWL[0]} cy={BOWL[1] + 14} rx={95} ry={26} fill={COLORS.white} stroke={COLORS.trayRim} strokeWidth={6} />
          <Penne x={BOWL[0] - 28} y={BOWL[1] - 4} rotation={-18} scale={0.8} />
          <Penne x={BOWL[0] + 30} y={BOWL[1]} rotation={24} scale={0.8} />

          {/* penne pieces: bowl → arc to lace start → slide along lace → pop back at celebration */}
          {Array.from({ length: 4 }, (_, k) => {
            const T = threadAt(k);
            const P = popBackAt(k);

            if (frame >= P) {
              // pop back toward the bowl
              const t = clamp01((frame - P) / 12);
              const [lx, ly] = lacePoint(slideTarget(k));
              const x = lerp(lx, BOWL[0], t);
              const y = lerp(ly, BOWL[1] - 10, t) - Math.sin(Math.PI * t) * 180;
              return t >= 1 ? null : <Penne key={k} x={x} y={y} rotation={t * 300} />;
            }
            if (frame < T) return null; // resting in the bowl (drawn as bowl dressing)
            if (frame < T + FLIGHT) {
              // arc from bowl to the lace tip
              const t = (frame - T) / FLIGHT;
              const x = lerp(BOWL[0], LACE_START[0], t);
              const y = lerp(BOWL[1] - 20, LACE_START[1], t) - Math.sin(Math.PI * t) * 200;
              return <Penne key={k} x={x} y={y} rotation={t * 240 - 40} />;
            }
            // sliding down the lace to its resting slot
            const slide = clamp01((frame - T - FLIGHT) / 10);
            const pos = lerp(0.02, slideTarget(k), slide);
            const [lx, ly] = lacePoint(pos);
            const angle = Math.atan2(
              lacePoint(Math.min(pos + 0.02, 1))[1] - ly,
              lacePoint(Math.min(pos + 0.02, 1))[0] - lx,
            ) * (180 / Math.PI);
            return <Penne key={k} x={lx} y={ly + laceWave} rotation={angle + 90} />;
          })}

          {[
            [180, 360],
            [430, 300],
            [120, 520],
            [700, 480],
            [950, 560],
            [820, 420],
          ].map(([sx, sy], i) => (
            <Sparkle key={i} x={sx} y={sy} born={122 + i * 3} frame={frame} size={24 + (i % 3) * 8} color={COLORS.poms[i % 4]} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
