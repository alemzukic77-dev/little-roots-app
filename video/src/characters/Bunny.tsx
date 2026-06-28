import React from "react";
import { interpolate } from "remotion";
import { COLORS, loopSin } from "../lib/utils";

type Props = {
  frame: number;
  x: number;
  y: number; // ground anchor (feet)
  earWiggle: number; // degrees, from landing impulses
  rightArmAngle: number; // degrees, throwing arm
  leftArmAngle: number; // degrees
  bounceY: number; // celebration hop offset (px, negative = up)
};

const Capsule: React.FC<{ length: number; width: number }> = ({ length, width }) => (
  <rect
    x={-width / 2}
    y={0}
    width={width}
    height={length}
    rx={width / 2}
    fill={COLORS.bunny}
    stroke={COLORS.ink}
    strokeWidth={6}
  />
);

export const Bunny: React.FC<Props> = ({
  frame,
  x,
  y,
  earWiggle,
  rightArmAngle,
  leftArmAngle,
  bounceY,
}) => {
  // breathing — 3 full cycles per loop so frame 0 == frame 150
  const breath = 1 + loopSin(frame, 3, 0.012);
  // quick double-blinks at fixed frames, finished well before the loop seam
  const blink =
    interpolate(frame, [68, 71, 74], [1, 0.08, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
    interpolate(frame, [132, 135, 138], [1, 0.08, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  return (
    <g transform={`translate(${x} ${y + bounceY})`}>
      <g transform={`scale(1 ${breath})`}>
        {/* tail */}
        <circle cx={-128} cy={-95} r={34} fill={COLORS.bunny} stroke={COLORS.ink} strokeWidth={6} />

        {/* ears — pivot at base, lively asymmetric wiggle */}
        <g transform={`translate(-48 -415) rotate(${-14 + earWiggle})`}>
          <ellipse cx={0} cy={-88} rx={30} ry={98} fill={COLORS.bunny} stroke={COLORS.ink} strokeWidth={6} />
          <ellipse cx={0} cy={-82} rx={14} ry={62} fill={COLORS.blush} opacity={0.75} />
        </g>
        <g transform={`translate(48 -415) rotate(${15 - earWiggle * 0.7})`}>
          <ellipse cx={0} cy={-88} rx={30} ry={98} fill={COLORS.bunny} stroke={COLORS.ink} strokeWidth={6} />
          <ellipse cx={0} cy={-82} rx={14} ry={62} fill={COLORS.blush} opacity={0.75} />
        </g>

        {/* feet */}
        <ellipse cx={-76} cy={-8} rx={48} ry={26} fill={COLORS.bunny} stroke={COLORS.ink} strokeWidth={6} />
        <ellipse cx={76} cy={-8} rx={48} ry={26} fill={COLORS.bunny} stroke={COLORS.ink} strokeWidth={6} />

        {/* body */}
        <ellipse cx={0} cy={-150} rx={122} ry={148} fill={COLORS.bunny} stroke={COLORS.ink} strokeWidth={6} />
        <ellipse cx={0} cy={-118} rx={72} ry={92} fill={COLORS.bunnyInner} />

        {/* left arm (mostly resting) */}
        <g transform={`translate(-100 -215) rotate(${leftArmAngle})`}>
          <Capsule length={95} width={42} />
        </g>

        {/* head */}
        <circle cx={0} cy={-345} r={108} fill={COLORS.bunny} stroke={COLORS.ink} strokeWidth={6} />

        {/* face */}
        <g transform={`scale(1 ${blink})`} transform-origin="0 -352">
          <circle cx={-40} cy={-360} r={11} fill={COLORS.ink} />
          <circle cx={40} cy={-360} r={11} fill={COLORS.ink} />
        </g>
        <ellipse cx={-66} cy={-322} rx={19} ry={12} fill={COLORS.blush} opacity={0.85} />
        <ellipse cx={66} cy={-322} rx={19} ry={12} fill={COLORS.blush} opacity={0.85} />
        <path d="M -9 -330 Q 0 -322 9 -330 L 0 -316 Z" fill={COLORS.ink} transform="translate(0 -6)" />
        <path
          d="M 0 -318 Q -3 -304 -16 -302 M 0 -318 Q 3 -304 16 -302"
          fill="none"
          stroke={COLORS.ink}
          strokeWidth={5}
          strokeLinecap="round"
        />

        {/* right arm (throwing) — drawn over body, pivot at shoulder */}
        <g transform={`translate(100 -215) rotate(${rightArmAngle})`}>
          <Capsule length={100} width={42} />
          {/* little paw pad */}
          <circle cx={0} cy={100} r={16} fill={COLORS.bunnyInner} />
        </g>
      </g>
    </g>
  );
};
