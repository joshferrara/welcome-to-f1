import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

import {
  ActionButton,
  ArticleBody,
  AppText,
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
import { extractGuideTopicBlocks } from "@/content/guide-extract";
import { useContent } from "@/content/queries";
import { ContentBlock } from "@/content/types";
import { useFavorites } from "@/hooks/use-favorites";

function plainMarkdown(value: string) {
  return value
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/`(.*?)`/g, "$1");
}

function BlockRenderer({ block }: { block: ContentBlock }) {
  if (block.type === "paragraph") {
    return (
      <View style={{ paddingLeft: 14, borderLeftWidth: 2, borderLeftColor: "#E10600" }}>
        <AppText muted style={{ fontSize: 17, lineHeight: 30 }}>
          {plainMarkdown(block.markdown)}
        </AppText>
      </View>
    );
  }

  if (block.type === "callout") {
    return (
      <FlagPanel>
        {block.title ? <AppText variant="subtitle">{block.title}</AppText> : null}
        <AppText muted>{plainMarkdown(block.markdown)}</AppText>
      </FlagPanel>
    );
  }

  if (block.type === "list") {
    return (
      <FlagPanel>
        {block.title ? <AppText variant="subtitle">{block.title}</AppText> : null}
        <View style={{ gap: 10 }}>
          {block.items.map((item) => (
            <AppText key={item} muted>
              - {item}
            </AppText>
          ))}
        </View>
      </FlagPanel>
    );
  }

  return (
    <ListGroup>
        {block.items.map((item) => (
          <ListRow key={`${item.label}-${item.value}`} compact>
            <AppText variant="mono">{item.value}</AppText>
            <AppText muted>{item.label}</AppText>
            {item.detail ? <AppText variant="caption" muted>{item.detail}</AppText> : null}
          </ListRow>
        ))}
    </ListGroup>
  );
}

export default function TopicScreen() {
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const query = useContent();
  const { isFavorite, toggleFavorite } = useFavorites();

  if (query.isLoading && !query.data) return <LoadingState />;
  if (query.error && !query.data) {
    return <ErrorState message={query.error.message} onRetry={() => query.refetch()} />;
  }
  const bundle = query.data;
  if (!bundle) return null;

  const section = bundle.guide.sections.find((item) => item.id === topicId);
  const isFaq = topicId === "faq";

  if (!section && !isFaq) {
    return (
      <Screen>
        <Section>
          <FlagPanel>
          <AppText variant="title">Topic not found</AppText>
          <ActionButton label="Back to Learn" href="/learn" />
          </FlagPanel>
        </Section>
      </Screen>
    );
  }

  const title = isFaq ? "Frequently asked questions" : section?.title ?? "Topic";
  const related = section?.relatedTopicIds
    ?.map((id) => bundle.guide.sections.find((item) => item.id === id))
    .filter(Boolean);
  const extractedBlocks = section?.blocks?.length ? [] : extractGuideTopicBlocks(bundle.guide, String(topicId));

  return (
    <Screen>
      <Stack.Screen options={{ title }} />
      <Section warm>
        <FlagPanel>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
            <View style={{ flex: 1, gap: 8 }}>
              {section?.number ? <AppText variant="eyebrow">{section.number}</AppText> : <Pill tone="red">FAQ</Pill>}
              <AppText variant="title">{title}</AppText>
              {section?.subtitle ? <AppText muted>{section.subtitle}</AppText> : null}
            </View>
            <FavoriteButton
              active={isFavorite("topics", String(topicId))}
              onPress={() => toggleFavorite("topics", String(topicId))}
            />
          </View>
        </FlagPanel>
      </Section>

      {section?.blocks?.length ? (
        <Section>
          <View style={{ gap: 22 }}>
            {section.blocks.map((block, index) => <BlockRenderer key={`${block.type}-${index}`} block={block} />)}
          </View>
        </Section>
      ) : extractedBlocks.length ? (
        <Section>
          <ArticleBody paragraphs={extractedBlocks} />
        </Section>
      ) : !isFaq ? (
        <Section>
          <FlagPanel muted>
            <AppText muted>This topic is available in the shared guide, but no readable mobile block was found.</AppText>
          </FlagPanel>
        </Section>
      ) : null}

      {isFaq || section?.id === "faq" ? (
        <Section>
          <SectionHeader title="FAQ" />
          <ListGroup>
            {bundle.guide.faq.map((item) => (
              <ListRow key={item.question}>
                <AppText variant="subtitle">{item.question}</AppText>
                <AppText muted>{item.answer}</AppText>
              </ListRow>
            ))}
          </ListGroup>
        </Section>
      ) : null}

      {related?.length ? (
        <Section>
          <SectionHeader title="Related topics" />
          <InlineList>
            {related.map((item) =>
              item ? <ActionButton key={item.id} label={item.title ?? item.id} href={`/learn/${item.id}`} /> : null
            )}
          </InlineList>
        </Section>
      ) : null}
    </Screen>
  );
}
