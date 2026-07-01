import { View } from "react-native";

import {
  AppText,
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
import { useContent } from "@/content/queries";

export default function LearnScreen() {
  const query = useContent();

  if (query.isLoading && !query.data) return <LoadingState />;
  if (query.error && !query.data) {
    return <ErrorState message={query.error.message} onRetry={() => query.refetch()} />;
  }
  const bundle = query.data;
  if (!bundle) return null;

  const sections = bundle.guide.sections.filter((section) => section.id !== "top");

  return (
    <Screen refreshing={query.isRefetching} onRefresh={() => query.refetch()}>
      <Section warm>
        <SectionHeader
          eyebrow="Guide"
          title="Learn Formula 1"
          subtitle="The same guide content as the website, reorganized into native topic screens."
        />
        <FlagPanel>
          <AppText style={{ fontSize: 18, lineHeight: 29, fontWeight: "600" }}>
            Start with the fundamentals, then move through race weekends, strategy, flags, tyres, teams, and the
            championship picture.
          </AppText>
        </FlagPanel>
      </Section>

      <Section>
        <ListGroup>
          {sections.map((section) => (
            <ListRow key={section.id} href={`/learn/${section.id}`} accentColor={section.id === "faq" ? undefined : "#E10600"}>
              <View style={{ flexDirection: "row", gap: 14, alignItems: "flex-start" }}>
                <Pill tone={section.id === "faq" ? "amber" : "red"}>{section.number ?? "FAQ"}</Pill>
                <View style={{ flex: 1, gap: 5 }}>
                  <AppText variant="subtitle">{section.title ?? section.id}</AppText>
                  {section.subtitle ? <AppText muted>{section.subtitle}</AppText> : null}
                </View>
              </View>
            </ListRow>
          ))}
        </ListGroup>
      </Section>
    </Screen>
  );
}
