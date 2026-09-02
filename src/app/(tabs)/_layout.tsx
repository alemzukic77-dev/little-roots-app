import { Tabs } from "expo-router";

import { TabBar } from "@/components/ui/TabBar";
import { colors } from "@/theme/tokens";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.cream },
      }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="learn" />
      <Tabs.Screen name="browse" />
      <Tabs.Screen name="saved" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
