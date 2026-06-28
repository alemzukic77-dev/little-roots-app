import { Image } from "expo-image";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { colors, shadow } from "@/theme/tokens";

const THUMBS = [
  require("../../../assets/onboarding/pom-pom-sorting.jpg"),
  require("../../../assets/onboarding/cloud-dough.jpg"),
  require("../../../assets/onboarding/finger-painting.jpg"),
  require("../../../assets/onboarding/balloon-keep-up.jpg"),
  require("../../../assets/onboarding/banana-slicing.jpg"),
  require("../../../assets/onboarding/story-stones.jpg"),
  require("../../../assets/onboarding/rainbow-rice-bin.jpg"),
  require("../../../assets/onboarding/veggie-stamping.jpg"),
  require("../../../assets/onboarding/bubble-chase.jpg"),
  require("../../../assets/onboarding/nature-basket.jpg"),
];

// ESCAPE-style ring of gently drifting activity thumbnails around a center badge.
export function FloatingCircle({ size = 320 }: { size?: number }) {
  const ringRadius = size * 0.40;
  const thumbSize = size * 0.19;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      {THUMBS.map((src, i) => {
        const angle = (i / THUMBS.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <FloatingThumb
            key={i}
            source={src}
            size={thumbSize}
            x={Math.cos(angle) * ringRadius}
            y={Math.sin(angle) * ringRadius}
            delay={i * 180}
          />
        );
      })}
      <View style={[styles.center, { width: size * 0.3, height: size * 0.3, borderRadius: size * 0.15 }, shadow.card]}>
        <Image
          source={require("../../../assets/onboarding/pom-pom-sorting.jpg")}
          style={{ width: "100%", height: "100%", borderRadius: size * 0.15 }}
          contentFit="cover"
        />
      </View>
    </View>
  );
}

function FloatingThumb({
  source,
  size,
  x,
  y,
  delay,
}: {
  source: number;
  size: number;
  x: number;
  y: number;
  delay: number;
}) {
  const drift = useSharedValue(0);

  useEffect(() => {
    drift.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.sin) }), -1, true),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x },
      { translateY: y + drift.value * 10 - 5 },
      { rotateZ: `${(drift.value - 0.5) * 6}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.thumb, { width: size, height: size, borderRadius: size * 0.32 }, style, shadow.soft]}>
      <Image source={source} style={{ width: "100%", height: "100%", borderRadius: size * 0.32 }} contentFit="cover" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  thumb: {
    position: "absolute",
    backgroundColor: colors.white,
  },
  center: {
    backgroundColor: colors.white,
  },
});
