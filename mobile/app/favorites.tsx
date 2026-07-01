import {
  ActionButton,
  AppText,
  ErrorState,
  FlagPanel,
  ListGroup,
  ListRow,
  LoadingState,
  Screen,
  Section,
  SectionHeader,
} from "@/components/ui";
import { useContent } from "@/content/queries";
import { useFavorites } from "@/hooks/use-favorites";

export default function FavoritesScreen() {
  const query = useContent();
  const { favorites } = useFavorites();

  if (query.isLoading && !query.data) return <LoadingState />;
  if (query.error && !query.data) {
    return <ErrorState message={query.error.message} onRetry={() => query.refetch()} />;
  }
  const bundle = query.data;
  if (!bundle) return null;

  const drivers = favorites.drivers.map((id) => bundle.driversById[id]).filter(Boolean);
  const teams = favorites.teams.map((id) => bundle.teamsById[id]).filter(Boolean);
  const races = favorites.races.map((id) => bundle.racesById[id]).filter(Boolean);
  const topics = favorites.topics
    .map((id) => bundle.guide.sections.find((section) => section.id === id))
    .filter(Boolean);
  const empty = !drivers.length && !teams.length && !races.length && !topics.length;

  return (
    <Screen>
      <Section warm>
        <SectionHeader
          eyebrow="Local"
          title="Favorites"
          subtitle="Saved items stay on this device and are driven by the latest content bundle."
        />
      </Section>

      {empty ? (
        <Section>
          <FlagPanel>
            <AppText variant="subtitle">Nothing saved yet</AppText>
            <AppText muted>Save drivers, teams, races, or guide topics and they will appear here.</AppText>
            <ActionButton label="Explore the grid" href="/grid" />
          </FlagPanel>
        </Section>
      ) : null}

      {drivers.length ? (
        <Section>
          <SectionHeader title="Drivers" />
          <ListGroup>
            {drivers.map((driver) => (
              <ListRow key={driver.id} href={`/grid/drivers/${driver.id}`} compact>
                <AppText variant="subtitle">{driver.name}</AppText>
                <AppText muted>
                  {driver.code} / {driver.displayTeam}
                </AppText>
              </ListRow>
            ))}
          </ListGroup>
        </Section>
      ) : null}

      {teams.length ? (
        <Section>
          <SectionHeader title="Teams" />
          <ListGroup>
            {teams.map((team) => (
              <ListRow key={team.id} href={`/grid/teams/${team.id}`} compact accentColor={team.color}>
                <AppText variant="subtitle">{team.name}</AppText>
                <AppText muted>{team.engine}</AppText>
              </ListRow>
            ))}
          </ListGroup>
        </Section>
      ) : null}

      {races.length ? (
        <Section>
          <SectionHeader title="Races" />
          <ListGroup>
            {races.map((race) => (
              <ListRow key={race.id} href={`/schedule/${race.id}`} compact>
                <AppText variant="subtitle">{race.name}</AppText>
                <AppText muted>{race.location ?? ""}</AppText>
              </ListRow>
            ))}
          </ListGroup>
        </Section>
      ) : null}

      {topics.length ? (
        <Section>
          <SectionHeader title="Topics" />
          <ListGroup>
            {topics.map((topic) =>
              topic ? (
                <ListRow key={topic.id} href={`/learn/${topic.id}`} compact>
                  <AppText variant="subtitle">{topic.title}</AppText>
                  {topic.subtitle ? <AppText muted>{topic.subtitle}</AppText> : null}
                </ListRow>
              ) : null
            )}
          </ListGroup>
        </Section>
      ) : null}
    </Screen>
  );
}
