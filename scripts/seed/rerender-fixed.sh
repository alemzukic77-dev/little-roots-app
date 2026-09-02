#!/bin/bash
# Re-render every scene that uses one of the fixed characters (lion, cat, fox,
# elephant, hedgehog) so the corrected anatomy lands in out/<slug>.mp4.
set -uo pipefail
cd "$(dirname "$0")/../../video" || exit 1

# affected template slugs (composition id == kebab slug == output filename)
TEMPLATE_SLUGS=$(grep -rhoE '"[a-z0-9-]+": \{ character: "(lion|cat|fox|elephant|hedgehog)"' src/scenes/templates/*.tsx \
  | sed -E 's/^"([a-z0-9-]+)".*/\1/' | sort -u)

# affected hero scenes: "CompositionId:output-slug"
HEROES="FingerPainting:finger-painting MagneticFishing:magnetic-fishing PlantWatering:plant-watering PourYourOwnWater:pour-your-own-water ThreadingPasta:threading-pasta"

TOTAL=$(( $(echo "$TEMPLATE_SLUGS" | wc -w) + $(echo "$HEROES" | wc -w) ))
echo "=== Re-rendering $TOTAL affected scenes ==="
i=0
FAILED=""

for s in $TEMPLATE_SLUGS; do
  i=$((i+1))
  echo "[$i/$TOTAL] $s"
  npx remotion render "$s" "out/$s.mp4" --log=error || FAILED="$FAILED $s"
done

for pair in $HEROES; do
  id="${pair%%:*}"; slug="${pair##*:}"
  i=$((i+1))
  echo "[$i/$TOTAL] $id -> out/$slug.mp4"
  npx remotion render "$id" "out/$slug.mp4" --log=error || FAILED="$FAILED $slug"
done

echo "=== DONE. rendered $((TOTAL - $(echo $FAILED | wc -w)))/$TOTAL ==="
[ -n "$FAILED" ] && echo "FAILED:$FAILED"
exit 0
