import React from "react";
import { COLORS, loopSin } from "../lib/utils";

const SPIKES = "#A4795C";
const BODY = "#F0DCC4";

type Props = {
  frame: number;
  x: number;
  y: number; // ground anchor
  /** working arm, degrees */
  armAngle: number;
  /** spike shimmy, degrees */
  spikeWiggle: number;
  bounceY: number;
  flip?: boolean;
};

// Small round hedgehog — scalloped spike coat, cream face and belly.
export const Hedgehog: React.FC<Props> = ({ frame, x, y, armAngle, spikeWiggle, bounceY, flip }) => {
  const breath = 1 + loopSin(frame, 3, 0.012);
  const blink = frame >= 68 && frame <= 74 ? 0.1 : frame >= 136 && frame <= 141 ? 0.1 : 1;

  return (
    <g transform={`translate(${x} ${y + bounceY}) scale(${flip ? -1 : 1} 1)`}>
      <g transform={`scale(1 ${breath})`}>
        {/* spike coat — scalloped ring over the back */}
        <g transform={`rotate(${spikeWiggle * 0.3})`}>
          {Array.from({ length: 9 }, (_, i) => {
            const a = Math.PI * (0.62 + (i / 8) * 0.95); // arc over the back
            const wob = loopSin(frame, 2, 3, i * 1.4) + spikeWiggle * (i % 2 ? 0.6 : -0.4);
            return (
              <circle
                key={i}
                cx={-15 + Math.cos(a) * 130 + wob}
                cy={-190 + Math.sin(a) * 125}
                r={44}
                fill={SPIKES}
                stroke={COLORS.ink}
                strokeWidth={5}
              />
            );
          })}
          <ellipse cx={-20} cy={-190} rx={135} ry={125} fill={SPIKES} />
        </g>

        {/* feet */}
        <ellipse cx={-70} cy={-8} rx={42} ry={20} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
        <ellipse cx={66} cy={-8} rx={42} ry={20} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />

        {/* body + belly */}
        <ellipse cx={5} cy={-130} rx={105} ry={115} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />

        {/* resting arm — mirrors the working arm (same shoulder height + length) so the pair reads level */}
        <g transform={`translate(-50 -110) rotate(-10)`}>
          <rect x={-15} y={0} width={30} height={75} rx={15} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
        </g>

        {/* face — pointed snout to the right */}
        <g transform={`scale(1 ${blink})`} transform-origin="40 -190">
          <circle cx={18} cy={-196} r={9} fill={COLORS.ink} />
          <circle cx={72} cy={-188} r={8} fill={COLORS.ink} />
        </g>
        {/* snout + nose */}
        <path d="M 60 -178 Q 105 -170 118 -156 Q 106 -146 84 -148 Z" fill={BODY} stroke={COLORS.ink} strokeWidth={5} strokeLinejoin="round" />
        <circle cx={116} cy={-155} r={10} fill={COLORS.ink} />
        <path d="M 70 -146 Q 62 -138 52 -138" fill="none" stroke={COLORS.ink} strokeWidth={4.5} strokeLinecap="round" />
        <ellipse cx={10} cy={-165} rx={13} ry={8} fill={COLORS.blush} opacity={0.85} />

        {/* working arm */}
        <g transform={`translate(60 -110) rotate(${armAngle})`}>
          <rect x={-15} y={0} width={30} height={75} rx={15} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
        </g>
      </g>
    </g>
  );
};
