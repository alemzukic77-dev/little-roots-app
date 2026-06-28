import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Sparkle } from "../../lib/Sparkle";
import { BEAT, COLORS, clamp01, dampedImpulse, loopSin } from "../../lib/utils";
import { CharacterView, type CharacterKind } from "./CharacterView";

export type TouchShape = "fabric" | "leaf" | "jar" | "blob" | "crumb" | "star" | "mirror" | "pebble";
export type TouchConfig = {
  character: CharacterKind;
  shape: TouchShape;
  colors: string[];
  /** "react" = items wiggle/sparkle as the paw passes; "clean" = items vanish (chores) */
  mode?: "react" | "clean";
  surface?: string;
  tool?: "none" | "cloth" | "broom";
};

const ITEM_X = [620, 760, 900, 1020];
const ITEM_Y = 828;

const Shape: React.FC<{ kind: TouchShape; color: string; pop: number }> = ({ kind, color, pop }) => {
  const s = 1 + pop * 0.18;
  const wig = pop * 10;
  const g = (c: React.ReactNode) => <g transform={`scale(${s}) rotate(${wig})`}>{c}</g>;
  switch (kind) {
    case "fabric":
      return g(<rect x={-34} y={-30} width={68} height={60} rx={10} fill={color} stroke={COLORS.ink} strokeWidth={5} />);
    case "leaf":
      return g(<path d="M 0 -38 Q 30 -10 0 36 Q -30 -10 0 -38 Z" fill={color} stroke={COLORS.ink} strokeWidth={4} />);
    case "jar":
      return g(<><rect x={-24} y={-26} width={48} height={56} rx={10} fill={color} stroke={COLORS.ink} strokeWidth={5} /><rect x={-20} y={-36} width={40} height={14} rx={5} fill={COLORS.trayRim} stroke={COLORS.ink} strokeWidth={4} /></>);
    case "blob":
      return g(<path d="M 0 -32 C 24 -34 38 -14 30 8 C 24 28 4 34 -16 26 C -34 18 -34 -6 -24 -20 Z" fill={color} stroke={COLORS.ink} strokeWidth={5} />);
    case "crumb":
      return g(<>{[[-10,-6],[8,-10],[-4,8],[12,4]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r={6} fill={color} />)}</>);
    case "star":
      return g(<circle r={28} fill={color} stroke={COLORS.ink} strokeWidth={5} />);
    case "mirror":
      return g(<><ellipse rx={34} ry={42} fill="#DCE8F0" stroke={COLORS.trayRim} strokeWidth={8} /><path d="M -16 -14 Q -4 -22 8 -14" fill="none" stroke={COLORS.white} strokeWidth={6} strokeLinecap="round" /></>);
    case "pebble":
      return g(<ellipse rx={30} ry={22} fill={color} stroke={COLORS.ink} strokeWidth={5} />);
  }
};

// sensory touch / chores: paw sweeps across a row; items react or get cleaned away
export const Touch: React.FC<{ config: TouchConfig }> = ({ config }) => {
  const frame = useCurrentFrame();
  const cameraY = loopSin(frame, 1, 8);
  const mode = config.mode ?? "react";

  // paw sweep position across the 4 beats
  const sweep = frame < 4 * BEAT ? interpolate(frame, [4, 4 * BEAT - 4], [0, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 3;
  const armSweep = frame < 4 * BEAT ? interpolate((frame % BEAT), [0, 15, BEAT], [-8, 8, -8]) : 0;
  let arm = 30 + armSweep;
  if (frame >= 4 * BEAT) {
    const wave = Math.sin((frame - 127) * 0.85) * 12 * clamp01((frame - 127) / 3) * clamp01((143 - frame) / 3);
    arm = interpolate(frame, [120, 127, 143, 150], [30, -140, -140, 30], { extrapolateRight: "clamp" }) + wave;
  }
  let impulse = loopSin(frame, 2, 6) + dampedImpulse(frame, 124, 0.7, 8) * 12;
  const bounceY = frame >= 120 ? -Math.abs(Math.sin((Math.PI * (frame - 120)) / 15)) * 20 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <svg viewBox="0 0 1080 1080" style={{ width: "100%", height: "100%" }}>
        <g transform={`translate(0 ${cameraY})`}>
          <circle cx={150} cy={170} r={115} fill={COLORS.creamDeep} opacity={0.55} />
          <circle cx={945} cy={130} r={75} fill={COLORS.creamDeep} opacity={0.45} />
          {config.colors.slice(0, 4).map((c, i) => (
            <circle key={i} cx={130 + i * 270} cy={300 + loopSin(frame, 2, 14, i * 1.7)} r={13} fill={c} opacity={0.3} />
          ))}
          <ellipse cx={560} cy={930} rx={470} ry={44} fill={COLORS.shadow} opacity={0.55} />

          <CharacterView kind={config.character} frame={frame} arm={arm} impulse={impulse} bounceY={bounceY} x={290} y={892} />

          {/* surface */}
          <rect x={580} y={ITEM_Y + 44} width={500} height={40} rx={14} fill={config.surface ?? COLORS.tray} stroke={COLORS.trayRim} strokeWidth={6} />

          {/* row of items */}
          {ITEM_X.map((x, k) => {
            const dist = Math.abs(sweep - k);
            const pop = clamp01(1 - dist * 1.4) * (frame < 4 * BEAT ? 1 : 0);
            const cleaned = mode === "clean" && frame < 4 * BEAT && sweep > k + 0.3;
            const reappear = mode === "clean" ? interpolate(frame, [126 + k * 4, 132 + k * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
            const op = mode === "clean" ? (cleaned ? reappear : 1) : 1;
            if (op < 0.02) return null;
            return (
              <g key={k} transform={`translate(${x} ${ITEM_Y})`} opacity={op}>
                <Shape kind={config.shape} color={config.colors[k % config.colors.length]} pop={pop} />
              </g>
            );
          })}

          {/* sparkle trail under the paw while sweeping */}
          {frame < 4 * BEAT && (
            <Sparkle x={620 + sweep * 135} y={ITEM_Y - 40} born={frame - 3} frame={frame} size={26} color={config.colors[Math.floor(sweep) % config.colors.length]} />
          )}

          {[
            [180, 360],[430, 300],[120, 520],[700, 540],[950, 600],[820, 480],
          ].map(([sx, sy], i) => (
            <Sparkle key={i} x={sx} y={sy} born={122 + i * 3} frame={frame} size={24 + (i % 3) * 8} color={config.colors[i % config.colors.length]} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
