import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Welcome to F1",
          headerLargeTitle: true,
        }}
      />
    </Stack>
  );
}
