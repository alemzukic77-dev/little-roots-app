import { Platform } from "react-native";

// Little Roots design language — warm cream canvas, ink accents,
// soft category tints carried over from the website palette.
export const colors = {
  cream: "#FDF4EE",
  creamDeep: "#F7E8DC",
  card: "#FFFFFF",
  ink: "#1C1A20",
  inkSoft: "#4A4750",
  sub: "#8E8A93",
  line: "#EFE6DE",
  ember: "#FF6D3B",
  emberSoft: "#FFE3D7",
  star: "#FFB938",
  danger: "#E5484D",
  white: "#FFFFFF",

  // Category tints (chip backgrounds) + their text colors
  tint: {
    "fine-motor": { bg: "#E8EEFB", fg: "#3D5A9E" },
    sensory: { bg: "#E5F3E8", fg: "#3E7A4E" },
    creativity: { bg: "#FBE8EE", fg: "#B04A6E" },
    "practical-life": { bg: "#FFF1DC", fg: "#A06B1F" },
    language: { bg: "#EEE9FB", fg: "#6650A8" },
    physical: { bg: "#E2F2F7", fg: "#2E7490" },
  } as Record<string, { bg: string; fg: string }>,
};

export const font = {
  // Plus Jakarta Sans — loaded in root layout
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semibold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
  extrabold: "PlusJakartaSans_800ExtraBold",
};

export const radius = {
  card: 32,
  inner: 24,
  button: 28,
  pill: 999,
  badge: 16,
};

export const spacing = (n: number) => n * 4;

// Soft elevation used on cards and the floating tab bar
export const shadow = {
  card: Platform.select({
    ios: {
      shadowColor: "#3A2E24",
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
    },
    android: { elevation: 8 },
  })!,
  soft: Platform.select({
    ios: {
      shadowColor: "#3A2E24",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    android: { elevation: 4 },
  })!,
};
