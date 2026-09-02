import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getLetter, teachingIdeas } from "@/data/letters";
import { printLetterWorksheet } from "@/lib/worksheet";
import { colors, font, radius, shadow } from "@/theme/tokens";

const tint = colors.tint.language;

export default function LetterDetailScreen() {
  const { letter } = useLocalSearchParams<{ letter: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [printing, setPrinting] = useState(false);

  const data = getLetter(letter ?? "");

  if (!data) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>Letter not found.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.missingBack}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const ideas = teachingIdeas(data);
  const lower = data.letter.toLowerCase();

  async function onPrint() {
    if (printing || !data) return;
    setPrinting(true);
    try {
      await printLetterWorksheet(data);
    } finally {
      setPrinting(false);
    }
  }

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
        <View style={[styles.hero, { paddingTop: insets.top + 64 }]}>
          <Text style={styles.heroLetters}>
            {data.letter}
            <Text style={styles.heroLower}>{lower}</Text>
          </Text>
          <Text style={styles.heroEmoji}>{data.emoji}</Text>
          <Text style={styles.heroAnchor}>
            {data.letter} is for {data.word}
          </Text>
          <View style={styles.soundChip}>
            <Ionicons name="volume-medium-outline" size={15} color={tint.fg} />
            <Text style={styles.soundText}>Say the sound: “/{data.sound}/”</Text>
          </View>
        </View>

        <View style={styles.sheet}>
          <Pressable
            accessibilityRole="button"
            disabled={printing}
            onPress={onPrint}
            style={({ pressed }) => [styles.printBtn, pressed && { opacity: 0.9 }, printing && { opacity: 0.6 }]}>
            <Ionicons name="print-outline" size={19} color={colors.white} />
            <Text style={styles.printText}>{printing ? "Preparing…" : "Print tracing worksheet"}</Text>
          </Pressable>
          <Text style={styles.printHint}>
            Opens your print & share options — AirPrint it or save the PDF to Files, then trace on paper together.
          </Text>

          <Text style={styles.sectionTitle}>Ways to teach it</Text>
          {ideas.map((idea, i) => (
            <View key={idea.title} style={styles.ideaCard}>
              <View style={styles.ideaNumber}>
                <Text style={styles.ideaNumberText}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.ideaTitle}>{idea.title}</Text>
                <Text style={styles.ideaBody}>{idea.body}</Text>
              </View>
            </View>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 26 }]}>Starts with {data.letter}</Text>
          <View style={styles.objectWrap}>
            {data.objects.map((o) => (
              <View key={o} style={styles.objectChip}>
                <Text style={styles.objectText}>{o}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.topActions, { top: insets.top + 6 }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.circleButton, shadow.soft, pressed && { opacity: 0.85 }]}>
          <Ionicons name="close" size={20} color={colors.ink} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  missing: {
    flex: 1,
    backgroundColor: colors.cream,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  missingText: { fontFamily: font.semibold, fontSize: 16, color: colors.inkSoft },
  missingBack: { fontFamily: font.bold, fontSize: 15, color: colors.ember },
  hero: {
    backgroundColor: tint.bg,
    alignItems: "center",
    paddingBottom: 34,
    borderBottomLeftRadius: radius.card,
    borderBottomRightRadius: radius.card,
  },
  heroLetters: {
    fontFamily: font.extrabold,
    fontSize: 96,
    lineHeight: 104,
    color: tint.fg,
  },
  heroLower: {
    fontFamily: font.extrabold,
    fontSize: 96,
    color: tint.fg,
    opacity: 0.55,
  },
  heroEmoji: { fontSize: 52, marginTop: 4 },
  heroAnchor: {
    fontFamily: font.bold,
    fontSize: 20,
    color: colors.ink,
    marginTop: 10,
  },
  soundChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 14,
  },
  soundText: {
    fontFamily: font.semibold,
    fontSize: 13.5,
    color: tint.fg,
  },
  sheet: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  printBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    backgroundColor: colors.ember,
    borderRadius: radius.button,
    height: 54,
  },
  printText: {
    fontFamily: font.bold,
    fontSize: 15,
    color: colors.white,
  },
  printHint: {
    fontFamily: font.medium,
    fontSize: 13,
    lineHeight: 20,
    color: colors.sub,
    marginTop: 10,
    marginBottom: 6,
    textAlign: "center",
  },
  sectionTitle: {
    fontFamily: font.bold,
    fontSize: 18,
    color: colors.ink,
    marginTop: 22,
    marginBottom: 12,
  },
  ideaCard: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    backgroundColor: colors.white,
    borderRadius: radius.inner,
    padding: 16,
    marginBottom: 12,
  },
  ideaNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: tint.fg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  ideaNumberText: {
    fontFamily: font.bold,
    fontSize: 13,
    color: colors.white,
  },
  ideaTitle: {
    fontFamily: font.bold,
    fontSize: 15.5,
    color: colors.ink,
    marginBottom: 4,
  },
  ideaBody: {
    fontFamily: font.medium,
    fontSize: 14,
    lineHeight: 21,
    color: colors.inkSoft,
  },
  objectWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  objectChip: {
    backgroundColor: tint.bg,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  objectText: {
    fontFamily: font.semibold,
    fontSize: 14,
    color: tint.fg,
  },
  topActions: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  circleButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
});
