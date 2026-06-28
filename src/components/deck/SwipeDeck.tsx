import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { colors, font, radius } from "@/theme/tokens";
import { prefetchVideo } from "@/lib/videoCache";
import type { Activity } from "@/types/activity";
import { DeckCard } from "./DeckCard";

const PREFETCH_AHEAD = 3;

const SPRING = { damping: 16, stiffness: 160, mass: 0.8 };

type Props = {
  activities: Activity[];
  width: number;
  height: number;
};

export function SwipeDeck({ activities, width, height }: Props) {
  const router = useRouter();
  const { width: screenW } = useWindowDimensions();
  const [topIndex, setTopIndex] = useState(0);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);

  // New filter selection → fresh deck
  useEffect(() => {
    tx.value = 0;
    ty.value = 0;
    setTopIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities]);

  const advance = useCallback(() => {
    tx.value = 0;
    ty.value = 0;
    setTopIndex((i) => i + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const haptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const top = activities[topIndex];
  const next = activities[topIndex + 1];
  const done = topIndex >= activities.length;

  // warm the disk cache for the upcoming cards so each swipe plays instantly
  useEffect(() => {
    for (let i = 0; i <= PREFETCH_AHEAD; i++) {
      void prefetchVideo(activities[topIndex + i]?.videoUrl);
    }
  }, [activities, topIndex]);

  const openTop = useCallback(() => {
    if (top) router.push(`/activity/${top.slug}`);
  }, [router, top]);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      tx.value = e.translationX;
      ty.value = e.translationY * 0.5;
    })
    .onEnd((e) => {
      const fling = Math.abs(tx.value) > screenW * 0.35 || Math.abs(e.velocityX) > 800;
      if (fling) {
        const dir = tx.value === 0 ? Math.sign(e.velocityX) : Math.sign(tx.value);
        runOnJS(haptic)();
        tx.value = withSpring(dir * screenW * 1.5, { ...SPRING, velocity: e.velocityX }, (finished) => {
          if (finished) runOnJS(advance)();
        });
        ty.value = withSpring(ty.value, SPRING);
      } else {
        tx.value = withSpring(0, SPRING);
        ty.value = withSpring(0, SPRING);
      }
    });

  const tap = Gesture.Tap().onEnd((_e, success) => {
    if (success) runOnJS(openTop)();
  });

  const gesture = Gesture.Exclusive(pan, tap);

  const topStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { rotateZ: `${interpolate(tx.value, [-screenW, screenW], [-15, 15])}deg` },
    ],
  }));

  const nextStyle = useAnimatedStyle(() => {
    const p = Math.min(Math.abs(tx.value) / (screenW * 0.35), 1);
    return {
      opacity: interpolate(p, [0, 1], [0.6, 1]),
      transform: [
        { scale: interpolate(p, [0, 1], [0.92, 1]) },
        { translateY: interpolate(p, [0, 1], [22, 0]) },
      ],
    };
  });

  if (done) {
    return (
      <View style={[styles.endCard, { width, height }]}>
        <Text style={styles.endEmoji}>🎉</Text>
        <Text style={styles.endTitle}>You&apos;ve seen them all!</Text>
        <Text
          style={styles.endAction}
          onPress={() => {
            tx.value = 0;
            ty.value = 0;
            setTopIndex(0);
          }}>
          Start over
        </Text>
      </View>
    );
  }

  return (
    <View style={{ width, height }}>
      {next && (
        <Animated.View key={`next-${next.slug}`} style={[StyleSheet.absoluteFill, nextStyle]}>
          <DeckCard activity={next} width={width} height={height} />
        </Animated.View>
      )}
      {top && (
        // keyed by slug: a fresh mount per activity so the video player
        // is always created with the right source (expo-video players
        // don't follow source-prop changes after creation)
        <GestureDetector key={`top-${top.slug}`} gesture={gesture}>
          <Animated.View style={[StyleSheet.absoluteFill, topStyle]}>
            <DeckCard activity={top} width={width} height={height} isTop />
          </Animated.View>
        </GestureDetector>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  endCard: {
    borderRadius: radius.card,
    backgroundColor: colors.creamDeep,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  endEmoji: { fontSize: 44 },
  endTitle: {
    fontFamily: font.bold,
    fontSize: 20,
    color: colors.ink,
  },
  endAction: {
    fontFamily: font.semibold,
    fontSize: 16,
    color: colors.ember,
    padding: 8,
  },
});
