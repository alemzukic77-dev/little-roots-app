import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useActivities } from "@/hooks/useActivities";
import { useSaves } from "@/hooks/useSaves";
import { useAuth } from "@/lib/auth";
import { colors, font, radius, shadow } from "@/theme/tokens";
import type { Activity } from "@/types/activity";

export default function SavedScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: activities } = useActivities();
  const { savedSlugs, toggleSave } = useSaves();

  const saved = useMemo(
    () => (activities ?? []).filter((a) => savedSlugs.has(a.slug)),
    [activities, savedSlugs],
  );

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <Text style={styles.heading}>Saved</Text>
      {!user ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons name="bookmark-outline" size={30} color={colors.ember} />
          </View>
          <Text style={styles.emptyTitle}>Save your favourites</Text>
          <Text style={styles.emptyText}>
            Sign in to bookmark activities and find them here later.
          </Text>
          <Text style={styles.emptyAction} onPress={() => router.push("/(auth)/sign-in")}>
            Sign in
          </Text>
        </View>
      ) : saved.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons name="bookmark-outline" size={30} color={colors.ember} />
          </View>
          <Text style={styles.emptyTitle}>Nothing saved yet</Text>
          <Text style={styles.emptyText}>
            Tap the bookmark on any activity to keep it here for later.
          </Text>
        </View>
      ) : (
        <FlatList
          data={saved}
          keyExtractor={(a) => a.slug}
          numColumns={2}
          columnWrapperStyle={{ gap: 14, paddingHorizontal: 24 }}
          contentContainerStyle={{ gap: 14, paddingBottom: 120 }}
          renderItem={({ item }) => (
            <SavedCard
              activity={item}
              onPress={() => router.push(`/activity/${item.slug}`)}
              onUnsave={() => toggleSave(item.slug)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

function SavedCard({
  activity,
  onPress,
  onUnsave,
}: {
  activity: Activity;
  onPress: () => void;
  onUnsave: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, shadow.soft, pressed && { opacity: 0.9 }]}>
      <Image source={activity.thumbUrl} style={styles.cardImage} contentFit="cover" transition={120} />
      <Pressable hitSlop={8} onPress={onUnsave} style={styles.cardBookmark} accessibilityRole="button">
        <Ionicons name="bookmark" size={16} color={colors.ember} />
      </Pressable>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {activity.title}
        </Text>
        <Text style={styles.cardMeta}>
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
    paddingBottom: 18,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 10,
    paddingBottom: 80,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.emberSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontFamily: font.bold,
    fontSize: 18,
    color: colors.ink,
  },
  emptyText: {
    fontFamily: font.medium,
    fontSize: 14,
    lineHeight: 21,
    color: colors.sub,
    textAlign: "center",
  },
  emptyAction: {
    fontFamily: font.bold,
    fontSize: 15,
    color: colors.ember,
    padding: 10,
    marginTop: 4,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.inner,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 130,
  },
  cardBookmark: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    padding: 12,
    gap: 2,
  },
  cardTitle: {
    fontFamily: font.bold,
    fontSize: 14.5,
    color: colors.ink,
  },
  cardMeta: {
    fontFamily: font.medium,
    fontSize: 12.5,
    color: colors.sub,
  },
});
