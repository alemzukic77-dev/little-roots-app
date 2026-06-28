import React from "react";
import { COLORS } from "../../lib/utils";

type CupProps = {
  x: number;
  y: number; // top-center of the cup opening
  color: string;
  light: string;
  squash?: number; // 0..1 landing pulse
};

const W = 104;
const H = 96;

// Split in two layers so a pom-pom can visually sink INTO the cup:
// CupBack renders behind the pom, CupFront (the near rim/wall) in front.

export const CupBack: React.FC<CupProps> = ({ x, y, color, light, squash = 0 }) => {
  const s = 1 + squash * 0.1;
  return (
    <g transform={`translate(${x} ${y}) scale(${1 / s} ${s})`}>
      <ellipse cx={0} cy={0} rx={W / 2} ry={14} fill={light} stroke={color} strokeWidth={5} />
    </g>
  );
};

export const CupFront: React.FC<CupProps> = ({ x, y, color, light, squash = 0 }) => {
  const s = 1 + squash * 0.1;
  return (
    <g transform={`translate(${x} ${y}) scale(${1 / s} ${s})`}>
      {/* tapered cup body */}
      <path
        d={`M ${-W / 2} 0
            L ${-W / 2 + 12} ${H}
            Q 0 ${H + 14} ${W / 2 - 12} ${H}
            L ${W / 2} 0
            A ${W / 2} 14 0 0 0 ${-W / 2} 0
            Z`}
        fill={COLORS.white}
        stroke={color}
        strokeWidth={5}
      />
      {/* color band */}
      <path
        d={`M ${-W / 2 + 3} 22 L ${W / 2 - 3} 22 L ${W / 2 - 6} 44 L ${-W / 2 + 6} 44 Z`}
        fill={light}
      />
      {/* front rim arc */}
      <path
        d={`M ${-W / 2} 0 A ${W / 2} 14 0 0 0 ${W / 2} 0`}
        fill="none"
        stroke={color}
        strokeWidth={5}
      />
    </g>
  );
};
