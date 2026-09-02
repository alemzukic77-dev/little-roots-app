import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, type ReactNode } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, font, radius, shadow } from "@/theme/tokens";

export type LearnIdea = { title: string; body: string };

type Props = {
  hero: ReactNode;
  heroBg: string;
  accentFg: string;
  title: string;
  subtitle: string;
  chip?: string;
  chipIcon?: keyof typeof Ionicons.glyphMap;
  ideas: LearnIdea[];
  examples: string[];
  examplesLabel: string;
  /** Optional printable worksheet. */
  onPrint?: () => Promise<void> | void;
  printLabel?: string;
  printHint?: string;
};

/** Shared detail layout for Numbers / Shapes / Colors (mirrors the letter screen). */
export function LearnDetail({
  hero,
  heroBg,
  accentFg,
  title,
  subtitle,
  chip,
  chipIcon,
  ideas,
  examples,
  examplesLabel,
  onPrint,
  printLabel = "Print worksheet",
  printHint,
}: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [printing, setPrinting] = useState(false);

  async function handlePrint() {
    if (printing || !onPrint) return;
    setPrinting(true);
    try {
      await onPrint();
    } catch {
      Alert.alert("Couldn't open the worksheet", "Please try again in a moment.");
    } finally {
      setPrinting(false);
    }
  }

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
        <View style={[styles.hero, { backgroundColor: heroBg, paddingTop: insets.top + 64 }]}>
          <View style={styles.heroGlyph}>{hero}</View>
          <Text style={[styles.title, { color: colors.ink }]}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          {chip && (
            <View style={styles.chip}>
              {chipIcon && <Ionicons name={chipIcon} size={15} color={accentFg} />}
              <Text style={[styles.chipText, { color: accentFg }]}>{chip}</Text>
            </View>
          )}
        </View>

        <View style={styles.sheet}>
          {onPrint && (
            <>
              <Pressable
                accessibilityRole="button"
                disabled={printing}
                onPress={handlePrint}
                style={({ pressed }) => [styles.printBtn, pressed && { opacity: 0.9 }, printing && { opacity: 0.6 }]}>
                <Ionicons name="print-outline" size={19} color={colors.white} />
                <Text style={styles.printText}>{printing ? "Preparing…" : printLabel}</Text>
              </Pressable>
              {printHint && <Text style={styles.printHintText}>{printHint}</Text>}
            </>
          )}

          <Text style={styles.sectionTitle}>Ways to teach it</Text>
          {ideas.map((idea, i) => (
            <View key={idea.title} style={styles.ideaCard}>
              <View style={[styles.ideaNumber, { backgroundColor: accentFg }]}>
                <Text style={styles.ideaNumberText}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.ideaTitle}>{idea.title}</Text>
                <Text style={styles.ideaBody}>{idea.body}</Text>
              </View>
            </View>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 26 }]}>{examplesLabel}</Text>
          <View style={styles.exampleWrap}>
            {examples.map((o) => (
              <View key={o} style={[styles.exampleChip, { backgroundColor: heroBg }]}>
                <Text style={[styles.exampleText, { color: accentFg }]}>{o}</Text>
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
  hero: {
    alignItems: "center",
    paddingBottom: 34,
    borderBottomLeftRadius: radius.card,
    borderBottomRightRadius: radius.card,
  },
  heroGlyph: { alignItems: "center", justifyContent: "center", minHeight: 110 },
  title: {
    fontFamily: font.extrabold,
    fontSize: 30,
    marginTop: 12,
  },
  subtitle: {
    fontFamily: font.bold,
    fontSize: 16,
    color: colors.inkSoft,
    marginTop: 4,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 14,
  },
  chipText: { fontFamily: font.semibold, fontSize: 13.5 },
  sheet: { paddingHorizontal: 24, paddingTop: 24 },
  printBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    backgroundColor: colors.ember,
    borderRadius: radius.button,
    height: 54,
  },
  printText: { fontFamily: font.bold, fontSize: 15, color: colors.white },
  printHintText: {
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
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  ideaNumberText: { fontFamily: font.bold, fontSize: 13, color: colors.white },
  ideaTitle: { fontFamily: font.bold, fontSize: 15.5, color: colors.ink, marginBottom: 4 },
  ideaBody: { fontFamily: font.medium, fontSize: 14, lineHeight: 21, color: colors.inkSoft },
  exampleWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  exampleChip: { borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 9 },
  exampleText: { fontFamily: font.semibold, fontSize: 14 },
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
