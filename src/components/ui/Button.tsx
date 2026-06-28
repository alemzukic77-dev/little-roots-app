import { ActivityIndicator, Pressable, StyleSheet, Text, type ViewStyle } from "react-native";

import { colors, font, radius } from "@/theme/tokens";

type Props = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "ghost" | "outline";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

export function Button({ label, onPress, variant = "primary", loading, disabled, style }: Props) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] },
        isDisabled && { opacity: 0.5 },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? colors.white : colors.ink} />
      ) : (
        <Text style={[styles.label, variant !== "primary" && { color: colors.ink }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: radius.button,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  primary: {
    backgroundColor: colors.ink,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  outline: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
  },
  label: {
    fontFamily: font.bold,
    fontSize: 16,
    color: colors.white,
  },
});
