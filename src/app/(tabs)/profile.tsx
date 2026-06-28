import { Ionicons } from "@expo/vector-icons";
import { doc, onSnapshot } from "@react-native-firebase/firestore";
import * as Linking from "expo-linking";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { deleteAccount, signOut, useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { useSaves } from "@/hooks/useSaves";
import { colors, font, radius } from "@/theme/tokens";

const PRIVACY_URL = "https://alemzukic77-dev.github.io/littleroots-legal/privacy/";
const TERMS_URL = "https://alemzukic77-dev.github.io/littleroots-legal/terms/";

export default function ProfileScreen() {
  const { user } = useAuth();
  const { savedSlugs } = useSaves();
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    return onSnapshot(doc(db, "users", user.uid), (snap) => {
      setName(snap.exists() ? (snap.data()?.name ?? null) : null);
    });
  }, [user]);

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

        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(name ?? user?.email ?? "?").slice(0, 1).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{name ?? "…"}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{savedSlugs.size}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
        </View>

        <View style={styles.menu}>
          <MenuRow icon="document-text-outline" label="Privacy policy" onPress={() => Linking.openURL(PRIVACY_URL)} />
          <MenuRow icon="reader-outline" label="Terms of service" onPress={() => Linking.openURL(TERMS_URL)} />
          <MenuRow icon="log-out-outline" label="Sign out" onPress={() => signOut()} />
          <MenuRow icon="trash-outline" label="Delete account" destructive onPress={confirmDelete} />
        </View>
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
