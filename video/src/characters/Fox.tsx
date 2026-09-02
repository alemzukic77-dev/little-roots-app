import React from "react";
import { COLORS, loopSin } from "../lib/utils";

const BODY = "#E8855B";
const CHEST = "#FFF4EA";

type Props = {
  frame: number;
  x: number;
  y: number; // ground anchor
  /** working arm, degrees */
  armAngle: number;
  tailSwish: number;
  earWiggle: number;
  bounceY: number;
  flip?: boolean;
};

// Slim fox — pointy ears, white chest, bushy white-tipped tail.
export const Fox: React.FC<Props> = ({ frame, x, y, armAngle, tailSwish, earWiggle, bounceY, flip }) => {
  const breath = 1 + loopSin(frame, 3, 0.012);
  const blink = frame >= 72 && frame <= 78 ? 0.1 : frame >= 140 && frame <= 145 ? 0.1 : 1;

  return (
    <g transform={`translate(${x} ${y + bounceY}) scale(${flip ? -1 : 1} 1)`}>
      <g transform={`scale(1 ${breath})`}>
        {/* bushy tail with white tip — curls out to the side */}
        <g transform={`translate(-95 -150) rotate(${-100 + tailSwish})`}>
          <ellipse cx={0} cy={85} rx={38} ry={95} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
          <ellipse cx={0} cy={150} rx={28} ry={38} fill={CHEST} />
        </g>

        {/* back feet peeking out */}
        <ellipse cx={-74} cy={-8} rx={46} ry={24} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
        <ellipse cx={72} cy={-8} rx={44} ry={22} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />

        {/* haunch + body */}
        <ellipse cx={-28} cy={-92} rx={80} ry={86} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
        <ellipse cx={10} cy={-150} rx={88} ry={124} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
        <ellipse cx={12} cy={-120} rx={52} ry={74} fill={CHEST} />

        {/* resting arm — mirrors the working arm (same shoulder height + length) so the pair reads level */}
        <g transform={`translate(-52 -205) rotate(-10)`}>
          <rect x={-16} y={0} width={32} height={88} rx={16} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
          <circle cx={0} cy={88} r={14} fill={CHEST} />
        </g>

        {/* ears — tall triangles, dark tips */}
        <g transform={`translate(-14 -398) rotate(${-8 + earWiggle})`}>
          <path d="M -24 28 L 0 -44 L 24 28 Z" fill={BODY} stroke={COLORS.ink} strokeWidth={6} strokeLinejoin="round" />
          <path d="M -8 -16 L 0 -40 L 8 -16 Z" fill={COLORS.ink} />
        </g>
        <g transform={`translate(80 -398) rotate(${8 - earWiggle * 0.7})`}>
          <path d="M -24 28 L 0 -44 L 24 28 Z" fill={BODY} stroke={COLORS.ink} strokeWidth={6} strokeLinejoin="round" />
          <path d="M -8 -16 L 0 -40 L 8 -16 Z" fill={COLORS.ink} />
        </g>

        {/* head */}
        <circle cx={33} cy={-330} r={80} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
        {/* white muzzle */}
        <ellipse cx={33} cy={-300} rx={36} ry={26} fill={CHEST} />

        {/* face */}
        <g transform={`scale(1 ${blink})`} transform-origin="33 -340">
          <circle cx={4} cy={-344} r={9} fill={COLORS.ink} />
          <circle cx={62} cy={-344} r={9} fill={COLORS.ink} />
        </g>
        <ellipse cx={33} cy={-312} rx={9} ry={7} fill={COLORS.ink} />
        <path d="M 33 -306 Q 30 -297 22 -295 M 33 -306 Q 36 -297 44 -295" fill="none" stroke={COLORS.ink} strokeWidth={4.5} strokeLinecap="round" />
        <ellipse cx={-10} cy={-302} rx={13} ry={8} fill={COLORS.blush} opacity={0.85} />
        <ellipse cx={76} cy={-302} rx={13} ry={8} fill={COLORS.blush} opacity={0.85} />

        {/* working arm — pivots at the shoulder */}
        <g transform={`translate(72 -205) rotate(${armAngle})`}>
          <rect x={-16} y={0} width={32} height={88} rx={16} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
          <circle cx={0} cy={88} r={14} fill={CHEST} />
        </g>
      </g>
    </g>
  );
};
