import React from "react";
import { COLORS, loopSin } from "../lib/utils";

const BODY = "#B9B2C9";
const INNER = "#EFEAF6";

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
  /** show the fishing rod in the working paw (magnetic-fishing scene) */
  holdRod?: boolean;
};

// Slim lilac cat — pointy ears, long expressive tail, whiskers.
export const Cat: React.FC<Props> = ({ frame, x, y, armAngle, tailSwish, earWiggle, bounceY, flip, holdRod }) => {
  const breath = 1 + loopSin(frame, 3, 0.012);
  const blink = frame >= 70 && frame <= 76 ? 0.1 : frame >= 138 && frame <= 143 ? 0.1 : 1;

  return (
    <g transform={`translate(${x} ${y + bounceY}) scale(${flip ? -1 : 1} 1)`}>
      <g transform={`scale(1 ${breath})`}>
        {/* tail — long, curls up behind */}
        <g transform={`translate(-95 -110) rotate(${-55 + tailSwish})`}>
          <path
            d="M 0 0 Q -14 70 8 118 Q 26 152 48 138"
            fill="none"
            stroke={BODY}
            strokeWidth={26}
            strokeLinecap="round"
          />
          <circle cx={52} cy={134} r={15} fill={INNER} stroke={BODY} strokeWidth={8} />
        </g>

        {/* back feet peeking out */}
        <ellipse cx={-74} cy={-8} rx={46} ry={24} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
        <ellipse cx={72} cy={-8} rx={44} ry={22} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />

        {/* haunch + sitting body */}
        <ellipse cx={-30} cy={-90} rx={80} ry={84} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
        <ellipse cx={12} cy={-150} rx={88} ry={125} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
        <ellipse cx={14} cy={-122} rx={52} ry={74} fill={INNER} />

        {/* left front paw resting (right one holds the rod) */}
        <rect x={-42} y={-100} width={32} height={92} rx={16} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />

        {/* ears — pointy triangles with inner */}
        <g transform={`translate(-12 -398) rotate(${-6 + earWiggle})`}>
          <path d="M -26 26 L 0 -34 L 26 26 Z" fill={BODY} stroke={COLORS.ink} strokeWidth={6} strokeLinejoin="round" />
          <path d="M -13 18 L 0 -14 L 13 18 Z" fill={COLORS.blush} opacity={0.8} />
        </g>
        <g transform={`translate(82 -398) rotate(${6 - earWiggle * 0.7})`}>
          <path d="M -26 26 L 0 -34 L 26 26 Z" fill={BODY} stroke={COLORS.ink} strokeWidth={6} strokeLinejoin="round" />
          <path d="M -13 18 L 0 -14 L 13 18 Z" fill={COLORS.blush} opacity={0.8} />
        </g>

        {/* head */}
        <circle cx={35} cy={-330} r={80} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />

        {/* face */}
        <g transform={`scale(1 ${blink})`} transform-origin="35 -340">
          <circle cx={6} cy={-344} r={9} fill={COLORS.ink} />
          <circle cx={64} cy={-344} r={9} fill={COLORS.ink} />
        </g>
        <ellipse cx={35} cy={-308} rx={26} ry={18} fill={INNER} />
        <path d="M 28 -318 L 42 -318 L 35 -308 Z" fill={COLORS.blush} stroke={COLORS.ink} strokeWidth={3.5} strokeLinejoin="round" />
        <path d="M 35 -308 Q 32 -299 24 -297 M 35 -308 Q 38 -299 46 -297" fill="none" stroke={COLORS.ink} strokeWidth={4.5} strokeLinecap="round" />
        {/* whiskers */}
        <path d="M -14 -316 L -46 -322 M -13 -306 L -45 -304" stroke={COLORS.ink} strokeWidth={3.5} strokeLinecap="round" />
        <path d="M 84 -316 L 116 -322 M 83 -306 L 115 -304" stroke={COLORS.ink} strokeWidth={3.5} strokeLinecap="round" />
        <ellipse cx={-8} cy={-300} rx={13} ry={8} fill={COLORS.blush} opacity={0.85} />
        <ellipse cx={78} cy={-300} rx={13} ry={8} fill={COLORS.blush} opacity={0.85} />

        {/* rod arm — pivots at the shoulder, holds a little fishing rod */}
        <g transform={`translate(75 -205) rotate(${armAngle})`}>
          <rect x={-16} y={0} width={32} height={88} rx={16} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
          {/* rod held in the paw, pointing forward-up (tip ≈ scene 460,540 — line anchors there) */}
          {holdRod && (
            <g transform="translate(0 84) rotate(-62)">
              <rect x={0} y={-5} width={240} height={10} rx={5} fill={COLORS.trayRim} stroke={COLORS.ink} strokeWidth={4} />
            </g>
          )}
        </g>
      </g>
    </g>
  );
};
