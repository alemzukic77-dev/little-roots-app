import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Sparkle } from "../../lib/Sparkle";
import { BEAT, COLORS, clamp01, loopSin } from "../../lib/utils";
import { CharacterView, type CharacterKind } from "./CharacterView";

export type MarkKind = "stamp" | "ring" | "blob" | "lines" | "cotton" | "tissue" | "leaf";
export type StampShape = "circle" | "star" | "flower" | "heart";
export type PaperKind = "white" | "black" | "kraft" | "blue";

export type StampPaintConfig = {
  character: CharacterKind;
  mark: MarkKind;
  shape?: StampShape; // for mark = "stamp"
  colors: string[];
  paper?: PaperKind;
};

const PAPER_BG: Record<PaperKind, { fill: string; border: string }> = {
  white: { fill: "#FFFFFF", border: "#EFE6DE" },
  black: { fill: "#2C2A30", border: "#1C1A20" },
  kraft: { fill: "#D8B98A", border: "#C2A270" },
  blue: { fill: "#CDE3F2", border: "#A9CDE6" },
};

const stampAt = (k: number) => k * BEAT + 13;
// paper sits on the right; character (left) faces it and stamps left→right
const PAPER_X = 470;
const PAPER_W = 580;
const SPOTS: [number, number][] = [
  [578, 824],
  [726, 872],
  [874, 824],
  [1010, 872],
];

const starPath = (r: number) => {
  let d = "";
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.46;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    d += `${i === 0 ? "M" : "L"} ${Math.cos(a) * rad} ${Math.sin(a) * rad} `;
  }
  return d + "Z";
};

const Mark: React.FC<{ cfg: StampPaintConfig; index: number; scale: number }> = ({ cfg, index, scale }) => {
  const color = cfg.colors[index % cfg.colors.length];
  const rot = (index * 47) % 360;
  const g = (children: React.ReactNode, extraRot = 0) => (
    <g transform={`rotate(${rot + extraRot}) scale(${scale})`}>{children}</g>
  );

  switch (cfg.mark) {
    case "stamp": {
      const r = 30;
      if (cfg.shape === "star") return g(<path d={starPath(r)} fill={color} />);
      if (cfg.shape === "heart")
        return g(<path d={`M 0 ${r * 0.7} C ${-r * 1.3} ${-r * 0.3} ${-r * 0.5} ${-r} 0 ${-r * 0.35} C ${r * 0.5} ${-r} ${r * 1.3} ${-r * 0.3} 0 ${r * 0.7} Z`} fill={color} />);
      if (cfg.shape === "flower")
        return g(
          <>
            {Array.from({ length: 5 }, (_, i) => (
              <ellipse key={i} cx={0} cy={-18} rx={12} ry={18} fill={color} transform={`rotate(${i * 72})`} />
            ))}
            <circle r={9} fill="#FFB938" />
          </>,
        );
      return g(<circle r={r} fill={color} />);
    }
    case "ring":
      return g(<circle r={28} fill="none" stroke={color} strokeWidth={10} />);
    case "blob":
      return g(
        <path
          d="M 0 -30 C 22 -32 36 -14 30 6 C 26 26 8 34 -12 28 C -32 22 -34 -2 -24 -18 C -18 -28 -10 -29 0 -30 Z"
          fill={color}
          opacity={0.92}
        />,
      );
    case "lines":
      return g(
        <>
          {[-18, -6, 6, 18].map((dx) => (
            <rect key={dx} x={dx - 3} y={-26} width={6} height={52} rx={3} fill={color} />
          ))}
        </>,
      );
    case "cotton":
      return g(
        <>
          {Array.from({ length: 6 }, (_, i) => {
            const a = (i / 6) * Math.PI * 2;
            return <circle key={i} cx={Math.cos(a) * 16} cy={Math.sin(a) * 16} r={15} fill={color} />;
          })}
          <circle r={18} fill={color} />
        </>,
      );
    case "tissue":
      return g(<rect x={-26} y={-26} width={52} height={52} rx={8} fill={color} opacity={0.7} />);
    case "leaf":
      return g(
        <path d="M 0 -34 Q 26 -10 0 32 Q -26 -10 0 -34 Z" fill={color} stroke={COLORS.ink} strokeWidth={3}>
          <title />
        </path>,
      );
  }
};

// T3: character stamps/paints; marks accumulate on a sheet, then it swaps for a fresh one.
export const StampPaint: React.FC<{ config: StampPaintConfig }> = ({ config }) => {
  const frame = useCurrentFrame();
  const cameraY = loopSin(frame, 1, 8);
  const paper = PAPER_BG[config.paper ?? "white"];

  // stamping arm motion (raise → press → rest), once per beat
  let arm = 0;
  if (frame < 4 * BEAT) {
    const p = frame % BEAT;
    arm = interpolate(p, [0, 5, 11, 15, 21, BEAT], [0, -52, -52, 34, 0, 0]);
  } else {
    const wave = Math.sin((frame - 127) * 0.85) * 12 * clamp01((frame - 127) / 3) * clamp01((143 - frame) / 3);
    arm = interpolate(frame, [120, 127, 143, 150], [0, -140, -140, 0], { extrapolateRight: "clamp" }) + wave;
  }
  let impulse = loopSin(frame, 2, 8);
  for (let k = 0; k < 4; k++) impulse += clamp01(1 - Math.abs(frame - stampAt(k)) / 5) * 8;
  const bounceY = frame >= 120 ? -Math.abs(Math.sin((Math.PI * (frame - 120)) / 15)) * 24 : 0;

  const sheetOut = interpolate(frame, [128, 148], [0, -880], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sheetIn = interpolate(frame, [128, 148], [880, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const Paper: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
    <g>
      <rect x={PAPER_X} y={770} width={PAPER_W} height={185} rx={22} fill={paper.fill} stroke={paper.border} strokeWidth={5} />
      {children}
    </g>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <svg viewBox="0 0 1080 1080" style={{ width: "100%", height: "100%" }}>
        <g transform={`translate(0 ${cameraY})`}>
          <circle cx={150} cy={170} r={115} fill={COLORS.creamDeep} opacity={0.55} />
          <circle cx={945} cy={130} r={75} fill={COLORS.creamDeep} opacity={0.45} />
          {config.colors.slice(0, 4).map((c, i) => (
            <circle key={i} cx={130 + i * 270} cy={300 + loopSin(frame, 2, 14, i * 1.7)} r={13} fill={c} opacity={0.3} />
          ))}

          <ellipse cx={540} cy={935} rx={465} ry={42} fill={COLORS.shadow} opacity={0.55} />

          {/* fresh sheet arriving */}
          <g transform={`translate(${sheetIn} 0)`}>{frame >= 128 && <Paper />}</g>

          {/* current sheet with accumulating marks */}
          <g transform={`translate(${sheetOut} 0)`}>
            <Paper>
              {SPOTS.map(([px, py], k) => {
                const s = interpolate(frame, [stampAt(k), stampAt(k) + 4, stampAt(k) + 7], [0, 1.25, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                return s > 0 ? (
                  <g key={k} transform={`translate(${px} ${py})`}>
                    <Mark cfg={config} index={k} scale={s} />
                  </g>
                ) : null;
              })}
            </Paper>
          </g>

          {/* paint splat on each stamp */}
          {SPOTS.map(([px, py], k) => {
            const t = clamp01((frame - stampAt(k)) / 9);
            if (t <= 0 || t >= 1) return null;
            return (
              <g key={k} opacity={1 - t}>
                {[0, 1, 2, 3].map((i) => {
                  const a = (i / 4) * Math.PI * 2 + 0.6;
                  return (
                    <circle
                      key={i}
                      cx={px + Math.cos(a) * (30 + t * 46)}
                      cy={py - 10 + Math.sin(a) * (22 + t * 34)}
                      r={6 * (1 - t)}
                      fill={config.colors[k % config.colors.length]}
                    />
                  );
                })}
              </g>
            );
          })}

          <CharacterView kind={config.character} frame={frame} arm={arm} impulse={impulse} bounceY={bounceY} x={290} y={892} />

          {[
            [180, 360],
            [430, 300],
            [120, 520],
            [700, 540],
            [950, 600],
            [820, 480],
          ].map(([sx, sy], i) => (
            <Sparkle key={i} x={sx} y={sy} born={122 + i * 3} frame={frame} size={24 + (i % 3) * 8} color={config.colors[i % config.colors.length]} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
