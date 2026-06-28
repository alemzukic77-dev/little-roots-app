import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, shadow } from "@/theme/tokens";

const ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; idle: keyof typeof Ionicons.glyphMap }> = {
  index: { active: "home", idle: "home-outline" },
  browse: { active: "search", idle: "search-outline" },
  saved: { active: "bookmark", idle: "bookmark-outline" },
  profile: { active: "person", idle: "person-outline" },
};

// Minimal structural type — expo-router vendors its own bottom-tabs types,
// so we avoid pinning to @react-navigation's incompatible declarations.
type TabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: {
    emit: (e: { type: "tabPress"; target: string; canPreventDefault: true }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
};

// Floating white capsule, centered above the home indicator.
export function TabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: Math.max(insets.bottom, 12) + 4 }]}>
      <View style={[styles.capsule, shadow.soft]}>
        {state.routes.map((route, i) => {
          const focused = state.index === i;
          const icon = ICONS[route.name] ?? ICONS.index;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={route.name}
              hitSlop={8}
              onPress={() => {
                Haptics.selectionAsync();
                const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
                if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
              }}
              style={[styles.item, focused && styles.itemActive]}>
              <Ionicons
                name={focused ? icon.active : icon.idle}
                size={22}
                color={focused ? colors.white : colors.sub}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  capsule: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 999,
    padding: 8,
    gap: 4,
  },
  item: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  itemActive: {
    backgroundColor: colors.ink,
  },
});
