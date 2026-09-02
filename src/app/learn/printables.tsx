import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ShapeGlyph } from "@/components/learn/ShapeGlyph";
import { COLORS_DATA } from "@/data/colors";
import { LETTERS } from "@/data/letters";
import { NUMBERS } from "@/data/numbers";
import { SHAPES } from "@/data/shapes";
import {
  printColorWorksheet,
  printLetterWorksheet,
  printNumberWorksheet,
  printShapeWorksheet,
} from "@/lib/worksheet";
import { colors, font, shadow } from "@/theme/tokens";

async function run(fn: () => Promise<void>) {
  try {
    await fn();
  } catch {
    Alert.alert("Couldn't open the worksheet", "Please try again in a moment.");
  }
}

export default function PrintablesScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={8}
            onPress={() => router.back()}
            style={({ pressed }) => [styles.back, shadow.soft, pressed && { opacity: 0.85 }]}>
            <Ionicons name="chevron-back" size={22} color={colors.ink} />
          </Pressable>
          <Text style={styles.heading}>Printables</Text>
          <Text style={styles.sub}>Tap any tile to open a worksheet you can AirPrint or save to Files.</Text>
        </View>

        <Section title="Letters">
          {LETTERS.map((l) => (
            <Chip key={l.letter} label={l.letter} onPress={() => run(() => printLetterWorksheet(l))} />
          ))}
        </Section>

        <Section title="Numbers">
          {NUMBERS.map((x) => (
            <Chip key={x.n} label={String(x.n)} onPress={() => run(() => printNumberWorksheet(x))} />
          ))}
        </Section>

        <Section title="Shapes">
          {SHAPES.map((s) => (
            <Pressable
              key={s.id}
              accessibilityRole="button"
              accessibilityLabel={s.name}
              onPress={() => run(() => printShapeWorksheet(s))}
              style={({ pressed }) => [styles.shapeChip, shadow.soft, pressed && { opacity: 0.85 }]}>
              <ShapeGlyph id={s.id} size={34} color={s.color} outline />
            </Pressable>
          ))}
        </Section>

        <Section title="Colours">
          {COLORS_DATA.map((c) => (
            <Pressable
              key={c.id}
              accessibilityRole="button"
              accessibilityLabel={c.name}
              onPress={() => run(() => printColorWorksheet(c))}
              style={({ pressed }) => [
                styles.colorChip,
                { backgroundColor: c.hex },
                c.hex.toUpperCase() === "#FFFFFF" && { borderWidth: 2, borderColor: colors.line },
                pressed && { opacity: 0.85 },
              ]}
            />
          ))}
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.grid}>{children}</View>
    </View>
  );
}

function Chip({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.chip, shadow.soft, pressed && { opacity: 0.85 }]}>
      <Text style={styles.chipText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  header: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 8, gap: 8 },
  back: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  heading: { fontFamily: font.extrabold, fontSize: 32, color: colors.ink },
  sub: { fontFamily: font.medium, fontSize: 14.5, lineHeight: 22, color: colors.inkSoft },
  section: { paddingHorizontal: 24, paddingTop: 18 },
  sectionTitle: { fontFamily: font.bold, fontSize: 18, color: colors.ink, marginBottom: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  chipText: { fontFamily: font.bold, fontSize: 18, color: colors.ink },
  shapeChip: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  colorChip: { width: 52, height: 52, borderRadius: 16 },
});
