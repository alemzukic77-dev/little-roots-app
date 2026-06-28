import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { FloatingCircle } from "@/components/onboarding/FloatingCircle";
import { Button } from "@/components/ui/Button";
import { useActivities } from "@/hooks/useActivities";
import { colors, font } from "@/theme/tokens";

export default function WelcomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  // warm the catalog cache while the user is admiring the circle
  useActivities();

  useEffect(() => {
    // no-op: reserved for analytics later
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.circleArea}>
        <FloatingCircle size={Math.min(width * 0.88, 360)} />
      </View>

      <View style={styles.textArea}>
        <Animated.Text entering={FadeInDown.delay(150).duration(500)} style={styles.kicker}>
          No screens — just play
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(300).duration(500)} style={styles.title}>
          Montessori play,{"\n"}one swipe away
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(450).duration(500)} style={styles.subtitle}>
          134 simple, beautiful activities for your toddler — with things you already have at home.
        </Animated.Text>
      </View>

      <Animated.View entering={FadeInDown.delay(600).duration(500)} style={styles.footer}>
        <Button label="Get started" onPress={() => router.push("/(auth)/sign-up")} />
        <Text style={styles.signIn} onPress={() => router.push("/(auth)/sign-in")}>
          I already have an account
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  circleArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  textArea: {
    paddingHorizontal: 32,
    gap: 10,
    alignItems: "center",
  },
  kicker: {
    fontFamily: font.semibold,
    fontSize: 13,
    color: colors.ember,
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  title: {
    fontFamily: font.extrabold,
    fontSize: 32,
    lineHeight: 40,
    color: colors.ink,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: font.medium,
    fontSize: 15,
    lineHeight: 23,
    color: colors.sub,
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 20,
    gap: 12,
  },
  signIn: {
    textAlign: "center",
    fontFamily: font.semibold,
    fontSize: 14,
    color: colors.sub,
    textDecorationLine: "underline",
    padding: 6,
  },
});
