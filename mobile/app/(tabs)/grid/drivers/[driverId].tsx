import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

import {
  ActionButton,
  AppText,
  ErrorState,
  FavoriteButton,
  FlagPanel,
  InlineList,
  ListGroup,
  ListRow,
  LoadingState,
  Pill,
  RemoteImage,
  Screen,
  Section,
  SectionHeader,
} from "@/components/ui";
import { resolveAssetUrl } from "@/content/client";
import { useContent } from "@/content/queries";
import { useFavorites } from "@/hooks/use-favorites";
import { useAppTheme } from "@/theme/theme-context";

export default function DriverDetailScreen() {
  const { driverId } = useLocalSearchParams<{ driverId: string }>();
  const query = useContent();
  const { brand } = useAppTheme();
  const { isFavorite, toggleFavorite } = useFavorites();

  if (query.isLoading && !query.data) return <LoadingState />;
  if (query.error && !query.data) {
    return <ErrorState message={query.error.message} onRetry={() => query.refetch()} />;
  }
  const bundle = query.data;
  if (!bundle) return null;
  const driver = bundle.driversById[driverId];

  if (!driver) {
    return (
      <Screen>
        <Section>
          <FlagPanel>
            <AppText variant="title">Driver not found</AppText>
            <ActionButton label="Back to grid" href="/grid" />
          </FlagPanel>
        </Section>
      </Screen>
    );
  }

  const team = bundle.teamsById[driver.teamId];
  const standing = bundle.standings.drivers.find((item) => item.code === driver.code);

  return (
    <Screen>
      <Stack.Screen options={{ title: driver.name }} />
      <Section warm>
        <RemoteImage uri={resolveAssetUrl(bundle.manifest, driver.image)} height={300} />
        <FlagPanel accentColor={team?.color ?? brand.f1Red}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
            <View style={{ flex: 1, gap: 6 }}>
              <AppText variant="mono" style={{ color: team?.color ?? brand.f1Red }}>
                #{driver.number} / {driver.code}
              </AppText>
              <AppText variant="title">{driver.name}</AppText>
              <AppText muted>{driver.displayTeam}</AppText>
              {driver.tag ? <Pill tone="amber">{driver.tag}</Pill> : null}
            </View>
            <FavoriteButton
              active={isFavorite("drivers", driver.id)}
              onPress={() => toggleFavorite("drivers", driver.id)}
            />
          </View>
        </FlagPanel>
      </Section>

      <Section>
        <SectionHeader title="Profile" />
        <ListGroup>
          <ListRow compact>
            <AppText muted>Country</AppText>
            <AppText variant="mono">{`${driver.flag ?? ""} ${driver.countryCode ?? ""}`}</AppText>
          </ListRow>
          <ListRow compact>
            <AppText muted>Team</AppText>
            <AppText variant="mono">{driver.displayTeam}</AppText>
          </ListRow>
          {standing ? (
            <>
              <ListRow compact>
                <AppText muted>Standing</AppText>
                <AppText variant="mono">P{standing.pos}</AppText>
              </ListRow>
              <ListRow compact>
                <AppText muted>Points</AppText>
                <AppText variant="mono">{standing.points}</AppText>
              </ListRow>
              <ListRow compact>
                <AppText muted>Wins</AppText>
                <AppText variant="mono">{standing.wins}</AppText>
              </ListRow>
            </>
          ) : null}
        </ListGroup>
      </Section>

      <Section>
        <InlineList>
          {team ? <ActionButton label="Team page" href={`/grid/teams/${team.id}`} /> : null}
          {driver.links?.wikipedia ? <ActionButton label="Wikipedia" href={driver.links.wikipedia} /> : null}
        </InlineList>
      </Section>
    </Screen>
  );
}
