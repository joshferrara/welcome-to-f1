import { View } from "react-native";

import {
  AppText,
  ErrorState,
  FlagPanel,
  InlineList,
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
import { formatDateTime, getMainRaceDate, isGrandPrix, isRaceComplete } from "@/content/race-utils";
import { useAppTheme } from "@/theme/theme-context";

export default function ScheduleScreen() {
  const query = useContent();
  const { brand } = useAppTheme();

  if (query.isLoading && !query.data) return <LoadingState />;
  if (query.error && !query.data) {
    return <ErrorState message={query.error.message} onRetry={() => query.refetch()} />;
  }
  const bundle = query.data;
  if (!bundle) return null;

  const raceItems = bundle.races.filter(isGrandPrix);
  const calendarNotes = bundle.races.filter((race) => !isGrandPrix(race));
  const completed = raceItems.filter((race) => isRaceComplete(race));
  const upcoming = raceItems.filter((race) => !isRaceComplete(race));
  const nextRace = upcoming[0];

  return (
    <Screen refreshing={query.isRefetching} onRefresh={() => query.refetch()}>
      <Section warm>
        <SectionHeader
          eyebrow={`${bundle.manifest.season} season`}
          title="Race schedule"
          subtitle="Session times come from UTC data and are shown locally on each race page."
        />
        <InlineList>
          <Pill tone="green">{completed.length} completed</Pill>
          <Pill tone="red">{upcoming.length} upcoming</Pill>
        </InlineList>
      </Section>

      {nextRace ? (
        <Section>
          <SectionHeader eyebrow="Next up" title={nextRace.name ?? "Next race"} subtitle={nextRace.location} />
          <RaceImage
            uri={resolveRaceImageUrl(bundle.manifest, nextRace) ?? resolveHeroCarUrl(bundle.manifest)}
            alt={nextRace.imageAlt}
            height={190}
          />
          <FlagPanel accentColor={nextRace.sprintWeekend ? brand.amber : brand.f1Red}>
            <View style={{ gap: 8 }}>
              <InlineList>
                <Pill tone={nextRace.sprintWeekend ? "amber" : "red"}>
                  {nextRace.sprintWeekend ? "Sprint weekend" : `Round ${nextRace.round}`}
                </Pill>
                {nextRace.isNew ? <Pill>New</Pill> : null}
              </InlineList>
              {getMainRaceDate(nextRace) ? (
                <AppText variant="subtitle">{formatDateTime(getMainRaceDate(nextRace)!)}</AppText>
              ) : null}
            </View>
          </FlagPanel>
        </Section>
      ) : null}

      <Section warm>
        <SectionHeader title="Upcoming" />
        <ListGroup>
          {upcoming.map((race) => {
            const raceDate = getMainRaceDate(race);
            return (
              <ListRow
                key={race.id}
                href={`/schedule/${race.id}`}
                accentColor={race.sprintWeekend ? brand.amber : brand.f1Red}
              >
                <View style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
                  <AppText variant="mono" style={{ color: race.sprintWeekend ? brand.amber : brand.f1Red, width: 38 }}>
                    R{race.round}
                  </AppText>
                  <View style={{ flex: 1, gap: 4 }}>
                    <AppText variant="subtitle">{race.name}</AppText>
                    <AppText muted>{race.location}</AppText>
                    {raceDate ? <AppText variant="caption">{formatDateTime(raceDate)}</AppText> : null}
                  </View>
                  {race.sprintWeekend ? <Pill tone="amber">Sprint</Pill> : null}
                </View>
              </ListRow>
            );
          })}
        </ListGroup>
      </Section>

      {calendarNotes.length ? (
        <Section>
          <SectionHeader title="Calendar notes" />
          <ListGroup>
            {calendarNotes.map((item) => (
              <ListRow key={item.id} compact>
                <Pill>{item.type ?? "Note"}</Pill>
                <AppText variant="subtitle">{item.label ?? "Calendar note"}</AppText>
                {item.detail ? <AppText muted>{item.detail}</AppText> : null}
              </ListRow>
            ))}
          </ListGroup>
        </Section>
      ) : null}

      <Section>
        <SectionHeader title="Completed" />
        <ListGroup>
          {completed.map((race) => (
            <ListRow key={race.id} href={`/schedule/${race.id}`} compact>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <AppText variant="mono" style={{ color: brand.f1Red, width: 36 }}>
                    R{race.round}
                  </AppText>
                  <View style={{ flex: 1 }}>
                    <AppText variant="subtitle">{race.name}</AppText>
                    <AppText muted>{race.location}</AppText>
                  </View>
                  {race.results?.[0] ? <Pill tone="green">{race.results[0]}</Pill> : <Pill>Done</Pill>}
                </View>
            </ListRow>
          ))}
        </ListGroup>
      </Section>
    </Screen>
  );
}
