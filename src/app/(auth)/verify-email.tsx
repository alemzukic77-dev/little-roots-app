import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { AppState, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import {
  refreshVerificationStatus,
  resendVerificationEmail,
  signOut,
  useAuth,
} from "@/lib/auth";
import { colors, font } from "@/theme/tokens";

const RESEND_COOLDOWN = 60;

export default function VerifyEmailScreen() {
  const { user } = useAuth();
  const [cooldown, setCooldown] = useState(0);
  const [checking, setChecking] = useState(false);
  const [notYet, setNotYet] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Poll while the screen is open + re-check when app returns to foreground.
  // A successful reload flips auth state and the root gate moves the user on.
  useEffect(() => {
    pollRef.current = setInterval(() => refreshVerificationStatus(), 5000);
    const sub = AppState.addEventListener("change", (s) => {
      if (s === "active") refreshVerificationStatus();
    });
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      sub.remove();
    };
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const resend = async () => {
    await resendVerificationEmail();
    setCooldown(RESEND_COOLDOWN);
  };

  const checkNow = async () => {
    setChecking(true);
    setNotYet(false);
    const verified = await refreshVerificationStatus();
    if (!verified) setNotYet(true);
    setChecking(false);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="mail-unread-outline" size={36} color={colors.ember} />
        </View>
        <Text style={styles.title}>Check your inbox</Text>
        <Text style={styles.subtitle}>
          We sent a verification link to{"\n"}
          <Text style={styles.email}>{user?.email}</Text>
        </Text>

        {notYet && (
          <Text style={styles.notYet}>Not verified yet — tap the link in the email first.</Text>
        )}

        <Button label="I've verified my email" loading={checking} onPress={checkNow} />
        <Button
          label={cooldown > 0 ? `Resend email (${cooldown}s)` : "Resend email"}
          variant="outline"
          disabled={cooldown > 0}
          onPress={resend}
        />
        <Text style={styles.signOut} onPress={() => signOut()}>
          Use a different account
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
    gap: 14,
  },
  iconCircle: {
    alignSelf: "center",
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.emberSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  title: {
    fontFamily: font.extrabold,
    fontSize: 26,
    color: colors.ink,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: font.medium,
    fontSize: 15,
    lineHeight: 23,
    color: colors.sub,
    textAlign: "center",
    marginBottom: 10,
  },
  email: {
    fontFamily: font.bold,
    color: colors.ink,
  },
  notYet: {
    fontFamily: font.medium,
    fontSize: 13,
    color: colors.danger,
    textAlign: "center",
  },
  signOut: {
    marginTop: 8,
    textAlign: "center",
    fontFamily: font.semibold,
    fontSize: 14,
    color: colors.sub,
    textDecorationLine: "underline",
    padding: 8,
  },
});
