import { Ionicons } from "@expo/vector-icons";
import * as AppleAuthentication from "expo-apple-authentication";
import { Link, useRouter } from "expo-router";
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
import { signInWithApple, signInWithGoogle, signUpWithEmail } from "@/lib/auth";
import { colors, font, radius } from "@/theme/tokens";
import { friendlyAuthError } from "./sign-in";

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"email" | "google" | "apple" | null>(null);

  const run = async (kind: "email" | "google" | "apple", fn: () => Promise<unknown>) => {
    setError(null);
    setBusy(kind);
    try {
      await fn();
      // Email sign-up needs verification; OAuth sign-ups are sent straight in by the root gate.
      if (kind === "email") router.replace("/(auth)/verify-email");
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
          <Text style={styles.title}>Create your{"\n"}account</Text>
          <Text style={styles.subtitle}>
            Hundreds of simple, screen-free activities for your little one.
          </Text>

          <View style={styles.fields}>
            <TextField
              label="Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
              placeholder="e.g. Emma"
            />
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
              autoComplete="password-new"
              placeholder="min. 6 characters"
            />
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <Button
            label="Create account"
            loading={busy === "email"}
            disabled={name.trim().length < 3 || !email || password.length < 6 || busy !== null}
            onPress={() => run("email", () => signUpWithEmail(name, email, password))}
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
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={radius.button}
              style={styles.appleButton}
              onPress={() => run("apple", signInWithApple)}
            />
          )}

          <Text style={styles.footer}>
            Already have an account?{" "}
            <Link href="/(auth)/sign-in" style={styles.footerLink}>
              Log in
            </Link>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
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
  },
  subtitle: {
    fontFamily: font.medium,
    fontSize: 14,
    lineHeight: 21,
    color: colors.sub,
    textAlign: "center",
    marginBottom: 4,
  },
  fields: { gap: 14 },
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
