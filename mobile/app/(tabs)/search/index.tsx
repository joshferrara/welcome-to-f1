import React from "react";
import { TextInput, View } from "react-native";

import {
  ActionButton,
  AppText,
  ErrorState,
  FlagPanel,
  GlassSurface,
  InlineList,
  ListGroup,
  ListRow,
  LoadingState,
  Pill,
  Screen,
  Section,
  SectionHeader,
} from "@/components/ui";
import { useContent } from "@/content/queries";
import { buildSearchIndex, searchContent, SearchResult } from "@/content/search";
import { useAppTheme } from "@/theme/theme-context";
import { useStoredValue } from "@/utils/storage";

function ResultCard({ result, onOpen }: { result: SearchResult; onOpen: () => void }) {
  return (
    <ListRow href={result.href} onPress={onOpen}>
      <Pill tone={result.type === "Race" ? "red" : result.type === "Champion" ? "amber" : "neutral"}>
        {result.type}
      </Pill>
      <AppText variant="subtitle">{result.title}</AppText>
      {result.subtitle ? <AppText muted numberOfLines={2}>{result.subtitle}</AppText> : null}
    </ListRow>
  );
}

export default function SearchScreen() {
  const query = useContent();
  const { colors, brand } = useAppTheme();
  const [search, setSearch] = React.useState("");
  const [recentSearches, setRecentSearches] = useStoredValue<string[]>("recent-searches.v1", []);
  const bundle = query.data;
  const index = React.useMemo(() => (bundle ? buildSearchIndex(bundle) : []), [bundle]);
  const results = React.useMemo(() => searchContent(index, search).slice(0, 50), [index, search]);

  if (query.isLoading && !query.data) return <LoadingState />;
  if (query.error && !query.data) {
    return <ErrorState message={query.error.message} onRetry={() => query.refetch()} />;
  }
  if (!bundle) return null;

  const saveRecent = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setRecentSearches([trimmed, ...recentSearches.filter((item) => item !== trimmed)].slice(0, 6));
  };

  return (
    <Screen>
      <Section warm>
        <SectionHeader title="Search" subtitle="Drivers, teams, races, rules, champions, and guide topics." />
        <GlassSurface style={{ padding: 14 }}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={() => saveRecent(search)}
            placeholder="Search drivers, teams, races, rules..."
            placeholderTextColor={colors.tertiaryText}
            autoCapitalize="none"
            returnKeyType="search"
            style={{
              minHeight: 48,
              color: colors.text,
              fontSize: 17,
              paddingHorizontal: 12,
              borderRadius: 14,
              backgroundColor: colors.card,
            }}
          />
        </GlassSurface>
      </Section>

      {recentSearches.length ? (
        <Section>
          <SectionHeader title="Recent searches" />
          <InlineList>
            {recentSearches.map((item) => (
              <ActionButton key={item} label={item} onPress={() => setSearch(item)} />
            ))}
          </InlineList>
        </Section>
      ) : null}

      <Section>
        <SectionHeader
          title={search.trim() ? `${results.length} results` : "Browse everything"}
          subtitle="Search uses the cached JSON bundle, so it works after content has been loaded once."
        />
        {results.length ? (
          <ListGroup>
            {results.map((result) => (
              <ResultCard key={result.id} result={result} onOpen={() => saveRecent(search || result.title)} />
            ))}
          </ListGroup>
        ) : (
          <FlagPanel>
            <AppText variant="subtitle">No results</AppText>
            <AppText muted>Try a driver code, race name, team, topic, or rule.</AppText>
            <AppText variant="mono" style={{ color: brand.f1Red }}>
              Example: tyres, NOR, Ferrari, Monaco
            </AppText>
          </FlagPanel>
        )}
      </Section>
    </Screen>
  );
}
