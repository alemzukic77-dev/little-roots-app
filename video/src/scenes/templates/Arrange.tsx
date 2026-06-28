import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Sparkle } from "../../lib/Sparkle";
import { BEAT, COLORS, clamp01, dampedImpulse, lerp, loopSin } from "../../lib/utils";
import { CharacterView, type CharacterKind } from "./CharacterView";

export type ArrangeItem =
  | "coin" | "button" | "peg" | "toothpick" | "plate" | "flower" | "sock" | "puzzle" | "segment" | "bead" | "shape";
export type ArrangeBase = "slotbox" | "board" | "mat" | "vase" | "block" | "frame" | "object";

export type ArrangeConfig = {
  character: CharacterKind;
  item: ArrangeItem;
  base: ArrangeBase;
  colors: string[];
  baseColor?: string;
  /** label for the object base (box-house / plate-faces / egg-carton) */
  objectShape?: "box" | "plate" | "carton";
};

const placeAt = (k: number) => k * BEAT + 6;
const FLIGHT = 14;
const landAt = (k: number) => placeAt(k) + FLIGHT;
const backAt = (k: number) => 126 + k * 4;
const SRC: [number, number] = [470, 700];
const slotX = (k: number) => 660 + k * 100;
const BASE_Y = 856;

const Item: React.FC<{ kind: ArrangeItem; color: string; index: number; rot?: number }> = ({ kind, color, index, rot = 0 }) => {
  const g = (c: React.ReactNode) => <g transform={`rotate(${rot})`}>{c}</g>;
  switch (kind) {
    case "coin":
      return g(<><circle r={26} fill={color} stroke={COLORS.ink} strokeWidth={5} /><circle r={12} fill="none" stroke={COLORS.ink} strokeWidth={3} opacity={0.5} /></>);
    case "button":
      return g(<><circle r={24} fill={color} stroke={COLORS.ink} strokeWidth={5} />{[[-8,-8],[8,-8],[-8,8],[8,8]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r={3} fill={COLORS.ink} />)}</>);
    case "peg":
      return g(<><rect x={-12} y={-30} width={24} height={60} rx={8} fill={color} stroke={COLORS.ink} strokeWidth={5} /><rect x={-5} y={-20} width={10} height={30} rx={4} fill={COLORS.ink} opacity={0.35} /></>);
    case "toothpick":
      return g(<rect x={-3} y={-34} width={6} height={68} rx={3} fill={color} stroke={COLORS.ink} strokeWidth={2.5} />);
    case "plate":
      return g(<><ellipse rx={30} ry={26} fill={color} stroke={COLORS.ink} strokeWidth={5} /><ellipse rx={17} ry={14} fill="none" stroke={COLORS.ink} strokeWidth={3} opacity={0.4} /></>);
    case "flower":
      return g(<>{Array.from({length:5},(_,i)=><ellipse key={i} cx={0} cy={-16} rx={11} ry={16} fill={color} transform={`rotate(${i*72})`} />)}<circle r={9} fill="#FFB938" /></>);
    case "sock":
      return g(<path d="M -12 -30 L 12 -30 L 12 8 L 30 8 L 30 30 L -12 30 Z" fill={color} stroke={COLORS.ink} strokeWidth={5} strokeLinejoin="round" />);
    case "puzzle":
      return g(<><rect x={-24} y={-24} width={48} height={48} rx={8} fill={color} stroke={COLORS.ink} strokeWidth={5} /><circle cx={0} cy={-24} r={9} fill={color} stroke={COLORS.ink} strokeWidth={5} /></>);
    case "segment":
      return g(<path d="M -26 0 A 26 26 0 0 1 26 0 Z" fill={color} stroke={COLORS.ink} strokeWidth={5} strokeLinejoin="round" />);
    case "bead":
      return g(<><circle r={20} fill={color} stroke={COLORS.ink} strokeWidth={5} /><circle r={7} fill={COLORS.cream} /></>);
    case "shape":
      return g(<rect x={-22} y={-22} width={44} height={44} rx={10} fill={color} stroke={COLORS.ink} strokeWidth={5} />);
  }
};

const Base: React.FC<{ kind: ArrangeBase; color: string; objectShape?: string }> = ({ kind, color, objectShape }) => {
  const cx = 855;
  switch (kind) {
    case "slotbox":
      return (
        <g>
          <rect x={620} y={BASE_Y - 6} width={480} height={70} rx={14} fill={color} stroke={COLORS.ink} strokeWidth={6} />
          {[0,1,2,3].map(k=><rect key={k} x={slotX(k)-26} y={BASE_Y+2} width={52} height={8} rx={4} fill={COLORS.ink} opacity={0.5} />)}
        </g>
      );
    case "board":
      return <rect x={620} y={BASE_Y - 30} width={480} height={92} rx={16} fill={color} stroke={COLORS.ink} strokeWidth={6} />;
    case "mat":
      return <rect x={600} y={BASE_Y + 6} width={510} height={54} rx={20} fill={color} stroke={COLORS.trayRim} strokeWidth={6} />;
    case "vase":
      return (
        <g>
          <path d={`M ${cx-70} ${BASE_Y-10} L ${cx+70} ${BASE_Y-10} L ${cx+50} ${BASE_Y+110} L ${cx-50} ${BASE_Y+110} Z`} fill={color} stroke={COLORS.ink} strokeWidth={6} strokeLinejoin="round" />
          <ellipse cx={cx} cy={BASE_Y-10} rx={70} ry={16} fill={COLORS.white} opacity={0.4} />
        </g>
      );
    case "block":
      return <rect x={680} y={BASE_Y - 20} width={360} height={84} rx={14} fill={color} stroke={COLORS.ink} strokeWidth={6} />;
    case "frame":
      return <rect x={620} y={BASE_Y - 40} width={480} height={110} rx={14} fill="none" stroke={color} strokeWidth={12} />;
    case "object":
      if (objectShape === "plate")
        return (
          <g>
            <ellipse cx={cx} cy={BASE_Y + 20} rx={155} ry={125} fill={color} stroke={COLORS.ink} strokeWidth={6} />
            <ellipse cx={cx} cy={BASE_Y + 20} rx={120} ry={94} fill="none" stroke={COLORS.ink} strokeWidth={3} opacity={0.3} />
          </g>
        );
      if (objectShape === "carton")
        return <g>{[0,1,2,3].map(k=><ellipse key={k} cx={slotX(k)} cy={BASE_Y+20} rx={42} ry={34} fill={color} stroke={COLORS.ink} strokeWidth={5} />)}</g>;
      return <rect x={690} y={BASE_Y - 60} width={340} height={150} rx={18} fill={color} stroke={COLORS.ink} strokeWidth={6} />;
  }
};

// generic "place items onto a base, one per beat" template
export const Arrange: React.FC<{ config: ArrangeConfig }> = ({ config }) => {
  const frame = useCurrentFrame();
  const cameraY = loopSin(frame, 1, 8);
  const baseColor = config.baseColor ?? COLORS.tray;

  let arm: number;
  if (frame < 4 * BEAT) {
    const p = frame % BEAT;
    arm = interpolate(p, [0, 6, 12, 18, 26, BEAT], [4, 40, 20, -24, 4, 4]);
  } else {
    const wave = Math.sin((frame - 127) * 0.85) * 12 * clamp01((frame - 127) / 3) * clamp01((143 - frame) / 3);
    arm = interpolate(frame, [120, 127, 143, 150], [4, -145, -145, 4], { extrapolateRight: "clamp" }) + wave;
  }
  let impulse = loopSin(frame, 2, 6);
  for (let k = 0; k < 4; k++) impulse += dampedImpulse(frame, landAt(k), 0.85, 7) * 8;
  impulse += dampedImpulse(frame, 124, 0.7, 8) * 12;
  const bounceY = frame >= 120 ? -Math.abs(Math.sin((Math.PI * (frame - 120)) / 15)) * 22 : 0;

  const targetY = config.base === "vase" ? BASE_Y - 60 : config.base === "object" ? BASE_Y + 10 : BASE_Y + 18;

  const items = Array.from({ length: 4 }, (_, k) => {
    const P = placeAt(k);
    const B = backAt(k);
    const tx = config.base === "object" && config.objectShape === "plate" ? 800 + (k % 2) * 110 : slotX(k);
    const ty = config.base === "vase" ? targetY - k * 4 : config.base === "object" && config.objectShape === "plate" ? BASE_Y - 30 + Math.floor(k / 2) * 70 : targetY;
    if (frame >= B) {
      const t = clamp01((frame - B) / 12);
      if (t >= 1) return null;
      return { k, x: lerp(tx, SRC[0], t), y: lerp(ty, SRC[1], t) - Math.sin(Math.PI * t) * 150, rot: t * 200 };
    }
    if (frame < P) return null;
    if (frame < P + FLIGHT) {
      const t = (frame - P) / FLIGHT;
      return { k, x: lerp(SRC[0], tx, t), y: lerp(SRC[1], ty, t) - Math.sin(Math.PI * t) * 190, rot: t * 180 };
    }
    const settle = dampedImpulse(frame, P + FLIGHT, 0.9, 5) * 8;
    return { k, x: tx, y: ty + settle, rot: 0 };
  });

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

          <Base kind={config.base} color={config.base === "object" || config.base === "frame" ? (config.baseColor ?? config.colors[0]) : baseColor} objectShape={config.objectShape} />

          {items.map((it) =>
            it ? (
              <g key={it.k} transform={`translate(${it.x} ${it.y})`}>
                <Item kind={config.item} color={config.colors[it.k % config.colors.length]} index={it.k} rot={it.rot} />
              </g>
            ) : null,
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
