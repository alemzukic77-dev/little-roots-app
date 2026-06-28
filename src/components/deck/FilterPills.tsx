import * as Haptics from "expo-haptics";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { useFilters, type DeckFilter } from "@/stores/filters";
import { colors, font, radius } from "@/theme/tokens";
import type { Category } from "@/types/activity";

type Props = {
  categories: Category[];
  totalCount: number;
};

export function FilterPills({ categories, totalCount }: Props) {
  const deckFilter = useFilters((s) => s.deckFilter);
  const setDeckFilter = useFilters((s) => s.setDeckFilter);

  const pills: { key: DeckFilter; label: string; count?: number }[] = [
    { key: "all", label: "All", count: totalCount },
    { key: "popular", label: "Popular" },
    ...categories.map((c) => ({ key: c.id as DeckFilter, label: c.name, count: c.activityCount })),
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {pills.map((p) => {
        const active = deckFilter === p.key;
        return (
          <Pressable
            key={p.key}
            accessibilityRole="button"
            accessibilityState={active ? { selected: true } : {}}
            onPress={() => {
              Haptics.selectionAsync();
              setDeckFilter(p.key);
            }}
            style={[styles.pill, active && styles.pillActive]}>
            <Text style={[styles.label, active && styles.labelActive]}>
              {p.label}
              {p.count != null && <Text style={[styles.count, active && styles.countActive]}>  {p.count}</Text>}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingHorizontal: 24,
  },
  pill: {
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.line,
  },
  pillActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  label: {
    fontFamily: font.semibold,
    fontSize: 14,
    color: colors.inkSoft,
  },
  labelActive: {
    color: colors.white,
  },
  count: {
    fontFamily: font.medium,
    fontSize: 13,
    color: colors.sub,
  },
  countActive: {
    color: "rgba(255,255,255,0.65)",
  },
});
