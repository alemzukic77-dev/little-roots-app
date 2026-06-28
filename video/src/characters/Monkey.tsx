import React from "react";
import { COLORS, loopSin } from "../lib/utils";

const BODY = "#A9805B";
const FACE = "#F6E3C8";

type Props = {
  frame: number;
  x: number;
  y: number; // ground anchor
  /** chopping arm, degrees (0 = knife raised resting) */
  chopAngle: number;
  earWiggle: number;
  bounceY: number;
  /** show the child-safe knife in the working paw (banana-slicing only) */
  holdKnife?: boolean;
};

// Slim monkey with big round ears and a long curling tail, holding a child-safe knife.
export const Monkey: React.FC<Props> = ({ frame, x, y, chopAngle, earWiggle, bounceY, holdKnife }) => {
  const breath = 1 + loopSin(frame, 3, 0.012);
  const blink = frame >= 66 && frame <= 72 ? 0.1 : frame >= 134 && frame <= 139 ? 0.1 : 1;
  const tailWave = loopSin(frame, 2, 8);

  return (
    <g transform={`translate(${x} ${y + bounceY})`}>
      <g transform={`scale(1 ${breath})`}>
        {/* long curly tail */}
        <path
          d={`M -95 -130 C -180 -150 -200 ${-60 + tailWave} -160 ${-40 + tailWave} C -130 ${-25 + tailWave} -120 ${-70 + tailWave} -150 ${-80 + tailWave}`}
          fill="none"
          stroke={BODY}
          strokeWidth={22}
          strokeLinecap="round"
        />

        {/* legs */}
        <ellipse cx={-70} cy={-12} rx={46} ry={26} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
        <ellipse cx={70} cy={-12} rx={46} ry={26} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />

        {/* slim body */}
        <ellipse cx={0} cy={-145} rx={92} ry={125} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
        <ellipse cx={0} cy={-120} rx={56} ry={78} fill={FACE} />

        {/* left arm resting on belly */}
        <g transform="translate(-78 -195) rotate(20)">
          <rect x={-17} y={0} width={34} height={88} rx={17} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
        </g>

        {/* ears — big, round, wiggle on chop */}
        <g transform={`translate(-92 -330) rotate(${-earWiggle})`}>
          <circle r={34} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
          <circle r={17} fill={FACE} />
        </g>
        <g transform={`translate(92 -330) rotate(${earWiggle})`}>
          <circle r={34} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
          <circle r={17} fill={FACE} />
        </g>

        {/* head */}
        <circle cx={0} cy={-320} r={84} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
        {/* face plate */}
        <ellipse cx={0} cy={-302} rx={58} ry={48} fill={FACE} />
        <ellipse cx={-26} cy={-338} rx={24} ry={22} fill={FACE} />
        <ellipse cx={26} cy={-338} rx={24} ry={22} fill={FACE} />

        {/* eyes */}
        <g transform={`scale(1 ${blink})`} transform-origin="0 -332">
          <circle cx={-26} cy={-336} r={9} fill={COLORS.ink} />
          <circle cx={26} cy={-336} r={9} fill={COLORS.ink} />
        </g>
        {/* nostrils + smile */}
        <circle cx={-9} cy={-298} r={4} fill={COLORS.ink} />
        <circle cx={9} cy={-298} r={4} fill={COLORS.ink} />
        <path d="M -14 -282 Q 0 -270 14 -282" fill="none" stroke={COLORS.ink} strokeWidth={5} strokeLinecap="round" />
        <ellipse cx={-48} cy={-292} rx={13} ry={8} fill={COLORS.blush} opacity={0.85} />
        <ellipse cx={48} cy={-292} rx={13} ry={8} fill={COLORS.blush} opacity={0.85} />

        {/* working arm — pivots at shoulder; child-safe knife only when chopping */}
        <g transform={`translate(80 -200) rotate(${chopAngle})`}>
          <rect x={-17} y={0} width={34} height={92} rx={17} fill={BODY} stroke={COLORS.ink} strokeWidth={6} />
          {holdKnife ? (
            <g transform="translate(0 95) rotate(90)">
              <rect x={0} y={-7} width={56} height={14} rx={7} fill={COLORS.trayRim} stroke={COLORS.ink} strokeWidth={4} />
              <path d="M 54 -16 Q 110 -18 112 4 L 54 12 Z" fill={COLORS.white} stroke={COLORS.ink} strokeWidth={4} strokeLinejoin="round" />
            </g>
          ) : (
            <circle cx={0} cy={95} r={15} fill={FACE} stroke={COLORS.ink} strokeWidth={5} />
          )}
        </g>
      </g>
    </g>
  );
};
