import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, font, radius, shadow } from "@/theme/tokens";

type Card = {
  key: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  tint: { bg: string; fg: string };
};

const CARDS: Card[] = [
  { key: "letters", title: "Letters", subtitle: "A–Z · sounds & tracing", icon: "text", route: "/learn/letters", tint: colors.tint.language },
  { key: "numbers", title: "Numbers", subtitle: "1–10 · counting play", icon: "calculator-outline", route: "/learn/numbers", tint: colors.tint["fine-motor"] },
  { key: "shapes", title: "Shapes", subtitle: "Circle, square & more", icon: "shapes-outline", route: "/learn/shapes", tint: colors.tint.sensory },
  { key: "colors", title: "Colours", subtitle: "Colours all around us", icon: "color-palette-outline", route: "/learn/colors", tint: colors.tint.creativity },
  { key: "printables", title: "Printables", subtitle: "Worksheets to print at home", icon: "print-outline", route: "/learn/printables", tint: colors.tint["practical-life"] },
  { key: "milestones", title: "Milestones", subtitle: "What to expect by age", icon: "footsteps-outline", route: "/learn/milestones", tint: colors.tint.physical },
];

export default function LearnScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.header}>
          <Text style={styles.heading}>Learn</Text>
          <Text style={styles.sub}>
            Gentle, screen-free ways to teach letters, numbers, shapes and colours — through everyday play.
          </Text>
        </View>

        <View style={styles.cards}>
          {CARDS.map((c) => (
            <Pressable
              key={c.key}
              accessibilityRole="button"
              onPress={() => router.push(c.route as never)}
              style={({ pressed }) => [styles.card, shadow.soft, pressed && { opacity: 0.9 }]}>
              <View style={[styles.iconWrap, { backgroundColor: c.tint.bg }]}>
                <Ionicons name={c.icon} size={24} color={c.tint.fg} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{c.title}</Text>
                <Text style={styles.cardSub}>{c.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.sub} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  header: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 18 },
  heading: { fontFamily: font.extrabold, fontSize: 34, color: colors.ink, marginBottom: 8 },
  sub: { fontFamily: font.medium, fontSize: 14.5, lineHeight: 22, color: colors.inkSoft },
  cards: { paddingHorizontal: 24, gap: 14 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: colors.white,
    borderRadius: radius.inner,
    padding: 16,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { fontFamily: font.bold, fontSize: 17, color: colors.ink },
  cardSub: { fontFamily: font.medium, fontSize: 13, color: colors.sub, marginTop: 2 },
});
