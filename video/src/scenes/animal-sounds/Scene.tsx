import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Giraffe } from "../../characters/Giraffe";
import { Sparkle } from "../../lib/Sparkle";
import { BEAT, COLORS, clamp01, dampedImpulse, loopSin } from "../../lib/utils";

const BIRD = "#FF6D3B";
const BIRD_BELLY = "#FFE3D7";

// giraffe sings on beats 0 & 2, the little bird answers on beats 1 & 3
const giraffeSings = (frame: number) => frame < BEAT || (frame >= 2 * BEAT && frame < 3 * BEAT);
const celebration = (frame: number) => frame >= 4 * BEAT;

const Note: React.FC<{
  x: number;
  y: number;
  born: number;
  frame: number;
  color: string;
  dir: 1 | -1;
}> = ({ x, y, born, frame, color, dir }) => {
  const t = (frame - born) / 26;
  if (t < 0 || t > 1) return null;
  const o = Math.sin(Math.PI * t);
  return (
    <g
      transform={`translate(${x + dir * 55 * t} ${y - 120 * t}) rotate(${dir * 14 * t}) scale(${0.8 + t * 0.3})`}
      opacity={o}>
      <ellipse cx={0} cy={0} rx={15} ry={11} fill={color} transform="rotate(-20)" />
      <rect x={11} y={-52} width={6} height={54} rx={3} fill={color} />
      <path d="M 11 -52 Q 30 -46 34 -30 Q 24 -38 11 -38 Z" fill={color} />
    </g>
  );
};

const Bird: React.FC<{ frame: number; x: number; y: number }> = ({ frame, x, y }) => {
  // hops while answering (beats 1 & 3) and during the celebration
  const answering =
    (frame >= BEAT && frame < 2 * BEAT) || (frame >= 3 * BEAT && frame < 4 * BEAT) || celebration(frame);
  const p = frame % 15;
  const hop = answering ? -Math.abs(Math.sin((Math.PI * p) / 15)) * 22 : 0;
  const wing = answering ? Math.sin(frame * 1.1) * 22 : loopSin(frame, 3, 5);

  return (
    <g transform={`translate(${x} ${y + hop})`}>
      {/* tail feathers */}
      <path d="M -38 -28 L -64 -42 M -38 -22 L -66 -24" stroke={BIRD} strokeWidth={9} strokeLinecap="round" />
      {/* body */}
      <ellipse cx={0} cy={-34} rx={42} ry={36} fill={BIRD} stroke={COLORS.ink} strokeWidth={6} />
      <ellipse cx={6} cy={-26} rx={24} ry={20} fill={BIRD_BELLY} />
      {/* wing */}
      <g transform={`translate(-12 -40) rotate(${wing})`}>
        <ellipse cx={-8} cy={10} rx={14} ry={22} fill={BIRD} stroke={COLORS.ink} strokeWidth={5} />
      </g>
      {/* eye + beak */}
      <circle cx={20} cy={-46} r={6.5} fill={COLORS.ink} />
      <path d="M 38 -42 L 56 -36 L 38 -30 Z" fill="#FFB938" stroke={COLORS.ink} strokeWidth={4} strokeLinejoin="round" />
      {/* legs */}
      <path d="M -8 0 L -8 12 M 12 0 L 12 12" stroke={COLORS.ink} strokeWidth={5} strokeLinecap="round" />
    </g>
  );
};

export const AnimalSounds: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraY = loopSin(frame, 1, 8);

  const singing = giraffeSings(frame) || celebration(frame);
  // mouth envelope inside each singing beat (closes by beat end → loop-safe)
  const beatP = frame % BEAT;
  const env = singing
    ? celebration(frame)
      ? clamp01((frame - 122) / 5) * clamp01((148 - frame) / 5)
      : Math.sin((Math.PI * beatP) / BEAT)
    : 0;
  const mouthOpen = env * (0.65 + loopSin(frame, 10, 0.3));

  const neckSway = loopSin(frame, 1, 3.5) + dampedImpulse(frame, 0, 0.5, 10) * 0;
  const nod = env * loopSin(frame, 10, 4) - env * 5;

  const bounceY = celebration(frame) ? -Math.abs(Math.sin((Math.PI * (frame - 120)) / 15)) * 18 : 0;

  // giraffe notes: 3 per singing beat; bird notes: 2 per answering beat
  const giraffeNoteBirths = [6, 13, 20, 66, 73, 80, 124, 130, 136];
  const birdNoteBirths = [36, 44, 96, 104, 128, 134];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <svg viewBox="0 0 1080 1080" style={{ width: "100%", height: "100%" }}>
        <g transform={`translate(0 ${cameraY})`}>
          <circle cx={160} cy={170} r={110} fill={COLORS.creamDeep} opacity={0.55} />
          <circle cx={950} cy={140} r={70} fill={COLORS.creamDeep} opacity={0.45} />

          <ellipse cx={540} cy={930} rx={460} ry={44} fill={COLORS.shadow} opacity={0.55} />

          <Giraffe
            frame={frame}
            x={320}
            y={892}
            neckSway={neckSway}
            nod={nod}
            mouthOpen={mouthOpen}
            bounceY={bounceY}
          />

          {/* bird perch */}
          <ellipse cx={835} cy={882} rx={95} ry={34} fill={COLORS.creamDeep} stroke={COLORS.trayRim} strokeWidth={6} />
          <Bird frame={frame} x={835} y={862} />

          {/* notes */}
          {giraffeNoteBirths.map((b, i) => (
            <Note key={`g${i}`} x={475} y={300} born={b} frame={frame} color={COLORS.poms[i % 4]} dir={1} />
          ))}
          {birdNoteBirths.map((b, i) => (
            <Note key={`b${i}`} x={865} y={790} born={b} frame={frame} color={COLORS.poms[(i + 2) % 4]} dir={-1} />
          ))}

          {[
            [200, 300],
            [560, 240],
            [700, 420],
            [980, 560],
            [420, 500],
            [880, 320],
          ].map(([sx, sy], i) => (
            <Sparkle key={i} x={sx} y={sy} born={122 + i * 3} frame={frame} size={22 + (i % 3) * 8} color={COLORS.poms[i % 4]} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
