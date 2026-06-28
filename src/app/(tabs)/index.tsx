import { useMemo } from "react";
import { ActivityIndicator, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FilterPills } from "@/components/deck/FilterPills";
import { SwipeDeck } from "@/components/deck/SwipeDeck";
import { useActivities, useCategories } from "@/hooks/useActivities";
import { applyDeckFilter, useFilters } from "@/stores/filters";
import { colors, font } from "@/theme/tokens";

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const { data: activities, isPending, isError, refetch } = useActivities();
  const { data: categories } = useCategories();
  const deckFilter = useFilters((s) => s.deckFilter);

  const deck = useMemo(
    () => (activities ? applyDeckFilter(activities, deckFilter) : []),
    [activities, deckFilter],
  );

  const cardWidth = width - 48;
  const cardHeight = Math.min(height * 0.58, 560);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <Text style={styles.heading}>Activities</Text>

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
  heading: {
    fontFamily: font.extrabold,
    fontSize: 34,
    color: colors.ink,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
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
