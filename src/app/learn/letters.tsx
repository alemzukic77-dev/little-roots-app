import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

import { GridScreen } from "@/components/learn/GridScreen";
import { LETTERS, type Letter } from "@/data/letters";
import { colors, font, radius, shadow } from "@/theme/tokens";

const tint = colors.tint.language;

export default function LettersScreen() {
  const router = useRouter();
  return (
    <GridScreen
      title="Letters"
      subtitle="Tap a letter for Montessori ideas and a printable tracing sheet."
      data={LETTERS}
      numColumns={3}
      keyExtractor={(l) => l.letter}
      renderItem={(l: Letter) => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${l.letter} is for ${l.word}`}
          onPress={() => router.push(`/letter/${l.letter}`)}
          style={({ pressed }) => [styles.tile, shadow.soft, pressed && { opacity: 0.9 }]}>
          <Text style={styles.letter}>{l.letter}</Text>
          <Text style={styles.emoji}>{l.emoji}</Text>
          <Text style={styles.word} numberOfLines={1}>{l.word}</Text>
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
  letter: { fontFamily: font.extrabold, fontSize: 34, color: tint.fg, lineHeight: 40 },
  emoji: { fontSize: 26 },
  word: { fontFamily: font.semibold, fontSize: 12.5, color: colors.sub },
});
