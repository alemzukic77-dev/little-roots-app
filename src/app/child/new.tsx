import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { useChildren } from "@/hooks/useChildren";
import { colors, font, radius, shadow } from "@/theme/tokens";

const AGES = [
  { m: 12, label: "1 year" },
  { m: 18, label: "18 months" },
  { m: 24, label: "2 years" },
  { m: 30, label: "30 months" },
  { m: 36, label: "3 years" },
];

export default function NewChildScreen() {
  const router = useRouter();
  const { addChild } = useChildren();
  const [name, setName] = useState("");
  const [ageMonths, setAgeMonths] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!name.trim() || ageMonths == null || busy) return;
    setBusy(true);
    try {
      await addChild(name, ageMonths);
      router.back();
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <View style={styles.top}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={8}
            onPress={() => router.back()}
            style={({ pressed }) => [styles.close, shadow.soft, pressed && { opacity: 0.85 }]}>
            <Ionicons name="close" size={20} color={colors.ink} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Add a child</Text>
          <Text style={styles.subtitle}>
            We&apos;ll gently tune activity ages to your little one. This stays private to you.
          </Text>

          <TextField
            label="Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            placeholder="e.g. Emma"
          />

          <Text style={styles.label}>Age</Text>
          <View style={styles.ages}>
            {AGES.map((a) => (
              <Pressable
                key={a.m}
                accessibilityRole="button"
                onPress={() => setAgeMonths(a.m)}
                style={[styles.ageChip, ageMonths === a.m && styles.ageChipActive]}>
                <Text style={[styles.ageText, ageMonths === a.m && styles.ageTextActive]}>{a.label}</Text>
              </Pressable>
            ))}
          </View>

          <View style={{ height: 24 }} />
          <Button
            label="Save"
            loading={busy}
            disabled={!name.trim() || ageMonths == null || busy}
            onPress={save}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  top: { paddingHorizontal: 16, paddingTop: 8 },
  close: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { paddingHorizontal: 28, paddingTop: 12, paddingBottom: 32, gap: 16 },
  title: { fontFamily: font.extrabold, fontSize: 28, color: colors.ink },
  subtitle: { fontFamily: font.medium, fontSize: 14, lineHeight: 21, color: colors.sub, marginBottom: 4 },
  label: { fontFamily: font.bold, fontSize: 14, color: colors.inkSoft, marginTop: 4 },
  ages: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  ageChip: {
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  ageChipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  ageText: { fontFamily: font.semibold, fontSize: 14, color: colors.inkSoft },
  ageTextActive: { color: colors.white },
});
