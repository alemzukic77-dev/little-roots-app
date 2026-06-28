import React from "react";
import { COLORS, loopSin } from "../lib/utils";

const BODY = "#34303B";
const BELLY = "#FFF9F2";

type Props = {
  frame: number;
  x: number;
  y: number; // ground anchor (feet)
  /** rocking waddle, degrees around the feet */
  rock: number;
  flipperL: number; // degrees, 0 = resting against body
  flipperR: number;
  bounceY: number;
};

// Tall slim penguin — dark body, cream belly, ember beak and feet.
export const Penguin: React.FC<Props> = ({ frame, x, y, rock, flipperL, flipperR, bounceY }) => {
  const breath = 1 + loopSin(frame, 3, 0.012);
  return (
    <g transform={`translate(${x} ${y + bounceY}) rotate(${rock})`}>
      <g transform={`scale(1 ${breath})`}>
        {/* feet */}
        <ellipse cx={-42} cy={-10} rx={40} ry={18} fill={COLORS.ember} stroke={COLORS.ink} strokeWidth={6} />
        <ellipse cx={42} cy={-10} rx={40} ry={18} fill={COLORS.ember} stroke={COLORS.ink} strokeWidth={6} />

        {/* tall slim body */}
        <ellipse cx={0} cy={-235} rx={108} ry={225} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
        {/* belly */}
        <ellipse cx={0} cy={-185} rx={74} ry={160} fill={BELLY} />

        {/* flippers — slim, pivot at shoulders */}
        <g transform={`translate(-100 -310) rotate(${flipperL})`}>
          <ellipse cx={0} cy={70} rx={24} ry={78} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
        </g>
        <g transform={`translate(100 -310) rotate(${flipperR})`}>
          <ellipse cx={0} cy={70} rx={24} ry={78} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
        </g>

        {/* face patch */}
        <ellipse cx={0} cy={-368} rx={66} ry={56} fill={BELLY} />

        {/* eyes */}
        <circle cx={-28} cy={-382} r={10} fill={COLORS.ink} />
        <circle cx={28} cy={-382} r={10} fill={COLORS.ink} />
        <circle cx={-25} cy={-385} r={3.5} fill={COLORS.white} />
        <circle cx={31} cy={-385} r={3.5} fill={COLORS.white} />

        {/* blush */}
        <ellipse cx={-52} cy={-352} rx={15} ry={9} fill={COLORS.blush} opacity={0.85} />
        <ellipse cx={52} cy={-352} rx={15} ry={9} fill={COLORS.blush} opacity={0.85} />

        {/* beak */}
        <path d="M -16 -358 L 16 -358 L 0 -334 Z" fill={COLORS.ember} stroke={COLORS.ink} strokeWidth={5} strokeLinejoin="round" />
      </g>
    </g>
  );
};
