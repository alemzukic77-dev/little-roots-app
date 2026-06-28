import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { ActivityMedia } from "@/components/activity/ActivityMedia";
import { colors, font, radius, shadow } from "@/theme/tokens";
import type { Activity } from "@/types/activity";

export const CARD_IMAGE_RATIO = 0.7;

type Props = {
  activity: Activity;
  width: number;
  height: number;
  /** Top card plays its animation loop; background cards show the photo. */
  isTop?: boolean;
};

// Pure visual card — gestures live in SwipeDeck.
export function DeckCard({ activity, width, height, isTop = false }: Props) {
  const imageHeight = height * CARD_IMAGE_RATIO;
  const tint = colors.tint[activity.categoryId];

  return (
    <View style={[styles.card, { width, height }, shadow.card]}>
      <ActivityMedia
        imageUrl={activity.imageUrl}
        videoUrl={activity.videoUrl}
        active={isTop}
        style={{ width: "100%", height: imageHeight }}
        recyclingKey={activity.slug}
      />

      <View style={styles.durationBadge}>
        <Text style={styles.durationText}>{activity.duration} min</Text>
      </View>

      <View style={styles.body}>
        <View style={[styles.categoryChip, { backgroundColor: tint.bg }]}>
          <Text style={[styles.categoryText, { color: tint.fg }]}>{activity.category}</Text>
          <Text style={[styles.categoryText, { color: tint.fg, opacity: 0.7 }]}>· {activity.ageMin}m+</Text>
        </View>
        <Text style={styles.title} numberOfLines={1}>
          {activity.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {activity.summary}
        </Text>
      </View>

      <View style={[styles.playButton, { top: imageHeight - 28 }, shadow.soft]}>
        <Ionicons name="play" size={22} color={colors.white} style={{ marginLeft: 2 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    backgroundColor: colors.card,
    overflow: "hidden",
  },
  durationBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  durationText: {
    fontFamily: font.semibold,
    fontSize: 13,
    color: colors.ink,
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 18,
    gap: 5,
  },
  categoryChip: {
    flexDirection: "row",
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  categoryText: {
    fontFamily: font.semibold,
    fontSize: 12,
  },
  title: {
    fontFamily: font.bold,
    fontSize: 22,
    color: colors.ink,
  },
  subtitle: {
    fontFamily: font.medium,
    fontSize: 14,
    lineHeight: 20,
    color: colors.sub,
    paddingRight: 56,
  },
  playButton: {
    position: "absolute",
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
});
