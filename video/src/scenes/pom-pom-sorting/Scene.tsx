import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bunny } from "../../characters/Bunny";
import { CupBack, CupFront } from "./Cup";
import { PomPom } from "./PomPom";
import { BEAT, COLORS, clamp01, dampedImpulse, lerp, loopSin } from "../../lib/utils";

export { LOOP_FRAMES } from "../../lib/utils";

// ---- choreography (all frame numbers chosen so frame 0 state == frame 150 state) ----
const HOPS = 4;
const FLIGHT = 18;
const launchAt = (k: number) => k * BEAT + 4;
const landAt = (k: number) => launchAt(k) + FLIGHT;
const sinkAt = (k: number) => 124 + k * 3; // pom melts into cup during celebration
const refillAt = (k: number) => 126 + k * 4; // fresh pom pops back onto the tray

const TRAY_POMS: [number, number][] = [
  [448, 838],
  [500, 846],
  [552, 838],
  [604, 846],
];
const CUP_X = [700, 805, 910, 1015];
const CUP_Y = 812;
const POM_R = 30;

type PomState =
  | { kind: "tray"; x: number; y: number; scale: number }
  | { kind: "flight"; x: number; y: number; rotation: number }
  | { kind: "cup"; x: number; y: number; hidden: boolean };

function pomState(frame: number, k: number): PomState {
  const L = launchAt(k);
  const [sx, sy] = TRAY_POMS[k];

  if (frame >= refillAt(k) || frame < L) {
    // back on the tray (pop-in scale finishes exactly at 1)
    const scale =
      frame >= refillAt(k)
        ? interpolate(frame, [refillAt(k), refillAt(k) + 5, refillAt(k) + 8], [0, 1.18, 1], {
            extrapolateRight: "clamp",
          })
        : 1;
    return { kind: "tray", x: sx, y: sy, scale };
  }

  if (frame < landAt(k)) {
    // parabolic hop into the matching cup
    const t = clamp01((frame - L) / FLIGHT);
    const x = lerp(sx, CUP_X[k], t);
    const y = lerp(sy, CUP_Y - 6, t) - Math.sin(Math.PI * t) * 280;
    return { kind: "flight", x, y, rotation: t * 300 };
  }

  // resting in the cup, settle bounce, then sink behind the front wall
  const settle = dampedImpulse(frame, landAt(k), 0.9, 5) * 10;
  const sink = interpolate(frame, [sinkAt(k), sinkAt(k) + 12], [0, 60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { kind: "cup", x: CUP_X[k], y: CUP_Y - 6 + settle + sink, hidden: false };
}

function rightArmAngle(frame: number): number {
  if (frame < HOPS * BEAT) {
    const p = frame % BEAT;
    return interpolate(p, [0, 5, 10, 16, 26, BEAT], [0, -32, 46, 20, 0, 0]);
  }
  // celebration: arm up + wave, returns to rest exactly at the loop seam
  const wave =
    Math.sin((frame - 127) * 0.8) * 12 * clamp01((frame - 127) / 3) * clamp01((143 - frame) / 3);
  return (
    interpolate(frame, [120, 127, 143, 150], [0, -150, -150, 0], {
      extrapolateRight: "clamp",
    }) + wave
  );
}

function leftArmAngle(frame: number): number {
  if (frame < HOPS * BEAT) return 8 + loopSin(frame, 3, 3);
  const wave =
    Math.sin((frame - 128) * 0.8) * -12 * clamp01((frame - 128) / 3) * clamp01((143 - frame) / 3);
  return (
    interpolate(frame, [120, 127, 143, 150], [8, 150, 150, 8], {
      extrapolateRight: "clamp",
    }) + wave
  );
}

const Sparkle: React.FC<{ x: number; y: number; born: number; frame: number; size: number }> = ({
  x,
  y,
  born,
  frame,
  size,
}) => {
  const life = 12;
  const t = (frame - born) / life;
  if (t < 0 || t > 1) return null;
  const s = Math.sin(Math.PI * t) * size;
  return (
    <g transform={`translate(${x} ${y}) rotate(${t * 90}) scale(${s})`} opacity={0.9}>
      <path d="M 0 -1 Q 0.18 -0.18 1 0 Q 0.18 0.18 0 1 Q -0.18 0.18 -1 0 Q -0.18 -0.18 0 -1 Z" fill="#FFB938" />
    </g>
  );
};

export const PomPomSorting: React.FC = () => {
  const frame = useCurrentFrame();

  // ear wiggle: an impulse on every landing + a bigger one for the celebration
  let ears = 0;
  for (let k = 0; k < HOPS; k++) ears += dampedImpulse(frame, landAt(k), 0.85, 7) * 9;
  ears += dampedImpulse(frame, 124, 0.7, 8) * 13;

  // celebration double-hop, lands exactly at frame 150
  const bounceY = frame >= 120 ? -Math.abs(Math.sin((Math.PI * (frame - 120)) / 15)) * 26 : 0;

  const cameraY = loopSin(frame, 1, 8);

  const poms = Array.from({ length: HOPS }, (_, k) => ({ k, st: pomState(frame, k) }));

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <svg viewBox="0 0 1080 1080" style={{ width: "100%", height: "100%" }}>
        <g transform={`translate(0 ${cameraY})`}>
          {/* background decoration */}
          <circle cx={150} cy={170} r={115} fill={COLORS.creamDeep} opacity={0.55} />
          <circle cx={945} cy={130} r={75} fill={COLORS.creamDeep} opacity={0.45} />
          {COLORS.poms.map((c, i) => (
            <circle
              key={i}
              cx={120 + i * 270}
              cy={300 + loopSin(frame, 2, 14, i * 1.7)}
              r={13}
              fill={c}
              opacity={0.25}
            />
          ))}

          {/* floor shadow */}
          <ellipse cx={545} cy={918} rx={460} ry={46} fill={COLORS.shadow} opacity={0.55} />

          {/* bunny */}
          <Bunny
            frame={frame}
            x={300}
            y={888}
            earWiggle={ears}
            rightArmAngle={rightArmAngle(frame)}
            leftArmAngle={leftArmAngle(frame)}
            bounceY={bounceY}
          />

          {/* tray with little feet */}
          <rect x={438} y={892} width={18} height={18} rx={6} fill={COLORS.trayRim} />
          <rect x={612} y={892} width={18} height={18} rx={6} fill={COLORS.trayRim} />
          <rect x={420} y={856} width={228} height={44} rx={16} fill={COLORS.tray} stroke={COLORS.trayRim} strokeWidth={6} />

          {/* tray + flying pom-poms */}
          {poms.map(({ k, st }) =>
            st.kind !== "cup" ? (
              <PomPom
                key={k}
                x={st.x}
                y={st.y}
                r={POM_R}
                color={COLORS.poms[k]}
                light={COLORS.pomsLight[k]}
                scale={st.kind === "tray" ? st.scale : 1}
                rotation={st.kind === "flight" ? st.rotation : 0}
              />
            ) : null,
          )}

          {/* cups: back layer → in-cup poms → front layer (poms sink between the walls) */}
          {CUP_X.map((cx, k) => (
            <CupBack
              key={k}
              x={cx}
              y={CUP_Y}
              color={COLORS.poms[k]}
              light={COLORS.pomsLight[k]}
              squash={dampedImpulse(frame, landAt(k), 0.9, 5) * 0.9}
            />
          ))}
          {poms.map(({ k, st }) =>
            st.kind === "cup" ? (
              <PomPom key={k} x={st.x} y={st.y} r={POM_R} color={COLORS.poms[k]} light={COLORS.pomsLight[k]} />
            ) : null,
          )}
          {CUP_X.map((cx, k) => (
            <CupFront
              key={k}
              x={cx}
              y={CUP_Y}
              color={COLORS.poms[k]}
              light={COLORS.pomsLight[k]}
              squash={dampedImpulse(frame, landAt(k), 0.9, 5) * 0.9}
            />
          ))}

          {/* celebration sparkles around the bunny */}
          {[
            [180, 380],
            [430, 330],
            [120, 540],
            [460, 480],
            [300, 270],
            [520, 400],
          ].map(([sx, sy], i) => (
            <Sparkle key={i} x={sx} y={sy} born={122 + i * 3} frame={frame} size={26 + (i % 3) * 8} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
