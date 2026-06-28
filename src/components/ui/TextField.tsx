import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";

import { colors, font, radius } from "@/theme/tokens";

type Props = TextInputProps & {
  label: string;
  secure?: boolean;
};

export function TextField({ label, secure, ...inputProps }: Props) {
  const [hidden, setHidden] = useState(!!secure);
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          placeholderTextColor={colors.sub}
          secureTextEntry={hidden}
          autoCorrect={false}
          style={styles.input}
          {...inputProps}
        />
        {secure && (
          <Pressable hitSlop={10} onPress={() => setHidden((h) => !h)} accessibilityRole="button">
            <Ionicons name={hidden ? "eye-off-outline" : "eye-outline"} size={20} color={colors.sub} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
  },
  label: {
    fontFamily: font.medium,
    fontSize: 13,
    color: colors.sub,
    paddingLeft: 18,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.button,
    paddingHorizontal: 18,
  },
  input: {
    flex: 1,
    height: 54,
    fontFamily: font.medium,
    fontSize: 15,
    color: colors.ink,
  },
});
