import React from "react";
import { View } from "react-native";

import {
  ActionButton,
  AppText,
  ErrorState,
  FavoriteButton,
  InlineList,
  FlagPanel,
  HeroPanel,
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
import {
  daysUntil,
  formatDateTime,
  formatLocalDate,
  formatLocalTime,
  getCurrentRaceWeek,
  getMainRaceDate,
  getNextRace,
  getRaceSessions,
  stripHtml,
} from "@/content/race-utils";
import { useFavorites } from "@/hooks/use-favorites";
import { useAppTheme } from "@/theme/theme-context";
import { syncNextRaceWidget } from "@/widgets/sync";

export default function HomeScreen() {
  const query = useContent();
  const { colors, brand } = useAppTheme();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  React.useEffect(() => {
    if (query.data) {
      syncNextRaceWidget(query.data);
    }
  }, [query.data]);

  if (query.isLoading && !query.data) return <LoadingState />;
  if (query.error && !query.data) {
    return <ErrorState message={query.error.message} onRetry={() => query.refetch()} />;
  }

  const bundle = query.data;
  if (!bundle) return null;

  const nextRace = getNextRace(bundle.races);
  const raceWeek = getCurrentRaceWeek(bundle.races);
  const nextRaceDate = nextRace ? getMainRaceDate(nextRace) : null;
  const nextSessions = nextRace ? getRaceSessions(nextRace) : [];
  const nextRaceImage =
    nextRace ? resolveRaceImageUrl(bundle.manifest, nextRace) ?? resolveHeroCarUrl(bundle.manifest) : undefined;
  const favoriteDrivers = favorites.drivers.map((id) => bundle.driversById[id]).filter(Boolean);
  const favoriteTeams = favorites.teams.map((id) => bundle.teamsById[id]).filter(Boolean);
  const introTopics = bundle.guide.sections.filter((section) =>
    ["basics", "weekend", "cars", "tyres"].includes(section.id)
  );

  return (
    <Screen refreshing={query.isRefetching} onRefresh={() => query.refetch()}>
      <HeroPanel
        eyebrow={raceWeek ? "Race week" : bundle.guide.hero.badge}
        title="Welcome to Formula 1"
        subtitle={stripHtml(bundle.guide.hero.subtitleHtml)}
        imageUri={resolveHeroCarUrl(bundle.manifest)}
      >
        <InlineList>
          <ActionButton label="Start learning" href="/learn" selected />
          <ActionButton label="Favorites" href="/favorites" />
          <ActionButton label="Search" href="/search" />
          <ActionButton label="Settings" href="/settings" />
        </InlineList>
      </HeroPanel>

      {nextRace ? (
        <Section warm>
          <SectionHeader
            eyebrow={nextRace.sprintWeekend ? "Sprint weekend" : "Next race"}
            title={nextRace.name ?? "Next race"}
            subtitle={nextRace.location}
          />
          <RaceImage uri={nextRaceImage} alt={nextRace.imageAlt} height={190} />
          <FlagPanel accentColor={nextRace.sprintWeekend ? brand.amber : brand.f1Red}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 14, alignItems: "flex-start" }}>
              <View style={{ flex: 1, gap: 8 }}>
                {nextRaceDate ? (
                  <>
                    <AppText variant="mono" style={{ color: brand.amber }}>
                      {daysUntil(nextRaceDate)} days out
                    </AppText>
                    <AppText variant="subtitle">{formatDateTime(nextRaceDate)}</AppText>
                  </>
                ) : null}
                <AppText variant="caption" muted>
                  Times are shown in your local timezone.
                </AppText>
              </View>
              <FavoriteButton
                active={isFavorite("races", nextRace.id)}
                onPress={() => toggleFavorite("races", nextRace.id)}
              />
            </View>
          </FlagPanel>
          <ListGroup>
            {nextSessions.slice(0, 4).map((session) => (
              <ListRow key={session.key} compact>
                <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
                  <AppText muted>{session.label}</AppText>
                  <AppText variant="mono">
                    {formatLocalDate(session.startsAt)} / {formatLocalTime(session.startsAt)}
                  </AppText>
                </View>
              </ListRow>
            ))}
          </ListGroup>
          <InlineList>
            <ActionButton label="Race details" href={`/schedule/${nextRace.id}`} selected />
            <ActionButton label="Full schedule" href="/schedule" />
          </InlineList>
        </Section>
      ) : null}

      <Section>
        <SectionHeader title="Standings snapshot" subtitle={bundle.standings.lastUpdated} />
        <ListGroup>
          {bundle.standings.drivers.slice(0, 5).map((driver) => (
            <ListRow key={driver.code} compact accentColor={driver.pos === 1 ? brand.f1Red : undefined}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <AppText variant="mono" style={{ color: brand.f1Red, width: 32 }}>
                  P{driver.pos}
                </AppText>
                <View style={{ flex: 1 }}>
                  <AppText variant="subtitle">{driver.name}</AppText>
                  <AppText variant="caption" muted>
                    {driver.team}
                  </AppText>
                </View>
                <AppText variant="mono">{driver.points}</AppText>
              </View>
            </ListRow>
          ))}
        </ListGroup>
      </Section>

      {(favoriteDrivers.length || favoriteTeams.length) ? (
        <Section warm>
          <SectionHeader title="Your saved grid" subtitle="Local favorites stay on this device." />
          <ListGroup>
            {favoriteDrivers.map((driver) => (
              <ListRow key={driver.id} href={`/grid/drivers/${driver.id}`} compact>
                <AppText variant="subtitle">{driver.name}</AppText>
                <AppText muted>
                  {driver.code} / {driver.displayTeam}
                </AppText>
              </ListRow>
            ))}
            {favoriteTeams.map((team) => (
              <ListRow key={team.id} href={`/grid/teams/${team.id}`} compact accentColor={team.color}>
                <AppText variant="subtitle">{team.name}</AppText>
                <AppText muted>{team.engine}</AppText>
              </ListRow>
            ))}
          </ListGroup>
        </Section>
      ) : null}

      <Section warm>
        <SectionHeader title="Start here" subtitle="Shortcuts into the guide." />
        <ListGroup>
          {introTopics.map((topic) => (
            <ListRow key={topic.id} href={`/learn/${topic.id}`} accentColor={brand.f1Red}>
              <View style={{ gap: 5 }}>
                <AppText variant="eyebrow">{topic.number}</AppText>
                <AppText variant="subtitle">{topic.title}</AppText>
                {topic.subtitle ? <AppText muted>{topic.subtitle}</AppText> : null}
              </View>
            </ListRow>
          ))}
        </ListGroup>
      </Section>

      <Section>
        <FlagPanel>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <AppText variant="subtitle">Data status</AppText>
              <AppText muted>
                Schema v{bundle.manifest.schemaVersion} / generated {new Date(bundle.manifest.generatedAt).toLocaleString()}
              </AppText>
            </View>
            <ActionButton label="Refresh" onPress={() => query.refetch()} />
          </View>
        </FlagPanel>
      </Section>
    </Screen>
  );
}
