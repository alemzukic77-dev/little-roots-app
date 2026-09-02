import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { LearnDetail } from "@/components/learn/LearnDetail";
import { getNumber, numberIdeas } from "@/data/numbers";
import { printNumberWorksheet } from "@/lib/worksheet";
import { colors, font } from "@/theme/tokens";

const tint = colors.tint["fine-motor"];

export default function NumberDetailScreen() {
  const { n } = useLocalSearchParams<{ n: string }>();
  const router = useRouter();
  const x = getNumber(n ?? "");

  if (!x) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>Number not found.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.missingBack}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <LearnDetail
      hero={
        <View style={{ alignItems: "center", gap: 6 }}>
          <Text style={[styles.digit, { color: tint.fg }]}>{x.n}</Text>
          <Text style={styles.emojiRow}>{x.emoji.repeat(x.n)}</Text>
        </View>
      }
      heroBg={tint.bg}
      accentFg={tint.fg}
      title={x.word}
      subtitle={`Count to ${x.n} out loud together`}
      ideas={numberIdeas(x)}
      examples={x.objects}
      examplesLabel={`Count ${x.n} of these`}
      onPrint={() => printNumberWorksheet(x)}
      printLabel="Print number worksheet"
      printHint="Trace the number and count on paper — then hunt for real things to count."
    />
  );
}

const styles = StyleSheet.create({
  digit: { fontFamily: font.extrabold, fontSize: 92, lineHeight: 100 },
  emojiRow: { fontSize: 22, textAlign: "center" },
  missing: { flex: 1, backgroundColor: colors.cream, alignItems: "center", justifyContent: "center", gap: 12 },
  missingText: { fontFamily: font.semibold, fontSize: 16, color: colors.inkSoft },
  missingBack: { fontFamily: font.bold, fontSize: 15, color: colors.ember },
});
