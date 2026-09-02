import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { GridScreen } from "@/components/learn/GridScreen";
import { ShapeGlyph } from "@/components/learn/ShapeGlyph";
import { SHAPES, type ShapeItem } from "@/data/shapes";
import { colors, font, radius, shadow } from "@/theme/tokens";

export default function ShapesScreen() {
  const router = useRouter();
  return (
    <GridScreen
      title="Shapes"
      subtitle="Tap a shape for a shape-hunt idea and a printable tracing sheet."
      data={SHAPES}
      numColumns={2}
      keyExtractor={(s) => s.id}
      renderItem={(s: ShapeItem) => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={s.name}
          onPress={() => router.push(`/shape/${s.id}`)}
          style={({ pressed }) => [styles.tile, shadow.soft, pressed && { opacity: 0.9 }]}>
          <View style={styles.glyph}>
            <ShapeGlyph id={s.id} size={64} color={s.color} outline />
          </View>
          <Text style={styles.name}>{s.name}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.inner,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 24,
  },
  glyph: { height: 72, alignItems: "center", justifyContent: "center" },
  name: { fontFamily: font.bold, fontSize: 15, color: colors.ink },
});
