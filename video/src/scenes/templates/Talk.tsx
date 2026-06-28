import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Sparkle } from "../../lib/Sparkle";
import { BEAT, COLORS, clamp01, loopSin } from "../../lib/utils";
import { CharacterView, type CharacterKind } from "./CharacterView";

export type Glyph =
  | "sun" | "cloud" | "rain" | "happy" | "sad" | "hand" | "apple" | "cube" | "book" | "note" | "star" | "heart" | "paw" | "photo";

export type TalkConfig = {
  character: CharacterKind;
  /** 4 glyphs cycled in the speech bubble, one per beat */
  glyphs: Glyph[];
  colors: string[];
};

const GlyphView: React.FC<{ kind: Glyph; color: string }> = ({ kind, color }) => {
  switch (kind) {
    case "sun":
      return <g>{Array.from({length:8},(_,i)=><rect key={i} x={-3} y={-46} width={6} height={16} rx={3} fill="#FFB938" transform={`rotate(${i*45})`} />)}<circle r={26} fill="#FFB938" stroke={COLORS.ink} strokeWidth={4} /></g>;
    case "cloud":
      return <g fill="#B7C4D6" stroke={COLORS.ink} strokeWidth={4}><circle cx={-18} cy={4} r={20} /><circle cx={12} cy={-2} r={26} /><circle cx={34} cy={8} r={18} /><rect x={-30} y={12} width={70} height={16} rx={8} stroke="none" /></g>;
    case "rain":
      return <g><g fill="#B7C4D6" stroke={COLORS.ink} strokeWidth={4}><circle cx={-12} cy={-12} r={18} /><circle cx={16} cy={-16} r={22} /></g>{[-16,4,24].map((x,i)=><path key={i} d={`M ${x} 14 q 6 8 0 16`} stroke="#5DAEDC" strokeWidth={5} fill="none" strokeLinecap="round" />)}</g>;
    case "happy":
      return <g><circle r={30} fill="#FFD23F" stroke={COLORS.ink} strokeWidth={4} /><circle cx={-10} cy={-6} r={4} fill={COLORS.ink} /><circle cx={10} cy={-6} r={4} fill={COLORS.ink} /><path d="M -12 8 Q 0 20 12 8" fill="none" stroke={COLORS.ink} strokeWidth={4} strokeLinecap="round" /></g>;
    case "sad":
      return <g><circle r={30} fill="#9CC0E8" stroke={COLORS.ink} strokeWidth={4} /><circle cx={-10} cy={-6} r={4} fill={COLORS.ink} /><circle cx={10} cy={-6} r={4} fill={COLORS.ink} /><path d="M -12 14 Q 0 4 12 14" fill="none" stroke={COLORS.ink} strokeWidth={4} strokeLinecap="round" /></g>;
    case "hand":
      return <g fill={color} stroke={COLORS.ink} strokeWidth={4}><rect x={-18} y={-6} width={36} height={34} rx={12} />{[-12,-4,4,12].map((x,i)=><rect key={i} x={x-3} y={-30} width={9} height={28} rx={4} />)}</g>;
    case "apple":
      return <g><circle r={26} fill="#E24B4A" stroke={COLORS.ink} strokeWidth={4} /><path d="M 0 -24 q 8 -12 16 -8" fill="none" stroke="#5C3A1E" strokeWidth={5} strokeLinecap="round" /><ellipse cx={10} cy={-26} rx={8} ry={5} fill="#3E7A4E" /></g>;
    case "cube":
      return <rect x={-24} y={-24} width={48} height={48} rx={8} fill={color} stroke={COLORS.ink} strokeWidth={4} />;
    case "book":
      return <g fill={color} stroke={COLORS.ink} strokeWidth={4}><path d="M 0 -22 L -30 -16 L -30 22 L 0 16 Z" /><path d="M 0 -22 L 30 -16 L 30 22 L 0 16 Z" fill={COLORS.white} /></g>;
    case "note":
      return <g fill={color}><ellipse cx={-8} cy={20} rx={13} ry={10} transform="rotate(-18 -8 20)" /><rect x={3} y={-30} width={6} height={50} /><path d="M 3 -30 Q 24 -24 28 -8 Q 16 -18 3 -16 Z" /></g>;
    case "star":
      return <circle r={26} fill="#FFB938" stroke={COLORS.ink} strokeWidth={4} />;
    case "heart":
      return <path d="M 0 22 C -34 -6 -22 -34 0 -16 C 22 -34 34 -6 0 22 Z" fill="#E24B4A" stroke={COLORS.ink} strokeWidth={4} strokeLinejoin="round" />;
    case "paw":
      return <g fill={color}><ellipse cy={10} rx={20} ry={16} />{[-14,-5,5,14].map((x,i)=><circle key={i} cx={x} cy={-12-(Math.abs(x)<8?5:0)} r={7} />)}</g>;
    case "photo":
      return <g><rect x={-28} y={-24} width={56} height={48} rx={6} fill={COLORS.white} stroke={COLORS.ink} strokeWidth={4} /><circle cx={-8} cy={-4} r={9} fill={color} /><path d="M -26 18 L -4 0 L 8 10 L 22 -6 L 26 18 Z" fill={color} opacity={0.6} /></g>;
  }
};

// language: character "talks", a speech bubble shows a glyph per beat, notes float up
export const Talk: React.FC<{ config: TalkConfig }> = ({ config }) => {
  const frame = useCurrentFrame();
  const cameraY = loopSin(frame, 1, 8);

  const beat = Math.min(Math.floor(frame / BEAT), 3);
  const inBeat = frame % BEAT;
  const glyphPop = interpolate(inBeat, [0, 5, 8, BEAT - 4, BEAT], [0, 1.15, 1, 1, 0.85], { extrapolateRight: "clamp" });

  // gentle "talking" bob + celebration hop
  const talkBob = loopSin(frame, 8, 4);
  const arm = frame < 4 * BEAT ? 8 + loopSin(frame, 4, 14) : interpolate(frame, [120, 127, 143, 150], [8, -150, -150, 8], { extrapolateRight: "clamp" });
  const impulse = loopSin(frame, 3, 5);
  const bounceY = (frame >= 120 ? -Math.abs(Math.sin((Math.PI * (frame - 120)) / 15)) * 22 : 0) + talkBob * 0.4;

  const notesBirths = [10, 18, 40, 48, 70, 78, 100, 108, 126, 134];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <svg viewBox="0 0 1080 1080" style={{ width: "100%", height: "100%" }}>
        <g transform={`translate(0 ${cameraY})`}>
          <circle cx={150} cy={170} r={115} fill={COLORS.creamDeep} opacity={0.55} />
          <circle cx={945} cy={130} r={75} fill={COLORS.creamDeep} opacity={0.45} />
          <ellipse cx={540} cy={930} rx={460} ry={44} fill={COLORS.shadow} opacity={0.55} />

          <CharacterView kind={config.character} frame={frame} arm={arm} impulse={impulse} bounceY={bounceY} x={320} y={892} />

          {/* speech bubble */}
          <g transform="translate(720 420)">
            <rect x={-130} y={-120} width={260} height={230} rx={40} fill={COLORS.white} stroke={COLORS.ink} strokeWidth={6} />
            <path d="M -70 105 L -110 175 L -28 110 Z" fill={COLORS.white} stroke={COLORS.ink} strokeWidth={6} strokeLinejoin="round" />
            <rect x={-122} y={108} width={120} height={14} fill={COLORS.white} />
            <g transform={`translate(0 -8) scale(${glyphPop})`}>
              <GlyphView kind={config.glyphs[beat % config.glyphs.length]} color={config.colors[beat % config.colors.length]} />
            </g>
          </g>

          {/* floating notes */}
          {notesBirths.map((b, i) => {
            const t = (frame - b) / 30;
            if (t < 0 || t > 1) return null;
            const o = Math.sin(Math.PI * t);
            return (
              <g key={i} transform={`translate(${500 + (i % 3) * 30 + 60 * t} ${360 - 150 * t}) scale(${0.7 + t * 0.3})`} opacity={o} fill={config.colors[i % config.colors.length]}>
                <ellipse cx={-8} cy={16} rx={11} ry={8} transform="rotate(-18 -8 16)" />
                <rect x={1} y={-26} width={5} height={42} />
                <path d="M 1 -26 Q 20 -20 24 -6 Q 13 -16 1 -14 Z" />
              </g>
            );
          })}

          {[
            [200, 300],[560, 240],[700, 600],[980, 540],[420, 520],[880, 300],
          ].map(([sx, sy], i) => (
            <Sparkle key={i} x={sx} y={sy} born={122 + i * 3} frame={frame} size={22 + (i % 3) * 8} color={config.colors[i % config.colors.length]} />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
