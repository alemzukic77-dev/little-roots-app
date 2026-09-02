import { Ionicons } from "@expo/vector-icons";
import { doc, onSnapshot } from "@react-native-firebase/firestore";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { deleteAccount, signOut, updateDisplayName, useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { useChildren } from "@/hooks/useChildren";
import { useDoneCount } from "@/hooks/useProgress";
import { useSaves } from "@/hooks/useSaves";
import { colors, font, radius } from "@/theme/tokens";

function ageLabel(m: number): string {
  if (m < 12) return `${m} months`;
  const years = Math.floor(m / 12);
  const rem = m % 12;
  if (rem === 0) return years === 1 ? "1 year" : `${years} years`;
  return `${years}y ${rem}m`;
}

const PRIVACY_URL = "https://alemzukic77-dev.github.io/littleroots-legal/privacy/";
const TERMS_URL = "https://alemzukic77-dev.github.io/littleroots-legal/terms/";
// Apple's standard Licensed Application EULA — applies by default and is App Store-acceptable.
const EULA_URL = "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/";

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { savedSlugs } = useSaves();
  const doneCount = useDoneCount();
  const { children, removeChild, activeId, setActive } = useChildren();
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    return onSnapshot(doc(db, "users", user.uid), (snap) => {
      setName(snap.exists() ? (snap.data()?.name ?? null) : null);
    });
  }, [user]);

  const editName = () => {
    Alert.prompt(
      "Your name",
      "This is how you'll appear in Little Roots.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Save",
          onPress: async (value?: string) => {
            try {
              await updateDisplayName(value ?? "");
            } catch (e) {
              Alert.alert("Couldn't save name", e instanceof Error ? e.message : "Please try again.");
            }
          },
        },
      ],
      "plain-text",
      name ?? "",
    );
  };

  const confirmRemoveChild = (id: string, childName: string) => {
    Alert.alert(`Remove ${childName}?`, "This removes their profile. Activities aren't affected.", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => removeChild(id) },
    ]);
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete account?",
      "This permanently removes your account, saved activities and ratings. This can't be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount();
            } catch {
              Alert.alert("Couldn't delete account", "Please try again in a moment.");
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Profile</Text>

        {user ? (
          <>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Edit your name"
              onPress={editName}
              style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {(name ?? user.email ?? "?").slice(0, 1).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, !name && { color: colors.sub }]}>
                  {name ?? "Add your name"}
                </Text>
                <Text style={styles.email}>{user.email}</Text>
              </View>
              <Ionicons name="pencil" size={18} color={colors.sub} />
            </Pressable>

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{savedSlugs.size}</Text>
                <Text style={styles.statLabel}>Saved</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{doneCount}</Text>
                <Text style={styles.statLabel}>Done</Text>
              </View>
            </View>

            <View style={styles.childrenSection}>
              <Text style={styles.childrenTitle}>Your children</Text>
              {children.map((c) => {
                const active = activeId === c.id;
                return (
                  <View key={c.id} style={[styles.childRow, active && styles.childRowActive]}>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => setActive(active ? null : c.id)}
                      style={styles.childMain}>
                      <View style={styles.childAvatar}>
                        <Text style={styles.childAvatarText}>{c.name.slice(0, 1).toUpperCase()}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.childName}>{c.name}</Text>
                        <Text style={styles.childAge}>{ageLabel(c.ageMonths)}</Text>
                      </View>
                      {active && <Ionicons name="checkmark-circle" size={20} color={colors.ember} />}
                    </Pressable>
                    <Pressable
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ${c.name}`}
                      onPress={() => confirmRemoveChild(c.id, c.name)}
                      style={styles.childRemove}>
                      <Ionicons name="close" size={18} color={colors.sub} />
                    </Pressable>
                  </View>
                );
              })}
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push("/child/new")}
                style={({ pressed }) => [styles.addChild, pressed && { opacity: 0.8 }]}>
                <Ionicons name="add-circle-outline" size={20} color={colors.ember} />
                <Text style={styles.addChildText}>Add a child</Text>
              </Pressable>
              {activeId != null && (
                <Text style={styles.childHint}>Activities are gently tuned to this age.</Text>
              )}
            </View>

            <View style={styles.menu}>
              <MenuRow icon="document-text-outline" label="Privacy policy" onPress={() => Linking.openURL(PRIVACY_URL)} />
              <MenuRow icon="reader-outline" label="Terms of service" onPress={() => Linking.openURL(TERMS_URL)} />
              <MenuRow icon="shield-checkmark-outline" label="License agreement (EULA)" onPress={() => Linking.openURL(EULA_URL)} />
              <MenuRow icon="log-out-outline" label="Sign out" onPress={() => signOut()} />
              <MenuRow icon="trash-outline" label="Delete account" destructive onPress={confirmDelete} />
            </View>
          </>
        ) : (
          <>
            <View style={styles.guestCard}>
              <View style={styles.avatar}>
                <Ionicons name="person-outline" size={24} color={colors.ember} />
              </View>
              <Text style={styles.guestTitle}>{"You're browsing as a guest"}</Text>
              <Text style={styles.guestBody}>
                Create a free account to save your favourite activities, rate them and keep them across devices.
              </Text>
              <Button label="Create account" onPress={() => router.push("/(auth)/sign-up")} />
              <Text style={styles.guestSignIn} onPress={() => router.push("/(auth)/sign-in")}>
                I already have an account
              </Text>
            </View>

            <View style={styles.menu}>
              <MenuRow icon="document-text-outline" label="Privacy policy" onPress={() => Linking.openURL(PRIVACY_URL)} />
              <MenuRow icon="reader-outline" label="Terms of service" onPress={() => Linking.openURL(TERMS_URL)} />
              <MenuRow icon="shield-checkmark-outline" label="License agreement (EULA)" onPress={() => Linking.openURL(EULA_URL)} />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuRow({
  icon,
  label,
  onPress,
  destructive,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}) {
  const color = destructive ? colors.danger : colors.ink;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.menuRow, pressed && { opacity: 0.7 }]}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[styles.menuLabel, { color }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={colors.sub} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: {
    paddingBottom: 120,
  },
  heading: {
    fontFamily: font.extrabold,
    fontSize: 34,
    color: colors.ink,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 18,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.white,
    marginHorizontal: 24,
    borderRadius: radius.inner,
    padding: 16,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.emberSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: font.extrabold,
    fontSize: 22,
    color: colors.ember,
  },
  name: {
    fontFamily: font.bold,
    fontSize: 17,
    color: colors.ink,
  },
  email: {
    fontFamily: font.medium,
    fontSize: 13,
    color: colors.sub,
  },
  guestCard: {
    backgroundColor: colors.white,
    marginHorizontal: 24,
    borderRadius: radius.inner,
    padding: 24,
    alignItems: "center",
    gap: 10,
  },
  guestTitle: {
    fontFamily: font.bold,
    fontSize: 18,
    color: colors.ink,
    marginTop: 4,
  },
  guestBody: {
    fontFamily: font.medium,
    fontSize: 14,
    lineHeight: 21,
    color: colors.sub,
    textAlign: "center",
    marginBottom: 8,
  },
  guestSignIn: {
    fontFamily: font.semibold,
    fontSize: 14,
    color: colors.sub,
    textDecorationLine: "underline",
    padding: 8,
  },
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 24,
    marginTop: 14,
    gap: 14,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.inner,
    padding: 16,
    alignItems: "center",
    gap: 2,
  },
  statNumber: {
    fontFamily: font.extrabold,
    fontSize: 22,
    color: colors.ink,
  },
  statLabel: {
    fontFamily: font.medium,
    fontSize: 13,
    color: colors.sub,
  },
  childrenSection: { marginTop: 24, marginHorizontal: 24, gap: 10 },
  childrenTitle: { fontFamily: font.bold, fontSize: 16, color: colors.ink, marginBottom: 2 },
  childRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radius.inner,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  childRowActive: { borderColor: colors.ember },
  childMain: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  childAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.emberSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  childAvatarText: { fontFamily: font.extrabold, fontSize: 17, color: colors.ember },
  childName: { fontFamily: font.bold, fontSize: 15.5, color: colors.ink },
  childAge: { fontFamily: font.medium, fontSize: 13, color: colors.sub, marginTop: 1 },
  childRemove: { padding: 14 },
  addChild: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: radius.inner,
    borderWidth: 1,
    borderColor: colors.line,
    borderStyle: "dashed",
  },
  addChildText: { fontFamily: font.bold, fontSize: 15, color: colors.ember },
  childHint: { fontFamily: font.medium, fontSize: 12.5, color: colors.sub, textAlign: "center", paddingTop: 2 },
  menu: {
    marginTop: 24,
    marginHorizontal: 24,
    backgroundColor: colors.white,
    borderRadius: radius.inner,
    paddingHorizontal: 16,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  menuLabel: {
    flex: 1,
    fontFamily: font.semibold,
    fontSize: 15,
  },
});
