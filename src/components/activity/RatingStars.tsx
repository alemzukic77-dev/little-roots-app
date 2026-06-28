import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, font } from "@/theme/tokens";

type Props = {
  myStars: number | null;
  avgRating: number;
  ratingCount: number;
  onRate: (stars: number) => void;
};

export function RatingStars({ myStars, avgRating, ratingCount, onRate }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {[1, 2, 3, 4, 5].map((s) => (
          <Pressable
            key={s}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={`Rate ${s} star${s > 1 ? "s" : ""}`}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onRate(s);
            }}>
            <Ionicons
              name={myStars != null && s <= myStars ? "star" : "star-outline"}
              size={30}
              color={myStars != null && s <= myStars ? colors.star : colors.sub}
            />
          </Pressable>
        ))}
      </View>
      <Text style={styles.meta}>
        {ratingCount > 0
          ? `${avgRating.toFixed(1)} · ${ratingCount} rating${ratingCount === 1 ? "" : "s"}`
          : "Be the first to rate this"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    gap: 6,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  meta: {
    fontFamily: font.medium,
    fontSize: 13,
    color: colors.sub,
  },
});
