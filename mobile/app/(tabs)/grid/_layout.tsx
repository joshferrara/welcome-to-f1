import { Stack } from "expo-router";

export default function GridLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Grid", headerLargeTitle: true }} />
      <Stack.Screen name="drivers/[driverId]" options={{ title: "Driver" }} />
      <Stack.Screen name="teams/[teamId]" options={{ title: "Team" }} />
    </Stack>
  );
}
