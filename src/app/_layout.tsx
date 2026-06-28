import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, type ReactNode } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AuthProvider, useAuth } from "@/lib/auth";
import { colors } from "@/theme/tokens";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // catalog changes rarely
      gcTime: 1000 * 60 * 60 * 24 * 7,
      retry: 2,
    },
  },
});

const persister = createAsyncStoragePersister({ storage: AsyncStorage });

/** Routes by app state: welcome (signed out) → auth → verify-email → tabs. */
function AuthGate({ children, fontsLoaded }: { children: ReactNode; fontsLoaded: boolean }) {
  const { user, initializing, needsVerification } = useAuth();
  const segments = useSegments() as string[];
  const router = useRouter();

  const ready = fontsLoaded && !initializing;

  useEffect(() => {
    if (!ready) return;
    const group = segments[0] as string | undefined;
    if (!user && group !== "(onboarding)" && group !== "(auth)") {
      // signed-out users always land on the welcome screen
      router.replace("/(onboarding)/welcome");
    } else if (user && needsVerification && segments[1] !== "verify-email") {
      router.replace("/(auth)/verify-email");
    } else if (user && !needsVerification && (group === "(auth)" || group === "(onboarding)")) {
      router.replace("/(tabs)");
    }
    SplashScreen.hideAsync();
  }, [ready, user, needsVerification, segments, router]);

  if (!ready) return null;
  return <>{children}</>;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister, maxAge: 1000 * 60 * 60 * 24 * 7, buster: "v9" }}>
        <AuthProvider>
          <StatusBar style="dark" />
          <AuthGate fontsLoaded={fontsLoaded}>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.cream },
              }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(onboarding)" />
              <Stack.Screen
                name="activity/[slug]"
                options={{ presentation: "modal", animation: "slide_from_bottom" }}
              />
            </Stack>
          </AuthGate>
        </AuthProvider>
      </PersistQueryClientProvider>
    </GestureHandlerRootView>
  );
}
