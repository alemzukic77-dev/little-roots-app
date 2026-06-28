import React from "react";

type Props = {
  x: number;
  y: number;
  r: number;
  color: string;
  light: string;
  scale?: number;
  rotation?: number;
};

// Fluffy pom-pom: main disc + ring of lighter tufts.
export const PomPom: React.FC<Props> = ({ x, y, r, color, light, scale = 1, rotation = 0 }) => {
  const tufts = 7;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}>
      <circle r={r} fill={color} />
      {Array.from({ length: tufts }, (_, i) => {
        const a = (i / tufts) * Math.PI * 2;
        return (
          <circle
            key={i}
            cx={Math.cos(a) * r * 0.62}
            cy={Math.sin(a) * r * 0.62}
            r={r * 0.34}
            fill={light}
            opacity={0.55}
          />
        );
      })}
      <circle r={r * 0.38} fill={light} opacity={0.5} />
    </g>
  );
};
