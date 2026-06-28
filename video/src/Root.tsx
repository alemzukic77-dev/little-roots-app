import { Composition } from "remotion";
import { LOOP_FRAMES } from "./lib/utils";
import { AnimalSounds } from "./scenes/animal-sounds/Scene";
import { BananaSlicing } from "./scenes/banana-slicing/Scene";
import { BubbleChase } from "./scenes/bubble-chase/Scene";
import { FingerPainting } from "./scenes/finger-painting/Scene";
import { IceMeltTray } from "./scenes/ice-melt-tray/Scene";
import { MagneticFishing } from "./scenes/magnetic-fishing/Scene";
import { PomPomSorting } from "./scenes/pom-pom-sorting/Scene";
import { PlantWatering } from "./scenes/plant-watering/Scene";
import { PourYourOwnWater } from "./scenes/pour-your-own-water/Scene";
import { StackingRings } from "./scenes/stacking-rings/Scene";
import { ThreadingPasta } from "./scenes/threading-pasta/Scene";
import { arrangeScene, ARRANGE_SLUGS } from "./scenes/templates/arranges";
import { binScene, BIN_SLUGS } from "./scenes/templates/bins";
import { moveScene, MOVE_SLUGS } from "./scenes/templates/moves";
import { squishScene, SQUISH_SLUGS } from "./scenes/templates/squishes";
import { stampScene, STAMP_SLUGS } from "./scenes/templates/stamps";
import { talkScene, TALK_SLUGS } from "./scenes/templates/talks";
import { touchScene, TOUCH_SLUGS } from "./scenes/templates/touches";
import { transferScene } from "./scenes/templates/transfers";

const SHARED = { durationInFrames: LOOP_FRAMES, fps: 30, width: 1080, height: 1080 } as const;

// hero + early scenes keep their PascalCase ids; template scenes use the slug as id
const HEROES: [string, React.FC][] = [
  ["PomPomSorting", PomPomSorting],
  ["IceMeltTray", IceMeltTray],
  ["FingerPainting", FingerPainting],
  ["BananaSlicing", BananaSlicing],
  ["AnimalSounds", AnimalSounds],
  ["BubbleChase", BubbleChase],
  ["MagneticFishing", MagneticFishing],
  ["StackingRings", StackingRings],
  ["ThreadingPasta", ThreadingPasta],
  ["PourYourOwnWater", PourYourOwnWater],
  ["PlantWatering", PlantWatering],
];

const TEMPLATE_SETS: [string[], (slug: string) => React.FC][] = [
  [BIN_SLUGS, binScene],
  [STAMP_SLUGS, stampScene],
  [["tongs-transfer", "playdough-pinching", "rice-scoop", "sponge-squeeze", "cotton-ball-spoon", "ice-tray-transfer"], transferScene],
  [ARRANGE_SLUGS, arrangeScene],
  [SQUISH_SLUGS, squishScene],
  [TOUCH_SLUGS, touchScene],
  [TALK_SLUGS, talkScene],
  [MOVE_SLUGS, moveScene],
];

export const Root: React.FC = () => {
  const seen = new Set<string>();
  return (
    <>
      {HEROES.map(([id, C]) => {
        seen.add(id);
        return <Composition key={id} id={id} component={C} {...SHARED} />;
      })}
      {TEMPLATE_SETS.flatMap(([slugs, factory]) =>
        slugs
          .filter((s) => !seen.has(s) && (seen.add(s), true))
          .map((slug) => <Composition key={slug} id={slug} component={factory(slug)} {...SHARED} />),
      )}
    </>
  );
};
