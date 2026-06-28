import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Hedgehog } from "../../characters/Hedgehog";
import { Sparkle } from "../../lib/Sparkle";
import { BEAT, COLORS, clamp01, dampedImpulse, loopSin } from "../../lib/utils";

const WATER = "#9CCFE8";
const POT = "#D85A30";
const POT_DARK = "#993C1D";
const STEM = "#3E7A4E";
const LEAF = "#5C9A6B";
const PETAL = "#F08BAE";
const PETAL_IN = "#FFB938";

const POT_X = 800;
const POT_TOP = 800;

const waterAt = (k: number) => k * BEAT + 8;

export const PlantWatering: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraY = loopSin(frame, 1, 8);

  // growth: stem rises with each watering, bloom opens at the end, shrinks back for the loop
  const grow =
    frame < 132
      ? interpolate(frame, [14, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : interpolate(frame, [132, 148], [1, 0], { extrapolateRight: "clamp" });
  const stemH = 40 + grow * 190;
  const leafScale = clamp01((grow - 0.3) / 0.25);
  const bloom = clamp01((grow - 0.72) / 0.28);
  const sway = loopSin(frame, 2, 3 + grow * 3);

  // watering can tilts over the pot once per beat
  const p = frame % BEAT;
  const tilt = frame < 4 * BEAT ? interpolate(p, [4, 8, 20, 26, BEAT], [0, 30, 30, 0, 0], { extrapolateLeft: "clamp" }) : 0;
  const watering = frame < 4 * BEAT && p >= 8 && p < 20;

  let arm = frame < 4 * BEAT ? interpolate(p, [0, 6, 12, 24, BEAT], [-26, -48, -48, -26, -26]) : -20;
  if (frame >= 4 * BEAT) {
    const wave = Math.sin((frame - 127) * 0.85) * 12 * clamp01((frame - 127) / 3) * clamp01((143 - frame) / 3);
    arm = interpolate(frame, [120, 127, 143, 150], [-26, -140, -140, -26], { extrapolateRight: "clamp" }) + wave;
  }
  let spikes = 0;
  for (let k = 0; k < 4; k++) spikes += dampedImpulse(frame, waterAt(k) + 8, 0.85, 7) * 7;
  spikes += dampedImpulse(frame, 124, 0.7, 8) * 11;
  const bounceY = frame >= 120 ? -Math.abs(Math.sin((Math.PI * (frame - 120)) / 15)) * 20 : 0;

  const headY = POT_TOP - 24 - stemH;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <svg viewBox="0 0 1080 1080" style={{ width: "100%", height: "100%" }}>
        <g transform={`translate(0 ${cameraY})`}>
          <circle cx={150} cy={170} r={115} fill={COLORS.creamDeep} opacity={0.55} />
          <circle cx={945} cy={130} r={75} fill={COLORS.creamDeep} opacity={0.45} />
          {[PETAL, WATER, LEAF].map((c, i) => (
            <circle key={i} cx={200 + i * 330} cy={290 + loopSin(frame, 2, 13, i * 2.1)} r={12} fill={c} opacity={0.35} />
          ))}

          <ellipse cx={550} cy={928} rx={470} ry={44} fill={COLORS.shadow} opacity={0.55} />

          <Hedgehog frame={frame} x={300} y={892} armAngle={arm} spikeWiggle={spikes} bounceY={bounceY} />

          {/* flower — stem, leaves, bloom (grows with watering) */}
          <g transform={`translate(${POT_X} ${POT_TOP - 24})`}>
            <path d={`M 0 0 Q ${sway} ${-stemH / 2} ${sway * 1.6} ${-stemH}`} fill="none" stroke={STEM} strokeWidth={11} strokeLinecap="round" />
            {leafScale > 0.01 && (
              <>
                <g transform={`translate(${sway * 0.5} ${-stemH * 0.45}) scale(${leafScale})`}>
                  <path d="M 0 0 Q -42 -8 -52 -38 Q -18 -34 0 0 Z" fill={LEAF} stroke={COLORS.ink} strokeWidth={4} strokeLinejoin="round" />
                </g>
                <g transform={`translate(${sway * 0.7} ${-stemH * 0.62}) scale(${leafScale})`}>
                  <path d="M 0 0 Q 42 -8 52 -38 Q 18 -34 0 0 Z" fill={LEAF} stroke={COLORS.ink} strokeWidth={4} strokeLinejoin="round" />
                </g>
              </>
            )}
            {/* bloom */}
            <g transform={`translate(${sway * 1.6} ${-stemH})`}>
              {bloom > 0.01 &&
                Array.from({ length: 6 }, (_, i) => {
                  const a = (i / 6) * 360 + bloom * 30;
                  return (
                    <g key={i} transform={`rotate(${a}) scale(${bloom})`}>
                      <ellipse cx={0} cy={-30} rx={16} ry={26} fill={PETAL} stroke={COLORS.ink} strokeWidth={4} />
                    </g>
                  );
                })}
              <circle r={14 + bloom * 6} fill={bloom > 0.4 ? PETAL_IN : "#7FB089"} stroke={COLORS.ink} strokeWidth={4} />
            </g>
          </g>

          {/* pot (in front of the stem base) */}
          <path d={`M ${POT_X - 85} ${POT_TOP} L ${POT_X + 85} ${POT_TOP} L ${POT_X + 62} ${POT_TOP + 105} L ${POT_X - 62} ${POT_TOP + 105} Z`} fill={POT} stroke={COLORS.ink} strokeWidth={6} strokeLinejoin="round" />
          <rect x={POT_X - 92} y={POT_TOP - 24} width={184} height={30} rx={10} fill={POT_DARK} stroke={COLORS.ink} strokeWidth={6} />

          {/* watering can — tilts over the pot */}
          <g transform={`translate(620 620) rotate(${tilt})`}>
            <path d="M -50 -35 L 50 -35 L 42 48 Q 0 60 -42 48 Z" fill={WATER} stroke="#2E7490" strokeWidth={6} strokeLinejoin="round" />
            <path d="M 46 -20 L 108 -52 L 112 -40 L 56 -4 Z" fill={WATER} stroke="#2E7490" strokeWidth={5} strokeLinejoin="round" />
            <path d="M -18 -35 Q 0 -68 18 -35" fill="none" stroke="#2E7490" strokeWidth={8} strokeLinecap="round" />
            <circle cx={112} cy={-48} r={11} fill={WATER} stroke="#2E7490" strokeWidth={5} />
          </g>

          {/* falling drops while watering */}
          {watering &&
            [0, 1, 2].map((i) => {
              const t = ((frame * 2 + i * 9) % 24) / 24;
              return (
                <path
                  key={i}
                  d={`M 0 -8 Q 6 0 0 6 Q -6 0 0 -8 Z`}
                  transform={`translate(${732 + i * 22 + Math.sin(i * 3) * 8} ${585 + t * 180})`}
                  fill={WATER}
                  opacity={1 - t * 0.4}
                />
              );
            })}

          {[
            [180, 340],
            [430, 280],
            [120, 500],
            [660, 460],
            [980, 520],
            [860, 380],
          ].map(([sx, sy], i) => (
            <Sparkle key={i} x={sx} y={sy} born={122 + i * 3} frame={frame} size={24 + (i % 3) * 8} color={[PETAL, PETAL_IN, WATER, LEAF][i % 4]} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
