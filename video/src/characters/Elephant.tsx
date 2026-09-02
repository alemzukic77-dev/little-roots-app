import React from "react";
import { COLORS, loopSin } from "../lib/utils";

const BODY = "#AFB6C9";
const INNER = "#E5E9F2";

type Props = {
  frame: number;
  x: number;
  y: number; // ground anchor
  /** working arm, degrees */
  armAngle: number;
  /** trunk curl: 0 = relaxed hang, 1 = fully curled up */
  trunkCurl: number;
  earFlap: number; // degrees
  bounceY: number;
  flip?: boolean;
};

// Gentle slim elephant — big flappy ears, expressive trunk.
export const Elephant: React.FC<Props> = ({ frame, x, y, armAngle, trunkCurl, earFlap, bounceY, flip }) => {
  const breath = 1 + loopSin(frame, 3, 0.012);
  const blink = frame >= 66 && frame <= 72 ? 0.1 : frame >= 134 && frame <= 139 ? 0.1 : 1;

  // trunk: quadratic curve whose tip lifts and curls with trunkCurl
  const tipX = 118 + trunkCurl * 30;
  const tipY = -210 + trunkCurl * -95;
  const ctrlX = 95;
  const ctrlY = -255 + trunkCurl * -20;

  return (
    <g transform={`translate(${x} ${y + bounceY}) scale(${flip ? -1 : 1} 1)`}>
      <g transform={`scale(1 ${breath})`}>
        {/* tail */}
        <path d="M -118 -160 Q -150 -130 -142 -95" fill="none" stroke={BODY} strokeWidth={16} strokeLinecap="round" />
        <circle cx={-142} cy={-92} r={12} fill={INNER} stroke={BODY} strokeWidth={6} />

        {/* feet */}
        <ellipse cx={-74} cy={-8} rx={46} ry={24} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
        <ellipse cx={72} cy={-8} rx={44} ry={22} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />

        {/* body */}
        <ellipse cx={-10} cy={-140} rx={115} ry={125} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
        <ellipse cx={-5} cy={-112} rx={62} ry={75} fill={INNER} />

        {/* resting arm — mirrors the working arm (same shoulder height + length) so the pair reads level */}
        <g transform={`translate(-82 -200) rotate(-10)`}>
          <rect x={-17} y={0} width={34} height={92} rx={17} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
        </g>

        {/* far ear (behind head) */}
        <g transform={`translate(-50 -330) rotate(${-earFlap})`}>
          <ellipse cx={-28} cy={0} rx={52} ry={64} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
          <ellipse cx={-26} cy={0} rx={32} ry={44} fill={INNER} />
        </g>

        {/* head */}
        <circle cx={30} cy={-310} r={92} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />

        {/* near ear */}
        <g transform={`translate(105 -335) rotate(${earFlap})`}>
          <ellipse cx={26} cy={0} rx={52} ry={64} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
          <ellipse cx={24} cy={0} rx={32} ry={44} fill={INNER} />
        </g>

        {/* face */}
        <g transform={`scale(1 ${blink})`} transform-origin="30 -330">
          <circle cx={0} cy={-334} r={9} fill={COLORS.ink} />
          <circle cx={58} cy={-334} r={9} fill={COLORS.ink} />
          <circle cx={3} cy={-337} r={3} fill={COLORS.white} />
          <circle cx={61} cy={-337} r={3} fill={COLORS.white} />
        </g>
        <ellipse cx={-18} cy={-298} rx={13} ry={8} fill={COLORS.blush} opacity={0.85} />
        <ellipse cx={76} cy={-298} rx={13} ry={8} fill={COLORS.blush} opacity={0.85} />

        {/* trunk — drawn over the face bottom, curls with trunkCurl */}
        <path
          d={`M 12 -272 Q ${ctrlX} ${ctrlY} ${tipX} ${tipY}`}
          fill="none"
          stroke={BODY}
          strokeWidth={34}
          strokeLinecap="round"
        />
        <path
          d={`M 12 -272 Q ${ctrlX} ${ctrlY} ${tipX} ${tipY}`}
          fill="none"
          stroke={COLORS.ink}
          strokeWidth={2.5}
          strokeDasharray="2 14"
          opacity={0.4}
        />
        <circle cx={tipX} cy={tipY} r={13} fill={INNER} stroke={COLORS.ink} strokeWidth={4} />

        {/* working arm */}
        <g transform={`translate(78 -200) rotate(${armAngle})`}>
          <rect x={-17} y={0} width={34} height={92} rx={17} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
        </g>
      </g>
    </g>
  );
};
