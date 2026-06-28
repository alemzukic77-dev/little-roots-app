import { Ionicons } from "@expo/vector-icons";
import * as AppleAuthentication from "expo-apple-authentication";
import { Link } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { signInWithApple, signInWithEmail, signInWithGoogle } from "@/lib/auth";
import { colors, font, radius } from "@/theme/tokens";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"email" | "google" | "apple" | null>(null);

  const run = async (kind: "email" | "google" | "apple", fn: () => Promise<unknown>) => {
    setError(null);
    setBusy(kind);
    try {
      await fn();
      // Successful sign-in flips auth state; the root gate redirects.
    } catch (e: unknown) {
      setError(friendlyAuthError(e));
    } finally {
      setBusy(null);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Welcome back{"\n"}to Little Roots</Text>

          <View style={styles.fields}>
            <TextField
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              placeholder="you@example.com"
            />
            <TextField
              label="Password"
              value={password}
              onChangeText={setPassword}
              secure
              autoComplete="password"
              placeholder="••••••••••"
            />
            <Link href="/(auth)/forgot-password" style={styles.forgot}>
              Forgot password?
            </Link>
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <Button
            label="Log in"
            loading={busy === "email"}
            disabled={!email || !password || busy !== null}
            onPress={() => run("email", () => signInWithEmail(email, password))}
          />

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          <Pressable
            accessibilityRole="button"
            disabled={busy !== null}
            onPress={() => run("google", signInWithGoogle)}
            style={({ pressed }) => [styles.oauthButton, pressed && { opacity: 0.85 }]}>
            <Ionicons name="logo-google" size={20} color={colors.ink} />
            <Text style={styles.oauthLabel}>Continue with Google</Text>
          </Pressable>

          {Platform.OS === "ios" && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={radius.button}
              style={styles.appleButton}
              onPress={() => run("apple", signInWithApple)}
            />
          )}

          <Text style={styles.footer}>
            New to Little Roots?{" "}
            <Link href="/(auth)/sign-up" style={styles.footerLink}>
              Sign up
            </Link>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function friendlyAuthError(e: unknown): string {
  const code = (e as { code?: string }).code ?? "";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found"))
    return "Email or password is incorrect.";
  if (code.includes("email-already-in-use")) return "An account with this email already exists.";
  if (code.includes("invalid-email")) return "That email address doesn't look right.";
  if (code.includes("weak-password")) return "Password should be at least 6 characters.";
  if (code.includes("too-many-requests")) return "Too many attempts — please wait a moment.";
  if (code.includes("network-request-failed")) return "No connection — check your internet.";
  return (e as Error).message ?? "Something went wrong. Please try again.";
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 32,
    gap: 20,
  },
  title: {
    fontFamily: font.extrabold,
    fontSize: 30,
    lineHeight: 38,
    color: colors.ink,
    textAlign: "center",
    marginBottom: 8,
  },
  fields: { gap: 14 },
  forgot: {
    alignSelf: "flex-end",
    fontFamily: font.medium,
    fontSize: 13,
    color: colors.sub,
  },
  error: {
    fontFamily: font.medium,
    fontSize: 14,
    color: colors.danger,
    textAlign: "center",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  divider: { flex: 1, height: 1, backgroundColor: colors.line },
  dividerText: { fontFamily: font.medium, fontSize: 13, color: colors.sub },
  oauthButton: {
    flexDirection: "row",
    height: 56,
    borderRadius: radius.button,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  oauthLabel: {
    fontFamily: font.semibold,
    fontSize: 15,
    color: colors.ink,
  },
  appleButton: { height: 56 },
  footer: {
    marginTop: "auto",
    textAlign: "center",
    fontFamily: font.medium,
    fontSize: 14,
    color: colors.sub,
  },
  footerLink: {
    fontFamily: font.bold,
    color: colors.ink,
    textDecorationLine: "underline",
  },
});
