import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { bandForAge, MILESTONE_BANDS } from "@/data/milestones";
import { useChildren } from "@/hooks/useChildren";
import { colors, font, radius, shadow } from "@/theme/tokens";

export default function MilestonesScreen() {
  const router = useRouter();
  const { children, activeId } = useChildren();
  const activeChild = children.find((c) => c.id === activeId) ?? null;
  const activeBand = bandForAge(activeChild?.ageMonths);

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
          <Text style={styles.heading}>Milestones</Text>
          <Text style={styles.sub}>
            Rough guides to what many toddlers do at each age — for reassurance and ideas.
          </Text>
        </View>

        <View style={styles.note}>
          <Ionicons name="heart-outline" size={16} color={colors.ember} />
          <Text style={styles.noteText}>
            Every child grows at their own pace. This isn&apos;t medical advice — if you&apos;re ever unsure,
            chat with your pediatrician.
          </Text>
        </View>

        {MILESTONE_BANDS.map((band) => {
          const highlight = band.id === activeBand;
          return (
            <View key={band.id} style={[styles.band, shadow.soft, highlight && styles.bandActive]}>
              <View style={styles.bandHead}>
                <Text style={styles.bandLabel}>{band.label}</Text>
                {highlight && activeChild && (
                  <View style={styles.pill}>
                    <Text style={styles.pillText}>{activeChild.name}</Text>
                  </View>
                )}
              </View>
              {band.groups.map((g) => (
                <View key={g.domain} style={styles.group}>
                  <Text style={styles.domain}>{g.domain}</Text>
                  {g.items.map((it) => (
                    <View key={it} style={styles.item}>
                      <Ionicons name="ellipse" size={6} color={colors.ember} style={{ marginTop: 7 }} />
                      <Text style={styles.itemText}>{it}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  header: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 12, gap: 8 },
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
  note: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    backgroundColor: colors.emberSoft,
    marginHorizontal: 24,
    borderRadius: radius.inner,
    padding: 14,
    marginBottom: 16,
  },
  noteText: { flex: 1, fontFamily: font.medium, fontSize: 13, lineHeight: 20, color: colors.inkSoft },
  band: {
    backgroundColor: colors.white,
    marginHorizontal: 24,
    marginBottom: 14,
    borderRadius: radius.inner,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  bandActive: { borderColor: colors.ember },
  bandHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  bandLabel: { fontFamily: font.extrabold, fontSize: 19, color: colors.ink },
  pill: { backgroundColor: colors.emberSoft, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  pillText: { fontFamily: font.bold, fontSize: 12, color: colors.ember },
  group: { marginTop: 12 },
  domain: {
    fontFamily: font.bold,
    fontSize: 13,
    color: colors.sub,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  item: { flexDirection: "row", gap: 10, alignItems: "flex-start", marginBottom: 4 },
  itemText: { flex: 1, fontFamily: font.medium, fontSize: 14.5, lineHeight: 21, color: colors.inkSoft },
});
