import "@/utils/storage";
import "@/utils/clipboard-polyfill";

import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";

import { AppThemeProvider, useAppTheme } from "@/theme/theme-context";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: localStorage,
  key: "welcome-to-f1-query-cache",
});

function RootChrome() {
  const { colors, mode } = useAppTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerTintColor: colors.text,
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="favorites"
          options={{
            title: "Favorites",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: "Settings",
            presentation: "modal",
          }}
        />
        <Stack.Screen name="+not-found" options={{ title: "Not found" }} />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 24 * 14,
      }}
    >
      <AppThemeProvider>
        <RootChrome />
      </AppThemeProvider>
    </PersistQueryClientProvider>
  );
}
