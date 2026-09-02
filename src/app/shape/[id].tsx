import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { LearnDetail } from "@/components/learn/LearnDetail";
import { ShapeGlyph } from "@/components/learn/ShapeGlyph";
import { getShape, shapeIdeas } from "@/data/shapes";
import { printShapeWorksheet } from "@/lib/worksheet";
import { colors, font } from "@/theme/tokens";

export default function ShapeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const s = getShape(id ?? "");

  if (!s) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>Shape not found.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.missingBack}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <LearnDetail
      hero={<ShapeGlyph id={s.id} size={120} color={s.color} />}
      heroBg={colors.creamDeep}
      accentFg={s.color}
      title={s.name}
      subtitle={`Look for the ${s.name.toLowerCase()} all around you`}
      ideas={shapeIdeas(s)}
      examples={s.examples}
      examplesLabel={`${s.name}s all around`}
      onPrint={() => printShapeWorksheet(s)}
      printLabel="Print tracing sheet"
      printHint="Trace the outline slowly with a finger or crayon, then go on a shape hunt."
    />
  );
}

const styles = StyleSheet.create({
  missing: { flex: 1, backgroundColor: colors.cream, alignItems: "center", justifyContent: "center", gap: 12 },
  missingText: { fontFamily: font.semibold, fontSize: 16, color: colors.inkSoft },
  missingBack: { fontFamily: font.bold, fontSize: 15, color: colors.ember },
});
