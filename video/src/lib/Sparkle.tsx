import React from "react";

export const Sparkle: React.FC<{
  x: number;
  y: number;
  born: number;
  frame: number;
  size: number;
  color?: string;
}> = ({ x, y, born, frame, size, color = "#FFB938" }) => {
  const life = 12;
  const t = (frame - born) / life;
  if (t < 0 || t > 1) return null;
  const s = Math.sin(Math.PI * t) * size;
  return (
    <g transform={`translate(${x} ${y}) rotate(${t * 90}) scale(${s})`} opacity={0.9}>
      <path
        d="M 0 -1 Q 0.18 -0.18 1 0 Q 0.18 0.18 0 1 Q -0.18 0.18 -1 0 Q -0.18 -0.18 0 -1 Z"
        fill={color}
      />
    </g>
  );
};
