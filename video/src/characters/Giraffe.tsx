import React from "react";
import { COLORS, loopSin } from "../lib/utils";

const BODY = "#F2C879";
const PATCH = "#D9A441";
const MUZZLE = "#FBEDD2";

type Props = {
  frame: number;
  x: number;
  y: number; // ground anchor
  /** whole-neck sway, degrees around its base */
  neckSway: number;
  /** head nod, degrees around the neck top */
  nod: number;
  /** 0..1 — how wide the mouth is open (singing) */
  mouthOpen: number;
  bounceY: number;
};

// The skinny star — long swaying neck, ossicones, patchy coat.
export const Giraffe: React.FC<Props> = ({ frame, x, y, neckSway, nod, mouthOpen, bounceY }) => {
  const breath = 1 + loopSin(frame, 3, 0.01);
  const blink = frame >= 62 && frame <= 68 ? 0.1 : frame >= 138 && frame <= 143 ? 0.1 : 1;
  const tailWave = loopSin(frame, 2, 10, 1.2);

  return (
    <g transform={`translate(${x} ${y + bounceY})`}>
      <g transform={`scale(1 ${breath})`}>
        {/* tail */}
        <g transform={`translate(-105 -200) rotate(${-25 + tailWave})`}>
          <rect x={-7} y={0} width={14} height={95} rx={7} fill={BODY} stroke={COLORS.ink} strokeWidth={5} />
          <circle cx={0} cy={102} r={16} fill={PATCH} stroke={COLORS.ink} strokeWidth={5} />
        </g>

        {/* far legs (slightly darker, behind) */}
        <rect x={-52} y={-150} width={28} height={144} rx={14} fill="#E3B568" stroke={COLORS.ink} strokeWidth={5} />
        <rect x={92} y={-150} width={28} height={144} rx={14} fill="#E3B568" stroke={COLORS.ink} strokeWidth={5} />
        <ellipse cx={-38} cy={-8} rx={23} ry={12} fill={PATCH} stroke={COLORS.ink} strokeWidth={4.5} />
        <ellipse cx={106} cy={-8} rx={23} ry={12} fill={PATCH} stroke={COLORS.ink} strokeWidth={4.5} />

        {/* near legs */}
        <rect x={-95} y={-150} width={30} height={150} rx={15} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
        <rect x={55} y={-150} width={30} height={150} rx={15} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
        <ellipse cx={-80} cy={-6} rx={26} ry={13} fill={PATCH} stroke={COLORS.ink} strokeWidth={5} />
        <ellipse cx={70} cy={-6} rx={26} ry={13} fill={PATCH} stroke={COLORS.ink} strokeWidth={5} />

        {/* slim body */}
        <ellipse cx={-10} cy={-225} rx={110} ry={92} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
        <circle cx={-55} cy={-250} r={22} fill={PATCH} />
        <circle cx={15} cy={-195} r={17} fill={PATCH} />
        <circle cx={-15} cy={-275} r={13} fill={PATCH} />

        {/* neck + head, swaying together around the neck base */}
        <g transform={`translate(55 -270) rotate(${neckSway})`}>
          {/* long neck */}
          <rect x={-30} y={-330} width={60} height={345} rx={30} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
          <circle cx={-2} cy={-90} r={13} fill={PATCH} />
          <circle cx={6} cy={-180} r={11} fill={PATCH} />
          <circle cx={-4} cy={-265} r={12} fill={PATCH} />

          {/* head group with nod */}
          <g transform={`translate(0 -330) rotate(${nod})`}>
            {/* ear */}
            <ellipse cx={-52} cy={-28} rx={26} ry={14} fill={BODY} stroke={COLORS.ink} strokeWidth={5} transform="rotate(-30 -52 -28)" />
            {/* ossicones */}
            <rect x={-26} y={-78} width={10} height={34} rx={5} fill={BODY} stroke={COLORS.ink} strokeWidth={4} />
            <rect x={14} y={-78} width={10} height={34} rx={5} fill={BODY} stroke={COLORS.ink} strokeWidth={4} />
            <circle cx={-21} cy={-82} r={10} fill={PATCH} stroke={COLORS.ink} strokeWidth={4} />
            <circle cx={19} cy={-82} r={10} fill={PATCH} stroke={COLORS.ink} strokeWidth={4} />

            {/* head + snout pointing right */}
            <ellipse cx={0} cy={-22} rx={56} ry={48} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
            <ellipse cx={52} cy={-8} rx={40} ry={30} fill={MUZZLE} stroke={COLORS.ink} strokeWidth={6} />

            {/* mouth — opens while singing */}
            <ellipse cx={62} cy={4} rx={14} ry={4 + mouthOpen * 12} fill={COLORS.ink} />
            {/* nostril */}
            <circle cx={74} cy={-18} r={4} fill={COLORS.ink} />

            {/* eye + blush */}
            <g transform={`scale(1 ${blink})`} transform-origin="-8 -34">
              <circle cx={-8} cy={-34} r={9} fill={COLORS.ink} />
              <circle cx={-5} cy={-37} r={3} fill={COLORS.white} />
            </g>
            <ellipse cx={-30} cy={-6} rx={13} ry={8} fill={COLORS.blush} opacity={0.85} />
          </g>
        </g>
      </g>
    </g>
  );
};
