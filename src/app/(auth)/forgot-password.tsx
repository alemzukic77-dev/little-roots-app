import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { resetPassword } from "@/lib/auth";
import { colors, font } from "@/theme/tokens";
import { friendlyAuthError } from "./sign-in";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError(null);
    setBusy(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (e: unknown) {
      setError(friendlyAuthError(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>Reset password</Text>
        {sent ? (
          <>
            <Text style={styles.subtitle}>
              Done — check <Text style={styles.email}>{email}</Text> for a reset link.
            </Text>
            <Button label="Back to log in" onPress={() => router.back()} />
          </>
        ) : (
          <>
            <Text style={styles.subtitle}>
              Enter your email and we&apos;ll send you a link to reset it.
            </Text>
            <TextField
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@example.com"
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <Button label="Send reset link" loading={busy} disabled={!email || busy} onPress={submit} />
            <Text style={styles.back} onPress={() => router.back()}>
              Back
            </Text>
          </>
        )}
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
    gap: 16,
  },
  title: {
    fontFamily: font.extrabold,
    fontSize: 28,
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
  email: { fontFamily: font.bold, color: colors.ink },
  error: {
    fontFamily: font.medium,
    fontSize: 14,
    color: colors.danger,
    textAlign: "center",
  },
  back: {
    textAlign: "center",
    fontFamily: font.semibold,
    fontSize: 14,
    color: colors.sub,
    textDecorationLine: "underline",
    padding: 8,
  },
});
