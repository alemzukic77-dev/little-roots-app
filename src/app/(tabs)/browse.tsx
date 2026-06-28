import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useActivities, useCategories } from "@/hooks/useActivities";
import { matchesBrowseFilters, useFilters } from "@/stores/filters";
import { colors, font, radius, shadow } from "@/theme/tokens";
import type { Activity, Mess } from "@/types/activity";

const AGE_OPTIONS = [12, 18, 24, 30, 36];
const DURATIONS = [
  { key: "short", label: "< 10 min" },
  { key: "medium", label: "10–15 min" },
  { key: "long", label: "15+ min" },
] as const;
const MESSES: Mess[] = ["Low", "Medium", "High"];

export default function BrowseScreen() {
  const router = useRouter();
  const { data: activities } = useActivities();
  const { data: categories } = useCategories();
  const f = useFilters();

  const hasQueryOrFilter = !!f.search.trim() || f.ageMax != null || f.durationBucket != null || f.mess != null;

  const results = useMemo(() => {
    if (!activities || !hasQueryOrFilter) return [];
    return activities.filter((a) =>
      matchesBrowseFilters(a, {
        search: f.search,
        ageMax: f.ageMax,
        durationBucket: f.durationBucket,
        mess: f.mess,
      }),
    );
  }, [activities, f.search, f.ageMax, f.durationBucket, f.mess, hasQueryOrFilter]);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <FlatList
        data={hasQueryOrFilter ? results : []}
        keyExtractor={(a) => a.slug}
        numColumns={2}
        columnWrapperStyle={{ gap: 14, paddingHorizontal: 24 }}
        contentContainerStyle={{ gap: 14, paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            <Text style={styles.heading}>Browse</Text>

            <View style={styles.searchRow}>
              <Ionicons name="search" size={18} color={colors.sub} />
              <TextInput
                value={f.search}
                onChangeText={f.setSearch}
                placeholder="Search activities or materials…"
                placeholderTextColor={colors.sub}
                style={styles.searchInput}
                autoCapitalize="none"
                returnKeyType="search"
              />
              {f.search.length > 0 && (
                <Pressable hitSlop={8} onPress={() => f.setSearch("")}>
                  <Ionicons name="close-circle" size={18} color={colors.sub} />
                </Pressable>
              )}
            </View>

            <FilterRow label="Age">
              {AGE_OPTIONS.map((m) => (
                <Chip
                  key={m}
                  label={`${m}m`}
                  active={f.ageMax === m}
                  onPress={() => f.setAgeMax(f.ageMax === m ? null : m)}
                />
              ))}
            </FilterRow>
            <FilterRow label="Time">
              {DURATIONS.map((d) => (
                <Chip
                  key={d.key}
                  label={d.label}
                  active={f.durationBucket === d.key}
                  onPress={() => f.setDurationBucket(f.durationBucket === d.key ? null : d.key)}
                />
              ))}
            </FilterRow>
            <FilterRow label="Mess">
              {MESSES.map((m) => (
                <Chip
                  key={m}
                  label={m}
                  active={f.mess === m}
                  onPress={() => f.setMess(f.mess === m ? null : m)}
                />
              ))}
            </FilterRow>

            {hasQueryOrFilter ? (
              <View style={styles.resultHeader}>
                <Text style={styles.resultCount}>
                  {results.length} activit{results.length === 1 ? "y" : "ies"}
                </Text>
                <Text style={styles.reset} onPress={f.resetBrowse}>
                  Reset
                </Text>
              </View>
            ) : (
              <View style={styles.categories}>
                {(categories ?? []).map((c) => (
                  <Pressable
                    key={c.id}
                    accessibilityRole="button"
                    onPress={() => {
                      router.push("/(tabs)");
                      // small delay so the deck screen is mounted before the filter applies
                      setTimeout(() => useFilters.getState().setDeckFilter(c.id), 50);
                    }}
                    style={({ pressed }) => [styles.categoryCard, shadow.soft, pressed && { opacity: 0.9 }]}>
                    {c.imageUrl && (
                      <Image source={c.imageUrl} style={styles.categoryImage} contentFit="cover" transition={120} />
                    )}
                    <View style={styles.categoryBody}>
                      <Text style={styles.categoryName}>{c.name}</Text>
                      <Text style={styles.categoryCount}>{c.activityCount} activities</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <ResultCard activity={item} onPress={() => router.push(`/activity/${item.slug}`)} />
        )}
      />
    </SafeAreaView>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.filterRow}>
      <Text style={styles.filterLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {children}
      </ScrollView>
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function ResultCard({ activity, onPress }: { activity: Activity; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.resultCard, shadow.soft, pressed && { opacity: 0.9 }]}>
      <Image source={activity.thumbUrl} style={styles.resultImage} contentFit="cover" transition={120} />
      <View style={styles.resultBody}>
        <Text style={styles.resultTitle} numberOfLines={1}>
          {activity.title}
        </Text>
        <Text style={styles.resultMeta}>
          {activity.duration} min · {activity.ageMin}m+
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  heading: {
    fontFamily: font.extrabold,
    fontSize: 34,
    color: colors.ink,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    marginHorizontal: 24,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontFamily: font.medium,
    fontSize: 15,
    color: colors.ink,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 24,
    marginBottom: 10,
  },
  filterLabel: {
    fontFamily: font.semibold,
    fontSize: 13,
    color: colors.sub,
    width: 38,
  },
  chip: {
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  chipActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  chipLabel: {
    fontFamily: font.semibold,
    fontSize: 13,
    color: colors.inkSoft,
  },
  chipLabelActive: {
    color: colors.white,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  resultCount: {
    fontFamily: font.bold,
    fontSize: 15,
    color: colors.ink,
  },
  reset: {
    fontFamily: font.semibold,
    fontSize: 14,
    color: colors.ember,
    padding: 4,
  },
  categories: {
    paddingHorizontal: 24,
    paddingTop: 8,
    gap: 14,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radius.inner,
    overflow: "hidden",
  },
  categoryImage: {
    width: 86,
    height: 72,
  },
  categoryBody: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 2,
  },
  categoryName: {
    fontFamily: font.bold,
    fontSize: 16,
    color: colors.ink,
  },
  categoryCount: {
    fontFamily: font.medium,
    fontSize: 13,
    color: colors.sub,
  },
  resultCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.inner,
    overflow: "hidden",
  },
  resultImage: {
    width: "100%",
    height: 120,
  },
  resultBody: {
    padding: 12,
    gap: 2,
  },
  resultTitle: {
    fontFamily: font.bold,
    fontSize: 14.5,
    color: colors.ink,
  },
  resultMeta: {
    fontFamily: font.medium,
    fontSize: 12.5,
    color: colors.sub,
  },
});
