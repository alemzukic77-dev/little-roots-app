import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FilterPills } from "@/components/deck/FilterPills";
import { SwipeDeck } from "@/components/deck/SwipeDeck";
import { useActivities, useCategories } from "@/hooks/useActivities";
import { useChildren } from "@/hooks/useChildren";
import { useStreak } from "@/hooks/useStreak";
import { todaysPick } from "@/lib/dailyPick";
import { applyDeckFilter, useFilters } from "@/stores/filters";
import { colors, font, radius, shadow } from "@/theme/tokens";

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const router = useRouter();
  const { data: activities, isPending, isError, refetch } = useActivities();
  const { data: categories } = useCategories();
  const deckFilter = useFilters((s) => s.deckFilter);
  const ageMax = useFilters((s) => s.ageMax);
  const streak = useStreak();
  const { children, activeId } = useChildren();

  const activeChild = children.find((c) => c.id === activeId) ?? null;

  // an active child's age gently tunes the age filter for the whole app
  useEffect(() => {
    if (activeChild) useFilters.getState().setAgeMax(activeChild.ageMonths);
  }, [activeChild?.id, activeChild?.ageMonths]); // eslint-disable-line react-hooks/exhaustive-deps

  const deck = useMemo(() => {
    let list = activities ? applyDeckFilter(activities, deckFilter) : [];
    if (ageMax != null) list = list.filter((a) => a.ageMin <= ageMax);
    return list;
  }, [activities, deckFilter, ageMax]);
  const pick = useMemo(() => todaysPick(activities), [activities]);

  const cardWidth = width - 48;
  const cardHeight = Math.min(height * 0.52, 520);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Activities</Text>
        <View style={styles.headerRight}>
          {activeChild && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Filtering for ${activeChild.name}`}
              onPress={() => router.push("/(tabs)/profile")}
              style={styles.childChip}>
              <Ionicons name="happy-outline" size={14} color={colors.inkSoft} />
              <Text style={styles.childChipText}>{activeChild.name}</Text>
            </Pressable>
          )}
          {streak > 0 && (
            <View style={styles.streak}>
              <Ionicons name="flame" size={16} color={colors.ember} />
              <Text style={styles.streakText}>{streak}</Text>
            </View>
          )}
        </View>
      </View>

      {pick && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Today's pick: ${pick.title}`}
          onPress={() => router.push(`/activity/${pick.slug}`)}
          style={({ pressed }) => [styles.pick, shadow.soft, pressed && { opacity: 0.9 }]}>
          <Ionicons name="sparkles" size={18} color={colors.ember} />
          <View style={{ flex: 1 }}>
            <Text style={styles.pickLabel}>Today&apos;s pick</Text>
            <Text style={styles.pickTitle} numberOfLines={1}>{pick.title}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.sub} />
        </Pressable>
      )}

      <View style={styles.pills}>
        <FilterPills categories={categories ?? []} totalCount={activities?.length ?? 0} />
      </View>

      <View style={styles.deckArea}>
        {isPending ? (
          <ActivityIndicator color={colors.ink} />
        ) : isError ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>Couldn&apos;t load activities.</Text>
            <Text style={styles.retry} onPress={() => refetch()}>
              Try again
            </Text>
          </View>
        ) : (
          <SwipeDeck activities={deck} width={cardWidth} height={cardHeight} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 14,
  },
  heading: {
    fontFamily: font.extrabold,
    fontSize: 34,
    color: colors.ink,
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  childChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: colors.line,
  },
  childChipText: { fontFamily: font.semibold, fontSize: 13, color: colors.inkSoft },
  streak: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.emberSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  streakText: {
    fontFamily: font.extrabold,
    fontSize: 15,
    color: colors.ember,
  },
  pick: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.white,
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: radius.inner,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  pickLabel: {
    fontFamily: font.semibold,
    fontSize: 12,
    color: colors.ember,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  pickTitle: {
    fontFamily: font.bold,
    fontSize: 15.5,
    color: colors.ink,
    marginTop: 1,
  },
  pills: {
    paddingBottom: 20,
  },
  deckArea: {
    flex: 1,
    alignItems: "center",
  },
  center: {
    alignItems: "center",
    gap: 8,
  },
  errorText: {
    fontFamily: font.medium,
    fontSize: 15,
    color: colors.inkSoft,
  },
  retry: {
    fontFamily: font.semibold,
    fontSize: 15,
    color: colors.ember,
    padding: 8,
  },
});
