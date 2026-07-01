import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

import {
  ActionButton,
  AppText,
  ErrorState,
  FavoriteButton,
  FlagPanel,
  ListGroup,
  ListRow,
  LoadingState,
  Pill,
  RaceImage,
  Screen,
  Section,
  SectionHeader,
} from "@/components/ui";
import { resolveHeroCarUrl, resolveRaceImageUrl } from "@/content/client";
import { useContent } from "@/content/queries";
import { formatDateTime, getRaceSessions, isRaceComplete } from "@/content/race-utils";
import { useFavorites } from "@/hooks/use-favorites";
import { useReminders } from "@/reminders/reminders";
import { useAppTheme } from "@/theme/theme-context";
import { startRaceWeekActivity } from "@/widgets/sync";

export default function RaceDetailScreen() {
  const { raceId } = useLocalSearchParams<{ raceId: string }>();
  const query = useContent();
  const { brand } = useAppTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { reminders, toggleSessionReminder } = useReminders();

  if (query.isLoading && !query.data) return <LoadingState />;
  if (query.error && !query.data) {
    return <ErrorState message={query.error.message} onRetry={() => query.refetch()} />;
  }
  const bundle = query.data;
  if (!bundle) return null;

  const race = bundle.racesById[raceId];
  if (!race?.name) {
    return (
      <Screen>
        <Section>
          <FlagPanel>
            <AppText variant="title">{race?.label ?? "Race not found"}</AppText>
            {race?.detail ? <AppText muted>{race.detail}</AppText> : null}
            <ActionButton label="Back to schedule" href="/schedule" />
          </FlagPanel>
        </Section>
      </Screen>
    );
  }

  const sessions = getRaceSessions(race);
  const complete = isRaceComplete(race);
  const startActivity = () => {
    try {
      startRaceWeekActivity(bundle, race.id);
    } catch {
      // Native widget support is only available in development/store builds.
    }
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: race.name }} />
      <Section warm>
        <SectionHeader eyebrow={`Round ${race.round}`} title={race.name} subtitle={race.location ?? ""} />
        <RaceImage
          uri={resolveRaceImageUrl(bundle.manifest, race) ?? resolveHeroCarUrl(bundle.manifest)}
          alt={race.imageAlt}
          height={210}
        />
        <FlagPanel accentColor={race.sprintWeekend ? brand.amber : brand.f1Red}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
            <View style={{ flex: 1, gap: 9 }}>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {race.sprintWeekend ? <Pill tone="amber">Sprint weekend</Pill> : null}
                {complete ? <Pill tone="green">Completed</Pill> : <Pill tone="red">Upcoming</Pill>}
                {race.isNew ? <Pill>New</Pill> : null}
              </View>
              <AppText muted>
                Session times are resolved from the shared UTC data and shown in your local timezone.
              </AppText>
            </View>
            <FavoriteButton
              active={isFavorite("races", race.id)}
              onPress={() => toggleFavorite("races", race.id)}
            />
          </View>
        </FlagPanel>
      </Section>

      <Section>
        <SectionHeader title="Sessions" subtitle="Tap a session reminder to schedule or remove it." />
        <ListGroup>
          {sessions.map((session) => {
            const reminderKey = `${race.id}:${session.key}`;
            const hasReminder = Boolean(reminders[reminderKey]);
            return (
              <ListRow key={session.key}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                  <View style={{ flex: 1 }}>
                    <AppText variant="subtitle">{session.label}</AppText>
                    <AppText muted>{formatDateTime(session.startsAt)}</AppText>
                  </View>
                  <ActionButton
                    label={hasReminder ? "Reminder on" : "Remind me"}
                    selected={hasReminder}
                    onPress={() => toggleSessionReminder(race, session)}
                  />
                </View>
              </ListRow>
            );
          })}
        </ListGroup>
      </Section>

      {race.results?.length ? (
        <Section warm>
          <SectionHeader title="Result" />
          <ListGroup>
            {race.results.map((code, index) => {
              const driver = bundle.driversByCode[code];
              return (
                <ListRow key={`${code}-${index}`} compact>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                    <AppText variant="mono" style={{ color: brand.f1Red, width: 30 }}>
                      P{index + 1}
                    </AppText>
                    <AppText style={{ flex: 1 }}>{driver ? `${driver.name} (${code})` : code}</AppText>
                  </View>
                </ListRow>
              );
            })}
          </ListGroup>
        </Section>
      ) : null}

      {race.raceNote ? (
        <Section>
          <FlagPanel accentColor={brand.amber}>
            <Pill tone="amber">{race.raceNote.text ?? "Schedule note"}</Pill>
            <AppText variant="subtitle">{race.raceNote.title ?? "Race note"}</AppText>
          </FlagPanel>
        </Section>
      ) : null}

      {!complete ? (
        <Section>
          <FlagPanel>
            <AppText variant="subtitle">Live Activity</AppText>
            <AppText muted>
              Start a race-week Live Activity on supported iOS builds. The content uses this same cached race data.
            </AppText>
            <ActionButton label="Start activity" onPress={startActivity} />
          </FlagPanel>
        </Section>
      ) : null}
    </Screen>
  );
}
