import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Sparkle } from "../../lib/Sparkle";
import { BEAT, COLORS, clamp01, dampedImpulse, loopSin } from "../../lib/utils";
import { CharacterView, type CharacterKind } from "./CharacterView";

export type SquishConfig = {
  character: CharacterKind;
  blob: string;
  blobLight: string;
  /** little bits that fleak out when pressed (e.g. fruit in jelly) */
  bits?: string[];
  trayColor?: string;
};

const pressAt = (k: number) => k * BEAT + 9;
const BLOB_X = 800;
const BLOB_Y = 838;

// sensory squish: a dough/goo blob squashes and springs back each beat
export const Squish: React.FC<{ config: SquishConfig }> = ({ config }) => {
  const frame = useCurrentFrame();
  const cameraY = loopSin(frame, 1, 8);

  let arm: number;
  if (frame < 4 * BEAT) {
    const p = frame % BEAT;
    arm = interpolate(p, [0, 6, 10, 16, 24, BEAT], [4, 44, 56, 10, 4, 4]);
  } else {
    const wave = Math.sin((frame - 127) * 0.85) * 12 * clamp01((frame - 127) / 3) * clamp01((143 - frame) / 3);
    arm = interpolate(frame, [120, 127, 143, 150], [4, -145, -145, 4], { extrapolateRight: "clamp" }) + wave;
  }

  // squash: per beat, the blob flattens then springs
  let squash = 0;
  for (let k = 0; k < 4; k++) {
    const t = (frame - pressAt(k)) / 14;
    if (t >= 0 && t <= 1) squash += Math.sin(Math.PI * clamp01(t)) * (1 - t * 0.3);
  }
  squash = Math.min(squash, 1);
  const sx = 1 + squash * 0.32;
  const sy = 1 - squash * 0.3;

  let impulse = loopSin(frame, 2, 6);
  for (let k = 0; k < 4; k++) impulse += dampedImpulse(frame, pressAt(k) + 2, 0.85, 7) * 8;
  impulse += dampedImpulse(frame, 124, 0.7, 8) * 12;
  const bounceY = frame >= 120 ? -Math.abs(Math.sin((Math.PI * (frame - 120)) / 15)) * 22 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <svg viewBox="0 0 1080 1080" style={{ width: "100%", height: "100%" }}>
        <g transform={`translate(0 ${cameraY})`}>
          <circle cx={150} cy={170} r={115} fill={COLORS.creamDeep} opacity={0.55} />
          <circle cx={945} cy={130} r={75} fill={COLORS.creamDeep} opacity={0.45} />
          {(config.bits ?? [config.blob]).slice(0, 3).map((c, i) => (
            <circle key={i} cx={200 + i * 320} cy={300 + loopSin(frame, 2, 13, i * 2)} r={12} fill={c} opacity={0.3} />
          ))}
          <ellipse cx={560} cy={930} rx={470} ry={44} fill={COLORS.shadow} opacity={0.55} />

          <CharacterView kind={config.character} frame={frame} arm={arm} impulse={impulse} bounceY={bounceY} x={290} y={892} />

          {/* tray */}
          <ellipse cx={BLOB_X} cy={BLOB_Y + 56} rx={180} ry={34} fill={config.trayColor ?? COLORS.white} stroke={COLORS.trayRim} strokeWidth={6} />

          {/* squishy blob */}
          <g transform={`translate(${BLOB_X} ${BLOB_Y + 40}) scale(${sx} ${sy})`}>
            <path
              d="M 0 -78 C 54 -80 92 -40 84 8 C 78 50 40 70 -12 64 C -68 56 -92 6 -78 -38 C -68 -66 -40 -76 0 -78 Z"
              fill={config.blob}
              stroke={COLORS.ink}
              strokeWidth={6}
              transform="translate(0 -2)"
            />
            <ellipse cx={-22} cy={-34} rx={30} ry={20} fill={config.blobLight} opacity={0.7} />
            {(config.bits ?? []).map((c, i) => {
              const a = (i / (config.bits!.length)) * Math.PI * 2;
              return <circle key={i} cx={Math.cos(a) * 34} cy={Math.sin(a) * 22} r={11} fill={c} stroke={COLORS.ink} strokeWidth={3} />;
            })}
          </g>

          {/* squish particles */}
          {[0,1,2,3].map((k) => {
            const t = clamp01((frame - pressAt(k)) / 12);
            if (t <= 0 || t >= 1) return null;
            return (
              <g key={k} opacity={1 - t}>
                {[0,1,2,3,4].map((i) => {
                  const a = (i / 5) * Math.PI * 2;
                  return <circle key={i} cx={BLOB_X + Math.cos(a) * (70 + t * 50)} cy={BLOB_Y - 10 + Math.sin(a) * (30 + t * 30)} r={6 * (1 - t)} fill={config.blobLight} />;
                })}
              </g>
            );
          })}

          {[
            [180, 360],[430, 300],[120, 520],[700, 540],[950, 600],[820, 480],
          ].map(([px, py], i) => (
            <Sparkle key={i} x={px} y={py} born={122 + i * 3} frame={frame} size={24 + (i % 3) * 8} color={(config.bits ?? [config.blobLight])[i % (config.bits ?? [config.blobLight]).length]} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
