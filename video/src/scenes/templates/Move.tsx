import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Sparkle } from "../../lib/Sparkle";
import { BEAT, COLORS, clamp01, loopSin, LOOP_FRAMES } from "../../lib/utils";
import { CharacterView, type CharacterKind } from "./CharacterView";

export type Prop = "ball" | "balloon" | "ribbon" | "cushions" | "stones" | "tunnel" | "silk" | "bubblewrap" | "parade";
export type MoveConfig = {
  character: CharacterKind;
  prop: Prop;
  colors: string[];
};

const PropView: React.FC<{ kind: Prop; frame: number; colors: string[] }> = ({ kind, frame, colors }) => {
  const c0 = colors[0], c1 = colors[1] ?? colors[0], c2 = colors[2] ?? colors[0];
  switch (kind) {
    case "ball": {
      const t = (frame % BEAT) / BEAT;
      const x = 760 + Math.sin((frame / LOOP_FRAMES) * Math.PI * 2) * 180;
      const y = 880 - Math.abs(Math.sin(t * Math.PI)) * 60;
      return <g transform={`translate(${x} ${y}) rotate(${frame * 6})`}><circle r={46} fill={c0} stroke={COLORS.ink} strokeWidth={6} /><path d="M -46 0 A 46 46 0 0 1 46 0" fill="none" stroke={COLORS.ink} strokeWidth={4} opacity={0.4} /></g>;
    }
    case "balloon": {
      const y = 560 + loopSin(frame, 3, 40);
      const x = 780 + loopSin(frame, 2, 30);
      return <g transform={`translate(${x} ${y})`}><ellipse rx={50} ry={60} fill={c0} stroke={COLORS.ink} strokeWidth={6} /><path d="M 0 60 L 0 150" stroke={COLORS.ink} strokeWidth={3} /><path d="M -8 60 L 0 70 L 8 60 Z" fill={c0} stroke={COLORS.ink} strokeWidth={3} /></g>;
    }
    case "ribbon": {
      const mk = (amp: number, off: number) =>
        Array.from({ length: 14 }, (_, i) => `${600 + i * 34} ${600 + Math.sin(frame * 0.2 + i * 0.55 + off) * amp}`).join(" ");
      return (
        <g>
          <polyline points={mk(52, 0.5)} fill="none" stroke={c1} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" opacity={0.55} />
          <polyline points={mk(46, 0)} fill="none" stroke={c0} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
          {/* wand handle */}
          <circle cx={600} cy={600} r={14} fill={COLORS.trayRim} stroke={COLORS.ink} strokeWidth={4} />
        </g>
      );
    }
    case "cushions":
      return <g>{[0,1,2].map(k=><rect key={k} x={720 - k*10} y={880 - k*52} width={200 + k*4} height={50} rx={16} fill={colors[k % colors.length]} stroke={COLORS.ink} strokeWidth={6} />)}</g>;
    case "stones":
      return <g>{[0,1,2,3].map(k=>{const pop=clamp01(1-Math.abs((frame%LOOP_FRAMES)/BEAT-k)*1.5);return <g key={k}><ellipse cx={636+k*112} cy={902} rx={58} ry={22} fill={COLORS.shadow} opacity={0.5} /><ellipse cx={636+k*112} cy={896-pop*16} rx={56} ry={26} fill={colors[k%colors.length]} stroke={COLORS.ink} strokeWidth={6} />{pop>0.4&&<ellipse cx={636+k*112} cy={896-pop*16} rx={56} ry={26} fill="none" stroke="#FFB938" strokeWidth={4} opacity={pop*0.8} />}</g>;})}</g>;
    case "tunnel":
      return <g><path d="M 600 900 A 160 160 0 0 1 920 900 Z" fill={c0} stroke={COLORS.ink} strokeWidth={6} /><ellipse cx={760} cy={900} rx={70} ry={40} fill={COLORS.ink} opacity={0.55} /></g>;
    case "silk": {
      const wave = (off: number, amp: number) => Array.from({ length: 11 }, (_, i) => `${600 + i * 46},${600 + Math.sin(frame * 0.16 + i * 0.6 + off) * amp}`);
      const top = wave(0, 56);
      return (
        <g>
          <path d={`M 600 600 ${top.map((p) => `L ${p}`).join(" ")} L 1060 820 L 600 820 Z`} fill={c0} opacity={0.78} stroke={c1} strokeWidth={5} strokeLinejoin="round" />
          {wave(0.4, 44).filter((_, i) => i % 2 === 0).map((p, i) => <circle key={i} cx={p.split(",")[0]} cy={p.split(",")[1]} r={4} fill={COLORS.white} opacity={0.5} />)}
        </g>
      );
    }
    case "bubblewrap":
      return <g>{Array.from({length:12},(_,i)=>{const col=i%4,row=Math.floor(i/4);const pop=clamp01(1-Math.abs((frame%LOOP_FRAMES)/12-i)*0.8);return <circle key={i} cx={660+col*90} cy={840+row*40} r={pop>0.5?9:18} fill="#CDE3F2" stroke="#5DAEDC" strokeWidth={3} />;})}</g>;
    case "parade":
      return <g>{[0,1,2,3].map(k=>{const x=(((frame*4+k*150)%(LOOP_FRAMES*4))/(LOOP_FRAMES*4))*640+540;const hop=-Math.abs(Math.sin((frame*0.22+k*1.7)))*22;const legw=Math.sin(frame*0.4+k);return <g key={k} transform={`translate(${x} ${856+hop})`}><ellipse cx={0} cy={50} rx={44} ry={14} fill={COLORS.shadow} opacity={0.4} /><rect x={-14+legw*6} y={28} width={11} height={24} rx={5} fill={colors[k%colors.length]} stroke={COLORS.ink} strokeWidth={3} /><rect x={5-legw*6} y={28} width={11} height={24} rx={5} fill={colors[k%colors.length]} stroke={COLORS.ink} strokeWidth={3} /><ellipse rx={40} ry={36} fill={colors[k%colors.length]} stroke={COLORS.ink} strokeWidth={5} /><circle cx={26} cy={-26} r={14} fill={colors[k%colors.length]} stroke={COLORS.ink} strokeWidth={5} /><circle cx={32} cy={-30} r={4} fill={COLORS.ink} /><circle cx={-10} cy={-2} r={4} fill={COLORS.ink} /><circle cx={12} cy={-2} r={4} fill={COLORS.ink} /></g>;})}</g>;
  }
};

// physical play: character hops/dances; a configurable prop loops alongside
export const Move: React.FC<{ config: MoveConfig }> = ({ config }) => {
  const frame = useCurrentFrame();
  const cameraY = loopSin(frame, 1, 8);

  // continuous joyful hop, one per beat
  const p = frame % BEAT;
  const hop = -Math.abs(Math.sin((Math.PI * clamp01(p / 20)))) * 56;
  const arm = frame < 4 * BEAT ? -60 + loopSin(frame, 8, 48) : interpolate(frame, [120, 127, 143, 150], [-60, -150, -150, -60], { extrapolateRight: "clamp" });
  const impulse = 8 + loopSin(frame, 4, 8);
  const bounceY = hop + (frame >= 120 ? -Math.abs(Math.sin((Math.PI * (frame - 120)) / 15)) * 10 : 0);
  // dance: tilt the whole body side to side
  const sway = loopSin(frame, 4, 6);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <svg viewBox="0 0 1080 1080" style={{ width: "100%", height: "100%" }}>
        <g transform={`translate(0 ${cameraY})`}>
          <circle cx={150} cy={170} r={115} fill={COLORS.creamDeep} opacity={0.55} />
          <circle cx={945} cy={130} r={75} fill={COLORS.creamDeep} opacity={0.45} />
          {config.colors.slice(0, 4).map((c, i) => (
            <circle key={i} cx={130 + i * 270} cy={300 + loopSin(frame, 2, 14, i * 1.7)} r={13} fill={c} opacity={0.3} />
          ))}
          <ellipse cx={540} cy={930} rx={470} ry={44} fill={COLORS.shadow} opacity={0.55} />

          <g transform={`rotate(${sway} 300 892)`}>
            <CharacterView kind={config.character} frame={frame} arm={arm} impulse={impulse} bounceY={bounceY} x={300} y={892} />
          </g>

          <PropView kind={config.prop} frame={frame} colors={config.colors} />

          {[
            [200, 320],[560, 260],[700, 560],[980, 520],[440, 500],[860, 320],
          ].map(([sx, sy], i) => (
            <Sparkle key={i} x={sx} y={sy} born={122 + i * 3} frame={frame} size={22 + (i % 3) * 8} color={config.colors[i % config.colors.length]} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
