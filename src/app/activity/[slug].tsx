import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ActivityMedia } from "@/components/activity/ActivityMedia";
import { RatingStars } from "@/components/activity/RatingStars";
import { useActivity, useLiveAggregates } from "@/hooks/useActivity";
import { useMyRating } from "@/hooks/useRating";
import { useSaves } from "@/hooks/useSaves";
import { shareActivity } from "@/lib/links";
import { colors, font, radius, shadow } from "@/theme/tokens";

export default function ActivityDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const heroHeight = width * 0.85;

  const { data: activity, isPending } = useActivity(slug);
  const agg = useLiveAggregates(slug);
  const { myStars, rate } = useMyRating(slug);
  const { savedSlugs, toggleSave } = useSaves();

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useScrollOffset(scrollRef);

  const heroStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [-heroHeight, 0, heroHeight], [-heroHeight / 2, 0, heroHeight * 0.4]) },
      { scale: interpolate(scrollY.value, [-heroHeight, 0], [1.6, 1], "clamp") },
    ],
  }));

  if (isPending || !activity) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.ink} />
      </View>
    );
  }

  const tint = colors.tint[activity.categoryId];
  const saved = savedSlugs.has(activity.slug);

  return (
    <View style={styles.screen}>
      <Animated.ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} bounces>
        <View style={{ height: heroHeight, overflow: "hidden" }}>
          <Animated.View style={[StyleSheet.absoluteFill, heroStyle]}>
            <ActivityMedia
              imageUrl={activity.imageUrl}
              videoUrl={activity.videoUrl}
              active
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>

        <View style={styles.sheet}>
          <View style={styles.badgeRow}>
            <MetaBadge icon="time-outline" label={`${activity.duration} min`} />
            <MetaBadge icon="happy-outline" label={`${activity.ageMin}m+`} />
            <MetaBadge icon="water-outline" label={`${activity.mess} mess`} />
          </View>

          <View style={[styles.categoryChip, { backgroundColor: tint.bg }]}>
            <Text style={[styles.categoryText, { color: tint.fg }]}>{activity.category}</Text>
          </View>
          <Text style={styles.title}>{activity.title}</Text>
          <Text style={styles.summary}>{activity.summary}</Text>

          <Section title="You'll need">
            {activity.materials.map((m) => (
              <View key={m} style={styles.materialRow}>
                <Ionicons name="ellipse" size={7} color={colors.ember} />
                <Text style={styles.materialText}>{m}</Text>
              </View>
            ))}
          </Section>

          <Section title="How to play">
            {activity.steps.map((s, i) => (
              <View key={s} style={styles.stepRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{s}</Text>
              </View>
            ))}
          </Section>

          <Section title="Why it's great">
            <View style={styles.benefitWrap}>
              {activity.benefits.map((b) => (
                <View key={b} style={[styles.benefitChip, { backgroundColor: tint.bg }]}>
                  <Text style={[styles.benefitText, { color: tint.fg }]}>{b}</Text>
                </View>
              ))}
            </View>
          </Section>

          <View style={styles.cleanupCard}>
            <Ionicons name="sparkles-outline" size={18} color={colors.ember} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cleanupTitle}>Clean-up</Text>
              <Text style={styles.cleanupText}>{activity.cleanup}</Text>
            </View>
          </View>

          <View style={styles.ratingBlock}>
            <Text style={styles.sectionTitle}>How did it go?</Text>
            <RatingStars
              myStars={myStars}
              avgRating={agg?.avgRating ?? activity.avgRating}
              ratingCount={agg?.ratingCount ?? activity.ratingCount}
              onRate={rate}
            />
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => shareActivity(activity)}
            style={({ pressed }) => [styles.shareRow, pressed && { opacity: 0.85 }]}>
            <Ionicons name="paper-plane-outline" size={18} color={colors.white} />
            <Text style={styles.shareRowText}>Share with a friend</Text>
          </Pressable>

          <View style={{ height: insets.bottom + 96 }} />
        </View>
      </Animated.ScrollView>

      {/* top actions */}
      <View style={[styles.topActions, { top: insets.top + 6 }]}>
        <CircleButton icon="close" onPress={() => router.back()} />
        <View style={styles.topRight}>
          <CircleButton
            icon={saved ? "bookmark" : "bookmark-outline"}
            active={saved}
            onPress={() => toggleSave(activity.slug)}
          />
          <CircleButton icon="share-outline" onPress={() => shareActivity(activity)} />
        </View>
      </View>
    </View>
  );
}

function MetaBadge({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.metaBadge}>
      <Ionicons name={icon} size={14} color={colors.inkSoft} />
      <Text style={styles.metaBadgeText}>{label}</Text>
    </View>
  );
}

function CircleButton({
  icon,
  onPress,
  active,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  active?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.circleButton, shadow.soft, pressed && { opacity: 0.85 }]}>
      <Ionicons name={icon} size={20} color={active ? colors.ember : colors.ink} />
    </Pressable>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  loading: {
    flex: 1,
    backgroundColor: colors.cream,
    alignItems: "center",
    justifyContent: "center",
  },
  sheet: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
    marginTop: -28,
    paddingHorizontal: 24,
    paddingTop: 22,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  metaBadge: {
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
  metaBadgeText: {
    fontFamily: font.semibold,
    fontSize: 12.5,
    color: colors.inkSoft,
  },
  categoryChip: {
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 8,
  },
  categoryText: {
    fontFamily: font.semibold,
    fontSize: 12.5,
  },
  title: {
    fontFamily: font.extrabold,
    fontSize: 28,
    color: colors.ink,
    marginBottom: 6,
  },
  summary: {
    fontFamily: font.medium,
    fontSize: 15,
    lineHeight: 23,
    color: colors.inkSoft,
  },
  section: {
    marginTop: 26,
    gap: 10,
  },
  sectionTitle: {
    fontFamily: font.bold,
    fontSize: 18,
    color: colors.ink,
  },
  materialRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 2,
  },
  materialText: {
    fontFamily: font.medium,
    fontSize: 15,
    color: colors.inkSoft,
    flex: 1,
  },
  stepRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  stepNumberText: {
    fontFamily: font.bold,
    fontSize: 13,
    color: colors.white,
  },
  stepText: {
    flex: 1,
    fontFamily: font.medium,
    fontSize: 15,
    lineHeight: 23,
    color: colors.inkSoft,
  },
  benefitWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  benefitChip: {
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  benefitText: {
    fontFamily: font.semibold,
    fontSize: 13,
  },
  cleanupCard: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: radius.inner,
    padding: 16,
    marginTop: 26,
    alignItems: "flex-start",
  },
  cleanupTitle: {
    fontFamily: font.bold,
    fontSize: 14,
    color: colors.ink,
    marginBottom: 3,
  },
  cleanupText: {
    fontFamily: font.medium,
    fontSize: 14,
    lineHeight: 21,
    color: colors.inkSoft,
  },
  ratingBlock: {
    marginTop: 30,
    gap: 14,
    alignItems: "center",
  },
  shareRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.ink,
    borderRadius: radius.button,
    height: 54,
    marginTop: 22,
  },
  shareRowText: {
    fontFamily: font.bold,
    fontSize: 15,
    color: colors.white,
  },
  topActions: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topRight: {
    flexDirection: "row",
    gap: 10,
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
