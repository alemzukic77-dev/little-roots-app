import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, font, shadow } from "@/theme/tokens";

type Props<T> = {
  title: string;
  subtitle: string;
  data: T[];
  numColumns: number;
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => React.ReactElement;
};

/** Back header + intro + a responsive grid — shared by the Learn sub-sections. */
export function GridScreen<T>({ title, subtitle, data, numColumns, keyExtractor, renderItem }: Props<T>) {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? { gap: 14, paddingHorizontal: 24 } : undefined}
        contentContainerStyle={{ gap: 14, paddingBottom: 120 }}
        ListHeaderComponent={
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back"
              hitSlop={8}
              onPress={() => router.back()}
              style={({ pressed }) => [styles.back, shadow.soft, pressed && { opacity: 0.85 }]}>
              <Ionicons name="chevron-back" size={22} color={colors.ink} />
            </Pressable>
            <Text style={styles.heading}>{title}</Text>
            <Text style={styles.sub}>{subtitle}</Text>
          </View>
        }
        renderItem={({ item }) => renderItem(item)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  header: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16, gap: 8 },
  back: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  heading: { fontFamily: font.extrabold, fontSize: 32, color: colors.ink },
  sub: { fontFamily: font.medium, fontSize: 14.5, lineHeight: 22, color: colors.inkSoft },
});
