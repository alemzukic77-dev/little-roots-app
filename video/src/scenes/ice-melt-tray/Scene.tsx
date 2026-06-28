import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Penguin } from "../../characters/Penguin";
import { Sparkle } from "../../lib/Sparkle";
import { BEAT, COLORS, clamp01, dampedImpulse, loopSin } from "../../lib/utils";

const ICE = "#DDF0F8";
const ICE_EDGE = "#2E7490";
const WATER = "#C9E6F2";

const CUBES: { x: number; y: number; s: number }[] = [
  { x: 650, y: 812, s: 105 },
  { x: 800, y: 826, s: 84 },
  { x: 938, y: 806, s: 96 },
];

const nudgeAt = (k: number) => k * BEAT + 8;
const dripAt = (k: number) => k * BEAT + 12;

const IceCube: React.FC<{ x: number; y: number; s: number; wobble: number; melt: number }> = ({
  x,
  y,
  s,
  wobble,
  melt,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${wobble}) scale(${1 - melt * 0.04})`}>
    <rect x={-s / 2} y={-s} width={s} height={s} rx={18} fill={ICE} stroke={ICE_EDGE} strokeWidth={6} />
    <path
      d={`M ${-s / 2 + 14} ${-s + 26} q 10 -12 26 -14`}
      fill="none"
      stroke={COLORS.white}
      strokeWidth={9}
      strokeLinecap="round"
    />
    <circle cx={s / 2 - 22} cy={-22} r={5} fill={COLORS.white} opacity={0.9} />
  </g>
);

export const IceMeltTray: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraY = loopSin(frame, 1, 8);

  // penguin waddle: a nudge rock on every beat, finished within the beat
  let rock = 0;
  let flipperR = 12;
  if (frame < 4 * BEAT) {
    const p = frame % BEAT;
    rock = interpolate(p, [0, 5, 11, 18, BEAT], [0, -7, 9, 0, 0]);
    flipperR = interpolate(p, [0, 6, 12, 20, BEAT], [12, 64, 18, 12, 12]);
  } else {
    const wave =
      Math.sin((frame - 127) * 0.85) * 14 * clamp01((frame - 127) / 3) * clamp01((143 - frame) / 3);
    flipperR =
      interpolate(frame, [120, 127, 143, 150], [12, 168, 168, 12], { extrapolateRight: "clamp" }) +
      wave;
  }
  const flipperL =
    frame < 4 * BEAT
      ? -12 - loopSin(frame, 3, 4)
      : -interpolate(frame, [120, 127, 143, 150], [12, 168, 168, 12], { extrapolateRight: "clamp" }) -
        Math.sin((frame - 128) * 0.85) * 14 * clamp01((frame - 128) / 3) * clamp01((143 - frame) / 3);

  const bounceY = frame >= 120 ? -Math.abs(Math.sin((Math.PI * (frame - 120)) / 15)) * 24 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <svg viewBox="0 0 1080 1080" style={{ width: "100%", height: "100%" }}>
        <g transform={`translate(0 ${cameraY})`}>
          <circle cx={160} cy={160} r={110} fill={COLORS.creamDeep} opacity={0.55} />
          <circle cx={950} cy={140} r={70} fill={COLORS.creamDeep} opacity={0.45} />
          {["#9CCFE8", "#C9E6F2", "#9CCFE8"].map((c, i) => (
            <circle key={i} cx={200 + i * 330} cy={290 + loopSin(frame, 2, 13, i * 2.1)} r={12} fill={c} opacity={0.4} />
          ))}

          <ellipse cx={560} cy={925} rx={470} ry={44} fill={COLORS.shadow} opacity={0.55} />

          <Penguin
            frame={frame}
            x={300}
            y={892}
            rock={rock}
            flipperL={flipperL}
            flipperR={flipperR}
            bounceY={bounceY}
          />

          {/* shallow tray with melt water */}
          <rect x={555} y={830} width={480} height={62} rx={20} fill={COLORS.white} stroke={ICE_EDGE} strokeWidth={6} />
          <ellipse cx={795} cy={838} rx={215 + loopSin(frame, 2, 6)} ry={17} fill={WATER} opacity={0.85} />

          {/* ice cubes — wobble when nudged, gentle shimmer melt-pulse */}
          {CUBES.map((c, i) => (
            <IceCube
              key={i}
              x={c.x}
              y={c.y + 8}
              s={c.s}
              wobble={dampedImpulse(frame, nudgeAt(i % 4), 0.8, 6) * 7 + dampedImpulse(frame, nudgeAt((i + 2) % 4), 0.8, 6) * 4}
              melt={0.5 + loopSin(frame, 1, 0.5, i * 2)}
            />
          ))}

          {/* one drip per beat: falls from a cube into the water, then a ripple ring */}
          {Array.from({ length: 4 }, (_, k) => {
            const cube = CUBES[k % 3];
            const t0 = dripAt(k);
            const fall = clamp01((frame - t0) / 11);
            const rippleT = clamp01((frame - t0 - 11) / 12);
            return (
              <g key={k}>
                {frame >= t0 && fall < 1 && (
                  <ellipse
                    cx={cube.x + 18}
                    cy={interpolate(fall, [0, 1], [cube.y + 14, 845])}
                    rx={7}
                    ry={11}
                    fill="#8FC6DE"
                  />
                )}
                {rippleT > 0 && rippleT < 1 && (
                  <ellipse
                    cx={cube.x + 18}
                    cy={848}
                    rx={10 + rippleT * 44}
                    ry={3 + rippleT * 7}
                    fill="none"
                    stroke="#8FC6DE"
                    strokeWidth={4 * (1 - rippleT)}
                    opacity={1 - rippleT}
                  />
                )}
              </g>
            );
          })}

          {/* celebration sparkles — icy palette */}
          {[
            [180, 360],
            [430, 320],
            [120, 520],
            [700, 600],
            [950, 640],
            [820, 560],
          ].map(([sx, sy], i) => (
            <Sparkle
              key={i}
              x={sx}
              y={sy}
              born={122 + i * 3}
              frame={frame}
              size={24 + (i % 3) * 8}
              color={i % 2 ? "#9CCFE8" : "#FFB938"}
            />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
