import Svg, { Circle, Ellipse, Path, Polygon, Rect } from "react-native-svg";

// Crisp vector shapes for the Shapes learning section (grid tiles + hero).
type Props = {
  id: string;
  size: number;
  color: string;
  /** outline only (for tracing feel) vs solid fill */
  outline?: boolean;
};

const STAR = "50,5 63,38 98,38 70,59 82,92 50,72 18,92 30,59 2,38 37,38";
const HEART =
  "M50,84 C20,62 8,42 8,28 C8,15 18,10 28,10 C38,10 46,18 50,26 C54,18 62,10 72,10 C82,10 92,15 92,28 C92,42 80,62 50,84 Z";
const DIAMOND = "50,6 92,50 50,94 8,50";
const TRIANGLE = "50,10 90,86 10,86";

export function ShapeGlyph({ id, size, color, outline }: Props) {
  const fill = outline ? "none" : color;
  const stroke = color;
  const sw = outline ? 6 : 0;
  const common = { fill, stroke, strokeWidth: sw, strokeLinejoin: "round" as const };

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {id === "circle" && <Circle cx={50} cy={50} r={44} {...common} />}
      {id === "square" && <Rect x={8} y={8} width={84} height={84} rx={8} {...common} />}
      {id === "rectangle" && <Rect x={6} y={26} width={88} height={48} rx={8} {...common} />}
      {id === "oval" && <Ellipse cx={50} cy={50} rx={45} ry={30} {...common} />}
      {id === "triangle" && <Polygon points={TRIANGLE} {...common} />}
      {id === "diamond" && <Polygon points={DIAMOND} {...common} />}
      {id === "star" && <Polygon points={STAR} {...common} />}
      {id === "heart" && <Path d={HEART} {...common} />}
    </Svg>
  );
}
