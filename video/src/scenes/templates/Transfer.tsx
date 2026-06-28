import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Sparkle } from "../../lib/Sparkle";
import { BEAT, COLORS, clamp01, dampedImpulse, lerp, loopSin } from "../../lib/utils";
import { CharacterView, type CharacterKind } from "./CharacterView";

export type Tool = "tongs" | "spoon" | "dropper" | "sponge" | "none";

export type TransferConfig = {
  character: CharacterKind;
  tool: Tool;
  /** what travels between containers */
  item: { kind: "ball" | "drop" | "bead" | "cluster"; colors: string[]; r: number };
  /** big dough ball instead of a source bowl */
  sourceBall?: string;
  /** ice-cube tray with wells instead of a target bowl */
  targetTray?: boolean;
  accent?: string; // bowl rim color
};

const SRC: [number, number] = [565, 866];
const DST: [number, number] = [925, 866];
const pickAt = (k: number) => k * BEAT + 4;
const FLIGHT = 14;
const landAt = (k: number) => pickAt(k) + FLIGHT;
const backAt = (k: number) => 126 + k * 4;

const ItemView: React.FC<{ cfg: TransferConfig["item"]; index: number }> = ({ cfg, index }) => {
  const color = cfg.colors[index % cfg.colors.length];
  switch (cfg.kind) {
    case "ball":
      return (
        <g>
          <circle r={cfg.r} fill={color} stroke={COLORS.ink} strokeWidth={4} />
          <circle cx={-cfg.r * 0.3} cy={-cfg.r * 0.3} r={cfg.r * 0.3} fill={COLORS.white} opacity={0.5} />
        </g>
      );
    case "drop":
      return <path d={`M 0 ${-cfg.r * 1.4} Q ${cfg.r} 0 0 ${cfg.r} Q ${-cfg.r} 0 0 ${-cfg.r * 1.4} Z`} fill={color} stroke={COLORS.ink} strokeWidth={3} />;
    case "bead":
      return (
        <g>
          <circle r={cfg.r} fill={color} stroke={COLORS.ink} strokeWidth={4} />
          <circle r={cfg.r * 0.35} fill={COLORS.cream} />
        </g>
      );
    case "cluster":
      return (
        <g>
          {[-1, 0.4, 1].map((dx, i) => (
            <circle key={i} cx={dx * cfg.r * 0.8} cy={(i % 2) * cfg.r * 0.7 - cfg.r * 0.3} r={cfg.r * 0.55} fill={color} stroke={COLORS.ink} strokeWidth={3} />
          ))}
        </g>
      );
  }
};

const ToolView: React.FC<{ tool: Tool; carrying: boolean }> = ({ tool, carrying }) => {
  switch (tool) {
    case "tongs":
      return (
        <g transform="translate(0 -14)">
          <path d={`M 0 -46 L ${carrying ? -16 : -24} 12`} stroke={COLORS.trayRim} strokeWidth={9} strokeLinecap="round" fill="none" />
          <path d={`M 0 -46 L ${carrying ? 16 : 24} 12`} stroke={COLORS.trayRim} strokeWidth={9} strokeLinecap="round" fill="none" />
          <circle cx={0} cy={-46} r={8} fill={COLORS.trayRim} stroke={COLORS.ink} strokeWidth={3} />
        </g>
      );
    case "spoon":
      return (
        <g transform="rotate(-30)">
          <rect x={-4} y={-66} width={8} height={56} rx={4} fill={COLORS.trayRim} stroke={COLORS.ink} strokeWidth={3} />
          <ellipse cx={0} cy={4} rx={22} ry={15} fill={COLORS.tray} stroke={COLORS.ink} strokeWidth={3.5} />
        </g>
      );
    case "dropper":
      return (
        <g transform="rotate(15)">
          <rect x={-6} y={-50} width={12} height={44} rx={6} fill="#D8EAF4" stroke={COLORS.ink} strokeWidth={3} />
          <circle cx={0} cy={-54} r={11} fill="#9CCFE8" stroke={COLORS.ink} strokeWidth={3} />
        </g>
      );
    case "sponge":
      return <rect x={-26} y={-38} width={52} height={30} rx={9} fill="#F7D060" stroke={COLORS.ink} strokeWidth={3.5} transform="rotate(-10)" />;
    case "none":
      return null;
  }
};

// T2: move items from the left container to the right one, one per beat
export const Transfer: React.FC<{ config: TransferConfig }> = ({ config }) => {
  const frame = useCurrentFrame();
  const cameraY = loopSin(frame, 1, 8);
  const accent = config.accent ?? COLORS.trayRim;

  let arm: number;
  if (frame < 4 * BEAT) {
    const p = frame % BEAT;
    arm = interpolate(p, [0, 5, 12, 18, 26, BEAT], [4, 38, 18, -22, 4, 4]);
  } else {
    const wave = Math.sin((frame - 127) * 0.85) * 12 * clamp01((frame - 127) / 3) * clamp01((143 - frame) / 3);
    arm = interpolate(frame, [120, 127, 143, 150], [4, -145, -145, 4], { extrapolateRight: "clamp" }) + wave;
  }
  let impulse = 0;
  for (let k = 0; k < 4; k++) impulse += dampedImpulse(frame, landAt(k), 0.85, 7) * 8;
  impulse += dampedImpulse(frame, 124, 0.7, 8) * 12;
  const bounceY = frame >= 120 ? -Math.abs(Math.sin((Math.PI * (frame - 120)) / 15)) * 22 : 0;

  const targetSpot = (k: number): [number, number] =>
    config.targetTray ? [DST[0] - 78 + k * 52, DST[1] - 12] : [DST[0] - 24 + (k % 2) * 48, DST[1] - 38 - Math.floor(k / 2) * 30];

  // item state machine: source → flight → target → hop back
  const items = Array.from({ length: 4 }, (_, k) => {
    const P = pickAt(k);
    const B = backAt(k);
    const [tx, ty] = targetSpot(k);
    const srcSpot: [number, number] = config.sourceBall ? [SRC[0], SRC[1] - 70] : [SRC[0] - 30 + (k % 2) * 60, SRC[1] - 36 - Math.floor(k / 2) * 26];

    if (frame >= B) {
      const t = clamp01((frame - B) / 12);
      if (t >= 1) return { k, x: srcSpot[0], y: srcSpot[1], visible: !config.sourceBall, inFlight: false };
      return { k, x: lerp(tx, srcSpot[0], t), y: lerp(ty, srcSpot[1], t) - Math.sin(Math.PI * t) * 170, visible: true, inFlight: true };
    }
    if (frame < P) return { k, x: srcSpot[0], y: srcSpot[1], visible: !config.sourceBall, inFlight: false };
    if (frame < P + FLIGHT) {
      const t = (frame - P) / FLIGHT;
      return { k, x: lerp(srcSpot[0], tx, t), y: lerp(srcSpot[1], ty, t) - Math.sin(Math.PI * t) * 210, visible: true, inFlight: true };
    }
    const settle = dampedImpulse(frame, P + FLIGHT, 0.9, 5) * 8;
    return { k, x: tx, y: ty + settle, visible: true, inFlight: false };
  });

  // the tool follows the currently-flying item
  const flying = frame < 4 * BEAT ? items.find((i) => i.inFlight) : undefined;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <svg viewBox="0 0 1080 1080" style={{ width: "100%", height: "100%" }}>
        <g transform={`translate(0 ${cameraY})`}>
          <circle cx={150} cy={170} r={115} fill={COLORS.creamDeep} opacity={0.55} />
          <circle cx={945} cy={130} r={75} fill={COLORS.creamDeep} opacity={0.45} />
          {config.item.colors.slice(0, 4).map((c, i) => (
            <circle key={i} cx={130 + i * 270} cy={300 + loopSin(frame, 2, 14, i * 1.7)} r={13} fill={c} opacity={0.3} />
          ))}

          <ellipse cx={560} cy={928} rx={470} ry={44} fill={COLORS.shadow} opacity={0.55} />

          <CharacterView kind={config.character} frame={frame} arm={arm} impulse={impulse} bounceY={bounceY} />

          {/* source: bowl with item pile OR a big dough ball */}
          {config.sourceBall ? (
            <g transform={`translate(${SRC[0]} ${SRC[1] - 40}) scale(${1 + dampedImpulse(frame, 124, 0.7, 8) * 0.02})`}>
              <ellipse rx={75} ry={62} fill={config.sourceBall} stroke={COLORS.ink} strokeWidth={6} />
              <ellipse cx={-20} cy={-18} rx={22} ry={16} fill={COLORS.white} opacity={0.35} />
            </g>
          ) : (
            <>
              <ellipse cx={SRC[0]} cy={SRC[1]} rx={105} ry={30} fill={COLORS.white} stroke={accent} strokeWidth={6} />
              <path d={`M ${SRC[0] - 105} ${SRC[1]} A 105 30 0 0 0 ${SRC[0] + 105} ${SRC[1]} L ${SRC[0] + 88} ${SRC[1] + 38} A 88 22 0 0 1 ${SRC[0] - 88} ${SRC[1] + 38} Z`} fill={COLORS.white} stroke={accent} strokeWidth={6} />
            </>
          )}

          {/* target: bowl OR ice-cube tray */}
          {config.targetTray ? (
            <g>
              <rect x={DST[0] - 110} y={DST[1] - 26} width={220} height={56} rx={14} fill="#D8EAF4" stroke="#2E7490" strokeWidth={6} />
              {[0, 1, 2, 3].map((i) => (
                <ellipse key={i} cx={DST[0] - 78 + i * 52} cy={DST[1] + 2} rx={20} ry={12} fill="#F0F8FC" stroke="#2E7490" strokeWidth={4} />
              ))}
            </g>
          ) : (
            <>
              <ellipse cx={DST[0]} cy={DST[1]} rx={105} ry={30} fill={COLORS.white} stroke={accent} strokeWidth={6} />
              <path d={`M ${DST[0] - 105} ${DST[1]} A 105 30 0 0 0 ${DST[0] + 105} ${DST[1]} L ${DST[0] + 88} ${DST[1] + 38} A 88 22 0 0 1 ${DST[0] - 88} ${DST[1] + 38} Z`} fill={COLORS.white} stroke={accent} strokeWidth={6} />
            </>
          )}

          {/* items */}
          {items.map(({ k, x, y, visible }) =>
            visible ? (
              <g key={k} transform={`translate(${x} ${y})`}>
                <ItemView cfg={config.item} index={k} />
              </g>
            ) : null,
          )}

          {/* tool rides along with the flying item */}
          {config.tool !== "none" && (
            <g
              transform={`translate(${flying ? flying.x : SRC[0] + 40} ${(flying ? flying.y : SRC[1] - 90) - config.item.r - 6})`}
              opacity={frame >= 4 * BEAT ? 0.85 : 1}>
              <ToolView tool={config.tool} carrying={!!flying} />
            </g>
          )}

          {[
            [180, 360],
            [430, 300],
            [120, 520],
            [700, 540],
            [950, 600],
            [820, 480],
          ].map(([sx, sy], i) => (
            <Sparkle key={i} x={sx} y={sy} born={122 + i * 3} frame={frame} size={24 + (i % 3) * 8} color={config.item.colors[i % config.item.colors.length]} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
