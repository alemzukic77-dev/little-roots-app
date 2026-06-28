import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Cat } from "../../characters/Cat";
import { Sparkle } from "../../lib/Sparkle";
import { BEAT, COLORS, clamp01, dampedImpulse, lerp, loopSin } from "../../lib/utils";

const POND = "#CDE8F4";
const POND_EDGE = "#2E7490";
const MAGNET = "#E24B4A";

const ROD_TIP: [number, number] = [462, 538]; // matches the rod in the cat's paw
const HOME: [number, number] = [510, 620]; // magnet rest position (hanging from the tip)
const BUCKET: [number, number] = [445, 800];
const fishSlot = (k: number): [number, number] => [640 + k * 78, 858];

const catchStart = (k: number) => k * BEAT; // beat phases: 0-8 descend, 8-16 lift, 16-20 to bucket, 20-24 drop, 24-30 home
const releaseAt = (k: number) => k * BEAT + 20;
const returnAt = (k: number) => 124 + k * 5; // celebration: fish hop back into the pond

function magnetPos(frame: number): [number, number] {
  if (frame >= 4 * BEAT) return HOME;
  const k = Math.floor(frame / BEAT);
  const p = frame % BEAT;
  const [fx, fy] = fishSlot(k);
  const grab: [number, number] = [fx, fy - 30];
  if (p < 8) return [lerp(HOME[0], grab[0], p / 8), lerp(HOME[1], grab[1], p / 8)];
  if (p < 16) return [lerp(grab[0], HOME[0], (p - 8) / 8), lerp(grab[1], HOME[1] - 40, (p - 8) / 8)];
  if (p < 20) return [lerp(HOME[0], BUCKET[0], (p - 16) / 4), lerp(HOME[1] - 40, BUCKET[1] - 120, (p - 16) / 4)];
  if (p < 24) return [BUCKET[0], BUCKET[1] - 120];
  return [lerp(BUCKET[0], HOME[0], (p - 24) / 6), lerp(BUCKET[1] - 120, HOME[1], (p - 24) / 6)];
}

const Fish: React.FC<{ x: number; y: number; color: string; light: string; wiggle: number; rotation?: number }> = ({
  x,
  y,
  color,
  light,
  wiggle,
  rotation = 0,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rotation})`}>
    <g transform={`rotate(${wiggle})`}>
      <path d="M 26 0 L 50 -16 L 50 16 Z" fill={color} stroke={COLORS.ink} strokeWidth={4} strokeLinejoin="round" />
    </g>
    <ellipse cx={0} cy={0} rx={30} ry={20} fill={color} stroke={COLORS.ink} strokeWidth={4} />
    <ellipse cx={-2} cy={4} rx={14} ry={8} fill={light} />
    <circle cx={-16} cy={-5} r={4} fill={COLORS.ink} />
    {/* paper-clip mouth */}
    <circle cx={-30} cy={0} r={6} fill="none" stroke="#8A8A92" strokeWidth={3.5} />
  </g>
);

export const MagneticFishing: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraY = loopSin(frame, 1, 8);
  const [mx, my] = magnetPos(frame);

  let tail = loopSin(frame, 2, 9);
  let ears = 0;
  for (let k = 0; k < 4; k++) {
    tail += dampedImpulse(frame, k * BEAT + 8, 0.8, 7) * 7;
    ears += dampedImpulse(frame, k * BEAT + 8, 0.85, 7) * 7;
  }
  ears += dampedImpulse(frame, 124, 0.7, 8) * 12;

  const armAngle = frame < 4 * BEAT ? 4 + loopSin(frame, 4, 5) : interpolate(frame, [120, 127, 143, 150], [4, -30, -30, 4], { extrapolateRight: "clamp" });
  const bounceY = frame >= 120 ? -Math.abs(Math.sin((Math.PI * (frame - 120)) / 15)) * 22 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <svg viewBox="0 0 1080 1080" style={{ width: "100%", height: "100%" }}>
        <g transform={`translate(0 ${cameraY})`}>
          <circle cx={150} cy={170} r={115} fill={COLORS.creamDeep} opacity={0.55} />
          <circle cx={945} cy={130} r={75} fill={COLORS.creamDeep} opacity={0.45} />

          <ellipse cx={560} cy={925} rx={470} ry={44} fill={COLORS.shadow} opacity={0.55} />

          <Cat frame={frame} x={270} y={892} armAngle={armAngle} tailSwish={tail} earWiggle={ears} bounceY={bounceY} holdRod />

          {/* pond basin */}
          <ellipse cx={755} cy={880} rx={235} ry={52} fill={POND} stroke={POND_EDGE} strokeWidth={6} />
          <ellipse cx={755} cy={872} rx={200 + loopSin(frame, 2, 7)} ry={30} fill={COLORS.white} opacity={0.35} />

          {/* bucket (catch basket) */}
          <path d="M 405 770 L 485 770 L 473 850 L 417 850 Z" fill={COLORS.white} stroke={POND_EDGE} strokeWidth={6} strokeLinejoin="round" />
          <ellipse cx={445} cy={770} rx={40} ry={11} fill={POND} stroke={POND_EDGE} strokeWidth={5} />

          {/* fishing line + magnet */}
          <path
            d={`M ${ROD_TIP[0]} ${ROD_TIP[1]} Q ${(ROD_TIP[0] + mx) / 2} ${(ROD_TIP[1] + my) / 2 + 18} ${mx} ${my}`}
            fill="none"
            stroke={COLORS.ink}
            strokeWidth={3.5}
          />
          <g transform={`translate(${mx} ${my})`}>
            <path d="M -14 0 A 14 14 0 0 1 14 0 L 14 16 L 6 16 L 6 2 A 6 6 0 0 0 -6 2 L -6 16 L -14 16 Z" fill={MAGNET} stroke={COLORS.ink} strokeWidth={4} strokeLinejoin="round" />
            <rect x={-14} y={12} width={8} height={6} fill="#C8CDD4" stroke={COLORS.ink} strokeWidth={2.5} />
            <rect x={6} y={12} width={8} height={6} fill="#C8CDD4" stroke={COLORS.ink} strokeWidth={2.5} />
          </g>

          {/* fish — pond → magnet → bucket → hop back at celebration */}
          {Array.from({ length: 4 }, (_, k) => {
            const [sx, sy] = fishSlot(k);
            const C = catchStart(k);
            const R = releaseAt(k);
            const H = returnAt(k);

            // hopping back to the pond (celebration)
            if (frame >= H) {
              const t = clamp01((frame - H) / 12);
              const x = lerp(BUCKET[0], sx, t);
              const y = lerp(BUCKET[1] - 40, sy, t) - Math.sin(Math.PI * t) * 200;
              return <Fish key={k} x={x} y={y} color={COLORS.poms[k]} light={COLORS.pomsLight[k]} wiggle={loopSin(frame, 6, 8, k)} rotation={t * -360} />;
            }
            // waiting in the bucket (hidden below the rim)
            if (frame >= R + 6) return null;
            // falling into the bucket
            if (frame >= R) {
              const t = (frame - R) / 6;
              return <Fish key={k} x={BUCKET[0]} y={lerp(BUCKET[1] - 95, BUCKET[1] - 20, t)} color={COLORS.poms[k]} light={COLORS.pomsLight[k]} wiggle={14} rotation={t * 50} />;
            }
            // attached to the magnet
            if (frame >= C + 8 && frame < R) {
              return <Fish key={k} x={mx} y={my + 38} color={COLORS.poms[k]} light={COLORS.pomsLight[k]} wiggle={loopSin(frame, 8, 10, k)} rotation={-90} />;
            }
            // swimming in the pond
            return (
              <Fish
                key={k}
                x={sx + loopSin(frame, 1, 8, k * 1.8)}
                y={sy + loopSin(frame, 2, 4, k)}
                color={COLORS.poms[k]}
                light={COLORS.pomsLight[k]}
                wiggle={loopSin(frame, 5, 9, k * 2)}
              />
            );
          })}

          {/* pond front lip (fish sit "in" the water) */}
          <path d="M 520 880 A 235 52 0 0 0 990 880 A 235 38 0 0 1 520 880 Z" fill={POND} opacity={0.9} />

          {[
            [180, 360],
            [430, 300],
            [120, 520],
            [700, 580],
            [950, 640],
            [820, 520],
          ].map(([sx, sy], i) => (
            <Sparkle key={i} x={sx} y={sy} born={122 + i * 3} frame={frame} size={24 + (i % 3) * 8} color={i % 2 ? "#9CCFE8" : "#FFB938"} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
