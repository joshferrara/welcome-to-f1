import { View } from "react-native";

import { ActionButton, AppText, FlagPanel, Screen, Section } from "@/components/ui";

export default function NotFound() {
  return (
    <Screen>
      <Section>
        <FlagPanel>
          <AppText variant="title">Page not found</AppText>
          <AppText muted>This screen does not exist in the mobile guide.</AppText>
          <View style={{ alignSelf: "flex-start" }}>
            <ActionButton label="Go home" href="/home" />
          </View>
        </FlagPanel>
      </Section>
    </Screen>
  );
}
