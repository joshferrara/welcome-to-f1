import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

import {
  ActionButton,
  AppText,
  DriverTile,
  ErrorState,
  FavoriteButton,
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
import { resolveAssetUrl } from "@/content/client";
import { useContent } from "@/content/queries";
import { useFavorites } from "@/hooks/use-favorites";

export default function TeamDetailScreen() {
  const { teamId } = useLocalSearchParams<{ teamId: string }>();
  const query = useContent();
  const { isFavorite, toggleFavorite } = useFavorites();

  if (query.isLoading && !query.data) return <LoadingState />;
  if (query.error && !query.data) {
    return <ErrorState message={query.error.message} onRetry={() => query.refetch()} />;
  }
  const bundle = query.data;
  if (!bundle) return null;
  const team = bundle.teamsById[teamId];

  if (!team) {
    return (
      <Screen>
        <Section>
          <FlagPanel>
            <AppText variant="title">Team not found</AppText>
            <ActionButton label="Back to grid" href="/grid" />
          </FlagPanel>
        </Section>
      </Screen>
    );
  }

  const drivers = team.driverIds.map((id) => bundle.driversById[id]).filter(Boolean);
  const standing = bundle.standings.constructors.find((item) => item.name === team.name);

  return (
    <Screen>
      <Stack.Screen options={{ title: team.name }} />
      <Section warm>
        <FlagPanel accentColor={team.color}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
            <View style={{ flex: 1, gap: 8 }}>
              <Pill>{team.engine}</Pill>
              <AppText variant="title">{team.name}</AppText>
              {team.badge ? <AppText muted>{team.badge}</AppText> : null}
            </View>
            <FavoriteButton
              active={isFavorite("teams", team.id)}
              onPress={() => toggleFavorite("teams", team.id)}
            />
          </View>
        </FlagPanel>
      </Section>

      <Section>
        <SectionHeader title="Drivers" />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {drivers.map((driver) => (
            <DriverTile
              key={driver.id}
              href={`/grid/drivers/${driver.id}`}
              imageUri={resolveAssetUrl(bundle.manifest, driver.image)}
              name={driver.name}
              meta={`${driver.code} / #${driver.number}`}
              number={driver.number}
              accentColor={team.color}
            />
          ))}
        </View>
      </Section>

      <Section warm>
        <SectionHeader title="Team data" />
        <ListGroup>
          <ListRow compact>
            <AppText muted>Engine</AppText>
            <AppText variant="mono">{team.engine ?? "TBD"}</AppText>
          </ListRow>
          {standing ? (
            <>
              <ListRow compact>
                <AppText muted>Constructor standing</AppText>
                <AppText variant="mono">P{standing.pos}</AppText>
              </ListRow>
              <ListRow compact>
                <AppText muted>Points</AppText>
                <AppText variant="mono">{standing.points}</AppText>
              </ListRow>
            </>
          ) : null}
        </ListGroup>
      </Section>

      <Section>
        <InlineList>
          {team.links?.wikipedia ? <ActionButton label="Wikipedia" href={team.links.wikipedia} /> : null}
        </InlineList>
      </Section>
    </Screen>
  );
}
