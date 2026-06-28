import React from "react";
import { Bunny } from "../../characters/Bunny";
import { Cat } from "../../characters/Cat";
import { Elephant } from "../../characters/Elephant";
import { Fox } from "../../characters/Fox";
import { Hedgehog } from "../../characters/Hedgehog";
import { Lion } from "../../characters/Lion";
import { Monkey } from "../../characters/Monkey";
import { Penguin } from "../../characters/Penguin";
import { loopSin } from "../../lib/utils";

export type CharacterKind =
  | "bunny"
  | "penguin"
  | "lion"
  | "monkey"
  | "fox"
  | "cat"
  | "hedgehog"
  | "elephant";

/**
 * Uniform facade over all characters for template scenes:
 * `arm` drives the working limb, `impulse` the secondary life
 * (ears/tail/spikes), `bounceY` the celebration hop.
 */
export const CharacterView: React.FC<{
  kind: CharacterKind;
  frame: number;
  arm: number;
  impulse: number;
  bounceY: number;
  x?: number;
  y?: number;
}> = ({ kind, frame, arm, impulse, bounceY, x = 285, y = 892 }) => {
  switch (kind) {
    case "bunny":
      return <Bunny frame={frame} x={x} y={y} earWiggle={impulse} rightArmAngle={arm} leftArmAngle={8 + loopSin(frame, 3, 3)} bounceY={bounceY} />;
    case "penguin":
      return <Penguin frame={frame} x={x} y={y} rock={impulse * 0.5} flipperR={arm + 12} flipperL={-12 - loopSin(frame, 3, 4)} bounceY={bounceY} />;
    case "lion":
      return <Lion frame={frame} x={x} y={y} pawAngle={arm} tailSwish={loopSin(frame, 2, 10) + impulse} bounceY={bounceY} />;
    case "monkey":
      return <Monkey frame={frame} x={x} y={y} chopAngle={arm} earWiggle={impulse} bounceY={bounceY} />;
    case "fox":
      return <Fox frame={frame} x={x} y={y} armAngle={arm} tailSwish={loopSin(frame, 2, 9) + impulse} earWiggle={impulse * 0.8} bounceY={bounceY} />;
    case "cat":
      return <Cat frame={frame} x={x} y={y} armAngle={arm} tailSwish={loopSin(frame, 2, 9) + impulse} earWiggle={impulse * 0.8} bounceY={bounceY} />;
    case "hedgehog":
      return <Hedgehog frame={frame} x={x} y={y} armAngle={arm} spikeWiggle={impulse} bounceY={bounceY} />;
    case "elephant":
      return <Elephant frame={frame} x={x} y={y} armAngle={arm} trunkCurl={0.15 + impulse * 0.01} earFlap={loopSin(frame, 2, 4) + impulse * 0.5} bounceY={bounceY} />;
  }
};
