import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

import { GridScreen } from "@/components/learn/GridScreen";
import { NUMBERS, type NumberItem } from "@/data/numbers";
import { colors, font, radius, shadow } from "@/theme/tokens";

const tint = colors.tint["fine-motor"];

export default function NumbersScreen() {
  const router = useRouter();
  return (
    <GridScreen
      title="Numbers"
      subtitle="Tap a number for counting ideas and a printable worksheet."
      data={NUMBERS}
      numColumns={3}
      keyExtractor={(x) => String(x.n)}
      renderItem={(x: NumberItem) => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${x.n}, ${x.word}`}
          onPress={() => router.push(`/number/${x.n}`)}
          style={({ pressed }) => [styles.tile, shadow.soft, pressed && { opacity: 0.9 }]}>
          <Text style={styles.num}>{x.n}</Text>
          <Text style={styles.emoji}>{x.emoji}</Text>
          <Text style={styles.word} numberOfLines={1}>{x.word}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    aspectRatio: 0.92,
    backgroundColor: colors.white,
    borderRadius: radius.inner,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingVertical: 10,
  },
  num: { fontFamily: font.extrabold, fontSize: 36, color: tint.fg, lineHeight: 42 },
  emoji: { fontSize: 24 },
  word: { fontFamily: font.semibold, fontSize: 12.5, color: colors.sub },
});
