import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Lion } from "../../characters/Lion";
import { Sparkle } from "../../lib/Sparkle";
import { BEAT, COLORS, clamp01, dampedImpulse, loopSin } from "../../lib/utils";

const stampAt = (k: number) => k * BEAT + 13;
const PRINTS: [number, number][] = [
  [520, 822],
  [398, 874],
  [276, 824],
  [158, 872],
];

const PawPrint: React.FC<{ x: number; y: number; color: string; scale: number }> = ({ x, y, color, scale }) => (
  <g transform={`translate(${x} ${y}) scale(${scale * 1.45})`}>
    <ellipse cx={0} cy={8} rx={27} ry={21} fill={color} />
    {[-1.5, -0.5, 0.5, 1.5].map((i) => (
      <circle key={i} cx={i * 19} cy={-18 - (Math.abs(i) < 1 ? 6 : 0)} r={9.5} fill={color} />
    ))}
  </g>
);

export const FingerPainting: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraY = loopSin(frame, 1, 8);

  // stamping paw: raise → stamp → rest, once per beat
  let pawAngle = 0;
  if (frame < 4 * BEAT) {
    const p = frame % BEAT;
    pawAngle = interpolate(p, [0, 5, 11, 15, 21, BEAT], [0, -52, -52, 34, 0, 0]);
  } else {
    const wave =
      Math.sin((frame - 127) * 0.85) * 12 * clamp01((frame - 127) / 3) * clamp01((143 - frame) / 3);
    pawAngle =
      interpolate(frame, [120, 127, 143, 150], [0, -140, -140, 0], { extrapolateRight: "clamp" }) +
      wave;
  }

  let tail = loopSin(frame, 2, 10);
  for (let k = 0; k < 4; k++) tail += dampedImpulse(frame, stampAt(k), 0.8, 7) * 9;

  const bounceY = frame >= 120 ? -Math.abs(Math.sin((Math.PI * (frame - 120)) / 15)) * 24 : 0;

  // the finished artwork slides off left while a fresh sheet slides in from the right
  const sheetOut = interpolate(frame, [128, 148], [0, -880], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sheetIn = interpolate(frame, [128, 148], [880, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const Paper: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
    <g>
      <rect x={110} y={770} width={560} height={185} rx={22} fill={COLORS.white} stroke="#EADCCB" strokeWidth={5} />
      {children}
    </g>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <svg viewBox="0 0 1080 1080" style={{ width: "100%", height: "100%" }}>
        <g transform={`translate(0 ${cameraY})`}>
          <circle cx={150} cy={170} r={115} fill={COLORS.creamDeep} opacity={0.55} />
          <circle cx={945} cy={130} r={75} fill={COLORS.creamDeep} opacity={0.45} />
          {COLORS.poms.map((c, i) => (
            <circle key={i} cx={130 + i * 270} cy={300 + loopSin(frame, 2, 14, i * 1.7)} r={13} fill={c} opacity={0.25} />
          ))}

          <ellipse cx={540} cy={935} rx={465} ry={42} fill={COLORS.shadow} opacity={0.55} />

          {/* fresh sheet arriving (behind the current one) */}
          <g transform={`translate(${sheetIn} 0)`}>{frame >= 128 && <Paper />}</g>

          {/* current sheet with accumulating paw prints */}
          <g transform={`translate(${sheetOut} 0)`}>
            <Paper>
              {PRINTS.map(([px, py], k) => {
                const s = interpolate(frame, [stampAt(k), stampAt(k) + 4, stampAt(k) + 7], [0, 1.25, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                return s > 0 ? <PawPrint key={k} x={px} y={py} color={COLORS.poms[k]} scale={s} /> : null;
              })}
            </Paper>
          </g>

          {/* paint splat particles on each stamp */}
          {PRINTS.map(([px, py], k) => {
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
                      fill={COLORS.poms[k]}
                    />
                  );
                })}
              </g>
            );
          })}

          <Lion frame={frame} x={810} y={892} pawAngle={pawAngle} tailSwish={tail} bounceY={bounceY} flip />

          {[
            [640, 380],
            [890, 320],
            [560, 520],
            [980, 480],
            [760, 260],
            [1010, 600],
          ].map(([sx, sy], i) => (
            <Sparkle key={i} x={sx} y={sy} born={122 + i * 3} frame={frame} size={24 + (i % 3) * 8} color={COLORS.poms[i % 4]} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
