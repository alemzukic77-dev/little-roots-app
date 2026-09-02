import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { GridScreen } from "@/components/learn/GridScreen";
import { COLORS_DATA, type ColorItem } from "@/data/colors";
import { colors, font, radius, shadow } from "@/theme/tokens";

export default function ColorsScreen() {
  const router = useRouter();
  return (
    <GridScreen
      title="Colours"
      subtitle="Tap a colour for a colour-hunt idea and a printable page."
      data={COLORS_DATA}
      numColumns={2}
      keyExtractor={(c) => c.id}
      renderItem={(c: ColorItem) => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={c.name}
          onPress={() => router.push(`/color/${c.id}`)}
          style={({ pressed }) => [styles.tile, shadow.soft, pressed && { opacity: 0.9 }]}>
          <View
            style={[
              styles.swatch,
              { backgroundColor: c.hex },
              c.hex.toUpperCase() === "#FFFFFF" && { borderWidth: 2, borderColor: colors.line },
            ]}
          />
          <Text style={styles.name}>{c.name}</Text>
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
    gap: 10,
    paddingVertical: 22,
  },
  swatch: { width: 64, height: 64, borderRadius: 20 },
  name: { fontFamily: font.bold, fontSize: 15, color: colors.ink },
});
