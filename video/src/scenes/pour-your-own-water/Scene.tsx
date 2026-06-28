import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Elephant } from "../../characters/Elephant";
import { Sparkle } from "../../lib/Sparkle";
import { BEAT, COLORS, clamp01, dampedImpulse, loopSin } from "../../lib/utils";

const WATER = "#9CCFE8";
const WATER_LIGHT = "#C9E6F2";
const GLASS_X = 905;
const GLASS_TOP = 760;
const GLASS_H = 130;

const pourStart = (k: number) => k * BEAT + 8;
const pourEnd = (k: number) => k * BEAT + 22;

function waterLevel(frame: number): number {
  // fills a quarter per pour, drains while the elephant "drinks" in the celebration
  if (frame >= 128) return interpolate(frame, [128, 146], [1, 0], { extrapolateRight: "clamp" });
  let level = 0;
  for (let k = 0; k < 4; k++) {
    if (frame >= pourEnd(k)) level = (k + 1) / 4;
    else if (frame >= pourStart(k)) level = k / 4 + ((frame - pourStart(k)) / (pourEnd(k) - pourStart(k))) / 4;
  }
  return level;
}

export const PourYourOwnWater: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraY = loopSin(frame, 1, 8);

  const pouring = frame < 4 * BEAT && frame % BEAT >= 8 && frame % BEAT < 22;
  const level = waterLevel(frame);

  // pitcher tilt within each beat (clockwise — spout dips toward the glass)
  const p = frame % BEAT;
  const tilt = frame < 4 * BEAT ? interpolate(p, [4, 8, 22, 27, BEAT], [0, 36, 36, 0, 0], { extrapolateLeft: "clamp" }) : 0;

  // celebration: trunk reaches the glass and drinks
  const drink = frame >= 120 ? clamp01((frame - 120) / 8) * clamp01((148 - frame) / 4) : 0;
  const trunkCurl = 0.15 + drink * 0.8;
  const earFlap = loopSin(frame, 2, 4) + dampedImpulse(frame, 124, 0.7, 8) * 8;
  const bounceY = frame >= 120 ? -Math.abs(Math.sin((Math.PI * (frame - 120)) / 15)) * 10 : 0;

  const armAngle = frame < 4 * BEAT ? interpolate(p, [0, 6, 12, 24, BEAT], [-30, -52, -52, -30, -30]) : -20;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <svg viewBox="0 0 1080 1080" style={{ width: "100%", height: "100%" }}>
        <g transform={`translate(0 ${cameraY})`}>
          <circle cx={150} cy={170} r={115} fill={COLORS.creamDeep} opacity={0.55} />
          <circle cx={945} cy={130} r={75} fill={COLORS.creamDeep} opacity={0.45} />
          {[WATER, WATER_LIGHT, WATER].map((c, i) => (
            <circle key={i} cx={200 + i * 330} cy={290 + loopSin(frame, 2, 13, i * 2.1)} r={12} fill={c} opacity={0.4} />
          ))}

          <ellipse cx={560} cy={928} rx={470} ry={44} fill={COLORS.shadow} opacity={0.55} />

          {/* low table */}
          <rect x={560} y={890} width={460} height={26} rx={12} fill={COLORS.tray} stroke={COLORS.trayRim} strokeWidth={5} />
          <rect x={600} y={912} width={20} height={50} rx={8} fill={COLORS.trayRim} />
          <rect x={960} y={912} width={20} height={50} rx={8} fill={COLORS.trayRim} />

          <Elephant
            frame={frame}
            x={290}
            y={892}
            armAngle={armAngle}
            trunkCurl={trunkCurl}
            earFlap={earFlap}
            bounceY={bounceY}
          />

          {/* glass with rising water */}
          <g>
            <rect x={GLASS_X - 52} y={GLASS_TOP} width={104} height={GLASS_H} rx={12} fill={COLORS.white} opacity={0.55} stroke="#2E7490" strokeWidth={6} />
            {level > 0.02 && (
              <rect
                x={GLASS_X - 44}
                y={GLASS_TOP + GLASS_H - 10 - (GLASS_H - 22) * level}
                width={88}
                height={(GLASS_H - 22) * level}
                rx={8}
                fill={WATER}
              />
            )}
            {level > 0.02 && (
              <ellipse cx={GLASS_X} cy={GLASS_TOP + GLASS_H - 10 - (GLASS_H - 22) * level} rx={44} ry={7 + loopSin(frame, 3, 2)} fill={WATER_LIGHT} />
            )}
          </g>

          {/* pitcher — spout faces the glass, tilts to pour */}
          <g transform={`translate(700 690) rotate(${tilt})`}>
            <path d="M -55 -45 L 55 -45 L 44 55 Q 0 70 -44 55 Z" fill={COLORS.white} stroke="#2E7490" strokeWidth={6} strokeLinejoin="round" />
            <path d="M 55 -45 L 82 -62 L 76 -38 Z" fill={COLORS.white} stroke="#2E7490" strokeWidth={6} strokeLinejoin="round" />
            <path d="M -55 -30 Q -95 -20 -60 25" fill="none" stroke="#2E7490" strokeWidth={9} strokeLinecap="round" />
            <rect x={-42} y={-30} width={84} height={28} rx={10} fill={WATER_LIGHT} opacity={0.8} />
          </g>

          {/* water stream while pouring */}
          {pouring && (
            <>
              <path
                d={`M 790 705 Q ${(790 + GLASS_X) / 2} ${720} ${GLASS_X} ${GLASS_TOP + 14}`}
                fill="none"
                stroke={WATER}
                strokeWidth={11}
                strokeLinecap="round"
                opacity={0.9}
              />
              {[0, 1, 2].map((i) => {
                const t = ((frame * 1.6 + i * 11) % 30) / 30;
                const sx = 790 + (GLASS_X - 790) * t;
                const sy = 705 + (GLASS_TOP + 14 - 705) * t + Math.sin(Math.PI * t) * 16;
                return <circle key={i} cx={sx} cy={sy + 10} r={5} fill={WATER_LIGHT} />;
              })}
            </>
          )}

          {/* trunk-tip "slurp" bubbles while drinking */}
          {drink > 0.5 &&
            [0, 1, 2].map((i) => (
              <circle
                key={i}
                cx={GLASS_X - 20 + i * 18}
                cy={GLASS_TOP - 14 - ((frame * 2 + i * 9) % 26)}
                r={4 + (i % 2) * 2}
                fill={WATER_LIGHT}
                opacity={0.8}
              />
            ))}

          {[
            [180, 360],
            [430, 300],
            [120, 520],
            [700, 500],
            [1000, 560],
            [840, 420],
          ].map(([sx, sy], i) => (
            <Sparkle key={i} x={sx} y={sy} born={122 + i * 3} frame={frame} size={24 + (i % 3) * 8} color={i % 2 ? WATER : "#FFB938"} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
