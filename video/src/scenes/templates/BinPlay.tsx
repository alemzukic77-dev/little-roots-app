import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bunny } from "../../characters/Bunny";
import { Cat } from "../../characters/Cat";
import { Fox } from "../../characters/Fox";
import { Lion } from "../../characters/Lion";
import { Monkey } from "../../characters/Monkey";
import { Penguin } from "../../characters/Penguin";
import { Sparkle } from "../../lib/Sparkle";
import { BEAT, COLORS, clamp01, dampedImpulse, loopSin } from "../../lib/utils";

export type CharacterKind = "bunny" | "penguin" | "lion" | "monkey" | "fox" | "cat";
export type ItemShape = "dot" | "flake" | "strip" | "pearl" | "penne";

export type BinPlayConfig = {
  character: CharacterKind;
  /** bin contents surface */
  fill: string;
  fillLight: string;
  /** colors of the items that fountain out of the bin */
  itemColors: string[];
  itemShape: ItemShape;
  /** bin shell + rim */
  binColor?: string;
  binEdge?: string;
};

const digAt = (k: number) => k * BEAT + 10;
const BIN = { x: 760, y: 840, rx: 230, ry: 50 };

const Item: React.FC<{ shape: ItemShape; color: string; rotation: number }> = ({ shape, color, rotation }) => {
  switch (shape) {
    case "dot":
      return <circle r={14} fill={color} stroke={COLORS.ink} strokeWidth={3.5} />;
    case "flake":
      return <ellipse rx={16} ry={10} fill={color} stroke={COLORS.ink} strokeWidth={3} transform={`rotate(${rotation})`} />;
    case "strip":
      return <rect x={-19} y={-8} width={38} height={16} rx={6} fill={color} stroke={COLORS.ink} strokeWidth={3} transform={`rotate(${rotation})`} />;
    case "pearl":
      return (
        <g>
          <circle r={15} fill={color} opacity={0.75} stroke={COLORS.ink} strokeWidth={3} />
          <circle cx={-5} cy={-5} r={4.5} fill={COLORS.white} opacity={0.9} />
        </g>
      );
    case "penne":
      return (
        <g transform={`rotate(${rotation})`}>
          <rect x={-20} y={-12} width={40} height={24} rx={9} fill={color} stroke={COLORS.ink} strokeWidth={3.5} />
        </g>
      );
  }
};

const CharacterView: React.FC<{
  kind: CharacterKind;
  frame: number;
  arm: number;
  impulse: number;
  bounceY: number;
}> = ({ kind, frame, arm, impulse, bounceY }) => {
  const x = 285;
  const y = 892;
  switch (kind) {
    case "bunny":
      return <Bunny frame={frame} x={x} y={y} earWiggle={impulse} rightArmAngle={arm} leftArmAngle={8 + loopSin(frame, 3, 3)} bounceY={bounceY} />;
    case "penguin":
      return <Penguin frame={frame} x={x} y={y} rock={impulse * 0.5} flipperR={arm + 12} flipperL={-12 - loopSin(frame, 3, 4)} bounceY={bounceY} />;
    case "lion":
      return <Lion frame={frame} x={x} y={y} pawAngle={arm} tailSwish={loopSin(frame, 2, 10) + impulse} bounceY={bounceY} />;
    case "monkey":
      return <Monkey frame={frame} x={x} y={y} chopAngle={arm} earWiggle={impulse} bounceY={bounceY} />;
    case "fox":
      return <Fox frame={frame} x={x} y={y} armAngle={arm} tailSwish={loopSin(frame, 2, 9) + impulse} earWiggle={impulse * 0.8} bounceY={bounceY} />;
    case "cat":
      return <Cat frame={frame} x={x} y={y} armAngle={arm} tailSwish={loopSin(frame, 2, 9) + impulse} earWiggle={impulse * 0.8} bounceY={bounceY} />;
  }
};

// generic "dig & fountain" sensory-bin scene, parameterized per activity
export const BinPlay: React.FC<{ config: BinPlayConfig }> = ({ config }) => {
  const frame = useCurrentFrame();
  const cameraY = loopSin(frame, 1, 8);
  const binColor = config.binColor ?? COLORS.white;
  const binEdge = config.binEdge ?? COLORS.trayRim;

  // arm: reach into the bin then scoop up, once per beat
  let arm: number;
  if (frame < 4 * BEAT) {
    const p = frame % BEAT;
    arm = interpolate(p, [0, 6, 12, 18, 26, BEAT], [4, 42, 56, -28, 4, 4]);
  } else {
    const wave = Math.sin((frame - 127) * 0.85) * 12 * clamp01((frame - 127) / 3) * clamp01((143 - frame) / 3);
    arm = interpolate(frame, [120, 127, 143, 150], [4, -145, -145, 4], { extrapolateRight: "clamp" }) + wave;
  }

  let impulse = 0;
  for (let k = 0; k < 4; k++) impulse += dampedImpulse(frame, digAt(k) + 4, 0.85, 7) * 8;
  impulse += dampedImpulse(frame, 124, 0.7, 8) * 12;

  const bounceY = frame >= 120 ? -Math.abs(Math.sin((Math.PI * (frame - 120)) / 15)) * 22 : 0;

  // fountains: bursts of items arcing out of the bin and falling back in
  const bursts: { born: number; n: number }[] = [
    ...Array.from({ length: 4 }, (_, k) => ({ born: digAt(k) + 4, n: 6 })),
    { born: 124, n: 10 },
    { born: 133, n: 8 },
  ];
  const FLIGHT = 18;

  const surfaceWobble = impulse * 0.8;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <svg viewBox="0 0 1080 1080" style={{ width: "100%", height: "100%" }}>
        <g transform={`translate(0 ${cameraY})`}>
          <circle cx={150} cy={170} r={115} fill={COLORS.creamDeep} opacity={0.55} />
          <circle cx={945} cy={130} r={75} fill={COLORS.creamDeep} opacity={0.45} />
          {config.itemColors.slice(0, 4).map((c, i) => (
            <circle key={i} cx={130 + i * 270} cy={300 + loopSin(frame, 2, 14, i * 1.7)} r={13} fill={c} opacity={0.3} />
          ))}

          <ellipse cx={550} cy={930} rx={470} ry={44} fill={COLORS.shadow} opacity={0.55} />

          <CharacterView kind={config.character} frame={frame} arm={arm} impulse={impulse} bounceY={bounceY} />

          {/* bin shell (back) */}
          <ellipse cx={BIN.x} cy={BIN.y - 52} rx={BIN.rx} ry={BIN.ry} fill={binColor} stroke={binEdge} strokeWidth={6} />

          {/* fountain items behind the front wall */}
          {bursts.map((b, bi) =>
            Array.from({ length: b.n }, (_, i) => {
              const t = (frame - b.born) / FLIGHT;
              if (t < 0 || t > 1) return null;
              const spread = (i / (b.n - 1) - 0.5) * 2; // -1..1
              const x = BIN.x + spread * 150 * t + Math.sin(i * 2.1) * 14;
              const h = 190 + (i % 3) * 55;
              const y = BIN.y - 70 - Math.sin(Math.PI * t) * h;
              return (
                <g key={`${bi}-${i}`} transform={`translate(${x} ${y})`}>
                  <Item shape={config.itemShape} color={config.itemColors[i % config.itemColors.length]} rotation={t * 360 + i * 50} />
                </g>
              );
            }),
          )}

          {/* bin contents surface */}
          <ellipse
            cx={BIN.x}
            cy={BIN.y - 56 + loopSin(frame, 2, 3)}
            rx={BIN.rx - 22}
            ry={BIN.ry - 14 + surfaceWobble}
            fill={config.fill}
          />
          {/* scattered surface items */}
          {Array.from({ length: 7 }, (_, i) => (
            <g
              key={i}
              transform={`translate(${BIN.x - 160 + i * 53} ${BIN.y - 60 + Math.sin(i * 2.7) * 12 + loopSin(frame, 2, 3, i)})`}>
              <Item shape={config.itemShape} color={config.itemColors[i % config.itemColors.length]} rotation={i * 40} />
            </g>
          ))}
          <ellipse cx={BIN.x - 60} cy={BIN.y - 66} rx={90} ry={14} fill={config.fillLight} opacity={0.6} />

          {/* bin front wall */}
          <path
            d={`M ${BIN.x - BIN.rx} ${BIN.y - 52} A ${BIN.rx} ${BIN.ry} 0 0 0 ${BIN.x + BIN.rx} ${BIN.y - 52} L ${BIN.x + BIN.rx - 18} ${BIN.y + 36} A ${BIN.rx - 40} ${BIN.ry - 14} 0 0 1 ${BIN.x - BIN.rx + 18} ${BIN.y + 36} Z`}
            fill={binColor}
            stroke={binEdge}
            strokeWidth={6}
          />

          {[
            [180, 360],
            [430, 300],
            [120, 520],
            [700, 540],
            [950, 600],
            [820, 480],
          ].map(([sx, sy], i) => (
            <Sparkle key={i} x={sx} y={sy} born={122 + i * 3} frame={frame} size={24 + (i % 3) * 8} color={config.itemColors[i % config.itemColors.length]} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
