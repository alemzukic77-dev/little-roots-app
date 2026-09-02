import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { LearnDetail } from "@/components/learn/LearnDetail";
import { getColor, colorIdeas } from "@/data/colors";
import { printColorWorksheet } from "@/lib/worksheet";
import { colors, font } from "@/theme/tokens";

export default function ColorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const c = getColor(id ?? "");

  if (!c) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>Colour not found.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.missingBack}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const isWhite = c.hex.toUpperCase() === "#FFFFFF";

  return (
    <LearnDetail
      hero={
        <View
          style={[
            styles.swatch,
            { backgroundColor: c.hex },
            isWhite && { borderWidth: 2, borderColor: colors.line },
          ]}
        />
      }
      heroBg={colors.creamDeep}
      accentFg={colors.inkSoft}
      title={c.name}
      subtitle={`${c.name} is all around us`}
      ideas={colorIdeas(c)}
      examples={c.examples}
      examplesLabel={`Find these ${c.name.toLowerCase()} things`}
      onPrint={() => printColorWorksheet(c)}
      printLabel="Print colour hunt"
      printHint="Print the hunt list, then tick off each thing you find together."
    />
  );
}

const styles = StyleSheet.create({
  swatch: { width: 120, height: 120, borderRadius: 32 },
  missing: { flex: 1, backgroundColor: colors.cream, alignItems: "center", justifyContent: "center", gap: 12 },
  missingText: { fontFamily: font.semibold, fontSize: 16, color: colors.inkSoft },
  missingBack: { fontFamily: font.bold, fontSize: 15, color: colors.ember },
});
