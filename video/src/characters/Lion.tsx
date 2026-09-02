import React from "react";
import { COLORS, loopSin } from "../lib/utils";

const BODY = "#F5D9A0";
const MANE = "#F0A24B";
const MUZZLE = "#FBEDD2";

type Props = {
  frame: number;
  x: number;
  y: number; // ground anchor
  /** stamping front paw, degrees (0 = resting down) */
  pawAngle: number;
  tailSwish: number; // degrees
  bounceY: number;
  /** mirror so the stamping paw faces left (toward the paper) */
  flip?: boolean;
};

// Slim sitting lion with a scalloped mane and a swishing tufted tail.
export const Lion: React.FC<Props> = ({ frame, x, y, pawAngle, tailSwish, bounceY, flip }) => {
  const breath = 1 + loopSin(frame, 3, 0.012);
  const blink =
    frame >= 64 && frame <= 70 ? 0.1 : frame >= 136 && frame <= 141 ? 0.1 : 1;

  return (
    <g transform={`translate(${x} ${y + bounceY}) scale(${flip ? -1 : 1} 1)`}>
      <g transform={`scale(1 ${breath})`}>
        {/* tail — pivots behind the haunch, curls out to the side */}
        <g transform={`translate(-128 -150) rotate(${-62 + tailSwish})`}>
          <rect x={-10} y={0} width={20} height={118} rx={10} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
          <circle cx={0} cy={128} r={26} fill={MANE} stroke={COLORS.ink} strokeWidth={6} />
        </g>

        {/* back feet peeking out */}
        <ellipse cx={-105} cy={-8} rx={48} ry={24} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
        <ellipse cx={78} cy={-6} rx={44} ry={22} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />

        {/* haunches + slim body */}
        <ellipse cx={-55} cy={-95} rx={85} ry={88} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
        <ellipse cx={20} cy={-150} rx={95} ry={130} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
        <ellipse cx={22} cy={-125} rx={58} ry={80} fill={MUZZLE} />

        {/* resting front arm — mirrors the stamping paw (same shoulder height + length) so the pair reads level */}
        <g transform={`translate(-45 -210) rotate(-12)`}>
          <rect x={-19} y={0} width={38} height={105} rx={19} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
          <ellipse cx={0} cy={105} rx={24} ry={16} fill={MUZZLE} stroke={COLORS.ink} strokeWidth={5} />
        </g>

        {/* mane — scalloped ring behind the head */}
        <g transform="translate(45 -330)">
          {Array.from({ length: 11 }, (_, i) => {
            const a = (i / 11) * Math.PI * 2;
            const wob = loopSin(frame, 2, 3, i * 1.3);
            return (
              <circle
                key={i}
                cx={Math.cos(a) * 92 + wob}
                cy={Math.sin(a) * 92}
                r={38}
                fill={MANE}
                stroke={COLORS.ink}
                strokeWidth={5}
              />
            );
          })}
          <circle r={96} fill={MANE} />
        </g>

        {/* head */}
        <circle cx={45} cy={-330} r={82} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
        {/* ears */}
        <circle cx={-8} cy={-392} r={22} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
        <circle cx={98} cy={-392} r={22} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />

        {/* face */}
        <g transform={`scale(1 ${blink})`} transform-origin="45 -340">
          <circle cx={15} cy={-345} r={9} fill={COLORS.ink} />
          <circle cx={75} cy={-345} r={9} fill={COLORS.ink} />
        </g>
        <ellipse cx={45} cy={-305} rx={30} ry={22} fill={MUZZLE} />
        <path d="M 37 -316 L 53 -316 L 45 -304 Z" fill={COLORS.ink} />
        <path d="M 45 -304 Q 42 -295 33 -293 M 45 -304 Q 48 -295 57 -293" fill="none" stroke={COLORS.ink} strokeWidth={4.5} strokeLinecap="round" />
        <ellipse cx={-2} cy={-310} rx={14} ry={9} fill={COLORS.blush} opacity={0.85} />
        <ellipse cx={92} cy={-310} rx={14} ry={9} fill={COLORS.blush} opacity={0.85} />

        {/* stamping paw — pivots at the shoulder, drawn last */}
        <g transform={`translate(85 -210) rotate(${pawAngle})`}>
          <rect x={-19} y={0} width={38} height={105} rx={19} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
          <ellipse cx={0} cy={105} rx={24} ry={16} fill={MUZZLE} stroke={COLORS.ink} strokeWidth={5} />
        </g>
      </g>
    </g>
  );
};
