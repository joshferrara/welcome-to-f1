import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

import {
  AppText,
  DriverTile,
  ErrorState,
  FlagPanel,
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
import { useAppTheme } from "@/theme/theme-context";

const views = ["Drivers", "Teams", "Standings", "Champions"];

export default function GridScreen() {
  const params = useLocalSearchParams<{ view?: string }>();
  const query = useContent();
  const { colors, brand } = useAppTheme();
  const initialIndex = params.view === "champions" ? 3 : 0;
  const [selectedIndex, setSelectedIndex] = React.useState(initialIndex);

  if (query.isLoading && !query.data) return <LoadingState />;
  if (query.error && !query.data) {
    return <ErrorState message={query.error.message} onRetry={() => query.refetch()} />;
  }
  const bundle = query.data;
  if (!bundle) return null;

  return (
    <Screen refreshing={query.isRefetching} onRefresh={() => query.refetch()}>
      <Section warm>
        <SectionHeader
          eyebrow={`${bundle.drivers.length} drivers / ${bundle.teams.length} teams`}
          title="The grid"
          subtitle="Drivers, teams, standings, and champions from the shared data contract."
        />
        <SegmentedControl
          values={views}
          selectedIndex={selectedIndex}
          onChange={(event) => setSelectedIndex(event.nativeEvent.selectedSegmentIndex)}
          tintColor={brand.f1Red}
          backgroundColor={colors.secondaryBackground}
          fontStyle={{ color: colors.secondaryText, fontWeight: "700" }}
          activeFontStyle={{ color: "#FFFFFF", fontWeight: "800" }}
        />
      </Section>

      {selectedIndex === 0 ? (
        <Section>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            {bundle.drivers.map((driver) => {
              const team = bundle.teamsById[driver.teamId];
              return (
                <DriverTile
                  key={driver.id}
                  href={`/grid/drivers/${driver.id}`}
                  imageUri={resolveAssetUrl(bundle.manifest, driver.image)}
                  name={driver.name}
                  meta={`${driver.code} / ${driver.displayTeam}`}
                  number={driver.number}
                  tag={driver.tag}
                  accentColor={team?.color ?? brand.f1Red}
                />
              );
            })}
          </View>
        </Section>
      ) : null}

      {selectedIndex === 1 ? (
        <Section>
          <ListGroup>
            {bundle.teams.map((team) => (
              <ListRow key={team.id} href={`/grid/teams/${team.id}`} accentColor={team.color}>
                <View style={{ gap: 8 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
                    <AppText variant="subtitle" style={{ flex: 1 }}>
                      {team.name}
                    </AppText>
                    <Pill>{team.engine}</Pill>
                  </View>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                    {team.driverNames?.map((name) => <Pill key={name}>{name}</Pill>)}
                  </View>
                </View>
              </ListRow>
            ))}
          </ListGroup>
        </Section>
      ) : null}

      {selectedIndex === 2 ? (
        <>
        <Section warm>
          <SectionHeader title="Driver standings" subtitle={`Updated ${bundle.standings.lastUpdated}`} />
          <ListGroup>
            {bundle.standings.drivers.map((driver) => (
              <ListRow key={driver.code} compact accentColor={driver.pos === 1 ? brand.f1Red : undefined}>
                <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
                  <AppText variant="mono" style={{ color: brand.f1Red, width: 34 }}>
                    P{driver.pos}
                  </AppText>
                  <View style={{ flex: 1 }}>
                    <AppText variant="subtitle">{driver.name}</AppText>
                    <AppText variant="caption" muted>{driver.team}</AppText>
                  </View>
                  <AppText variant="mono">{driver.points}</AppText>
                </View>
              </ListRow>
            ))}
          </ListGroup>
        </Section>
        <Section>
          <SectionHeader title="Constructor standings" />
          <ListGroup>
            {bundle.standings.constructors.map((team) => (
              <ListRow key={team.name} compact>
                <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
                  <AppText variant="mono" style={{ color: brand.f1Red, width: 34 }}>
                    P{team.pos}
                  </AppText>
                  <AppText variant="subtitle" style={{ flex: 1 }}>{team.name}</AppText>
                  <AppText variant="mono">{team.points}</AppText>
                </View>
              </ListRow>
            ))}
          </ListGroup>
        </Section>
        </>
      ) : null}

      {selectedIndex === 3 ? (
        <Section>
          <FlagPanel>
            <AppText variant="subtitle">Champions archive</AppText>
            <AppText muted>{bundle.champions.champions.length} title-winning seasons from the shared table.</AppText>
          </FlagPanel>
          <ListGroup>
            {bundle.champions.champions
              .slice()
              .reverse()
              .map((champion) => (
                <ListRow
                  key={`${champion.year}-${champion.driver}`}
                  compact
                  accentColor={bundle.champions.teamColors?.[champion.team]}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
                    <View style={{ flex: 1 }}>
                      <AppText variant="mono" style={{ color: brand.f1Red }}>
                        {champion.year}
                      </AppText>
                      <AppText variant="subtitle">{champion.driver}</AppText>
                      <AppText muted>{champion.team}</AppText>
                    </View>
                    <View
                      style={{
                        backgroundColor: colors.secondaryBackground,
                        borderRadius: 999,
                        width: 42,
                        height: 42,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AppText variant="mono">{bundle.champions.flagMap?.[champion.nationality] ?? champion.nationality}</AppText>
                    </View>
                  </View>
                </ListRow>
              ))}
          </ListGroup>
        </Section>
      ) : null}
    </Screen>
  );
}
