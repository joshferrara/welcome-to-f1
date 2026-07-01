import { useQueryClient } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import React from "react";
import { View } from "react-native";

import {
  ActionButton,
  AppText,
  ErrorState,
  FlagPanel,
  InlineList,
  ListGroup,
  ListRow,
  LoadingState,
  Pill,
  Screen,
  Section,
  SectionHeader,
} from "@/components/ui";
import { contentQueryKey, useContent } from "@/content/queries";
import { useAppTheme, ThemePreference, UnitPreference } from "@/theme/theme-context";
import { storage } from "@/utils/storage";

const themeOptions: ThemePreference[] = ["system", "dark", "light"];
const unitOptions: UnitPreference[] = ["imperial", "metric"];

export default function SettingsScreen() {
  const query = useContent();
  const queryClient = useQueryClient();
  const {
    colors,
    brand,
    themePreference,
    setThemePreference,
    unitPreference,
    setUnitPreference,
  } = useAppTheme();
  const [scheduledCount, setScheduledCount] = React.useState<number | null>(null);

  React.useEffect(() => {
    Notifications.getAllScheduledNotificationsAsync()
      .then((items) => setScheduledCount(items.length))
      .catch(() => setScheduledCount(null));
  }, []);

  async function clearContentCache() {
    queryClient.removeQueries({ queryKey: contentQueryKey });
    storage.remove("welcome-to-f1-query-cache");
    await query.refetch();
  }

  async function clearReminders() {
    await Notifications.cancelAllScheduledNotificationsAsync();
    storage.set("reminders.v1", {});
    setScheduledCount(0);
  }

  if (query.isLoading && !query.data) return <LoadingState />;
  if (query.error && !query.data) {
    return <ErrorState message={query.error.message} onRetry={() => query.refetch()} />;
  }
  const bundle = query.data;

  return (
    <Screen>
      <Section warm>
        <SectionHeader
          eyebrow="App"
          title="Settings"
          subtitle="Preferences are local to this device. Content comes from the website JSON contract."
        />
      </Section>

      <Section>
        <FlagPanel>
          <AppText variant="subtitle">Appearance</AppText>
          <InlineList>
            {themeOptions.map((option) => (
              <ActionButton
                key={option}
                label={option[0].toUpperCase() + option.slice(1)}
                selected={themePreference === option}
                onPress={() => setThemePreference(option)}
              />
            ))}
          </InlineList>
          <View
            style={{
              height: 72,
              borderRadius: 18,
              borderCurve: "continuous",
              backgroundColor: colors.secondaryBackground,
              borderWidth: 1,
              borderColor: colors.border,
              justifyContent: "center",
              paddingHorizontal: 14,
            }}
          >
            <AppText variant="mono" style={{ color: brand.f1Red }}>
              #E10600
            </AppText>
            <AppText muted>F1 red stays the primary accent across themes.</AppText>
          </View>
        </FlagPanel>
      </Section>

      <Section warm>
        <FlagPanel>
          <AppText variant="subtitle">Units</AppText>
          <InlineList>
            {unitOptions.map((option) => (
              <ActionButton
                key={option}
                label={option === "imperial" ? "mph" : "km/h"}
                selected={unitPreference === option}
                onPress={() => setUnitPreference(option)}
              />
            ))}
          </InlineList>
        </FlagPanel>
      </Section>

      <Section>
        <FlagPanel>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <AppText variant="subtitle">Reminders</AppText>
              <AppText muted>
                {scheduledCount === null ? "Notification count unavailable." : `${scheduledCount} local reminders scheduled.`}
              </AppText>
            </View>
            <ActionButton label="Clear" onPress={clearReminders} />
          </View>
        </FlagPanel>
      </Section>

      <Section warm>
        <SectionHeader title="Data contract" />
        {bundle ? (
          <ListGroup>
            <ListRow compact>
              <AppText muted>Schema</AppText>
              <AppText variant="mono">v{bundle.manifest.schemaVersion}</AppText>
            </ListRow>
            <ListRow compact>
              <AppText muted>Season</AppText>
              <AppText variant="mono">{bundle.manifest.season}</AppText>
            </ListRow>
            <ListRow compact>
              <AppText muted>Generated</AppText>
              <AppText variant="mono">{new Date(bundle.manifest.generatedAt).toLocaleString()}</AppText>
            </ListRow>
            <ListRow compact>
              <AppText muted>Drivers</AppText>
              <AppText variant="mono">{bundle.drivers.length}</AppText>
            </ListRow>
            <ListRow compact>
              <AppText muted>Teams</AppText>
              <AppText variant="mono">{bundle.teams.length}</AppText>
            </ListRow>
            <ListRow compact>
              <AppText muted>Races</AppText>
              <AppText variant="mono">{bundle.races.length}</AppText>
            </ListRow>
          </ListGroup>
        ) : (
          <Pill tone="red">No data loaded</Pill>
        )}
        <InlineList>
          <ActionButton label="Refresh now" onPress={() => query.refetch()} selected />
          <ActionButton label="Clear cache" onPress={clearContentCache} />
        </InlineList>
      </Section>
    </Screen>
  );
}
