import { Guide } from "./types";

const entityMap: Record<string, string> = {
  amp: "&",
  nbsp: " ",
  quot: '"',
  apos: "'",
  rsquo: "'",
  lsquo: "'",
  rdquo: '"',
  ldquo: '"',
  mdash: "-",
  ndash: "-",
};

function decodeEntities(value: string) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&([a-zA-Z]+);/g, (_, entity) => entityMap[entity] ?? "");
}

function htmlToBlocks(html: string) {
  const text = decodeEntities(
    html
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<(h2|h3|h4|p|li|div)\b[^>]*>/gi, "")
      .replace(/<\/(h2|h3|h4|p|li|div)>/gi, "\n")
      .replace(/<\/?(span|a|strong|em)\b[^>]*>/gi, "")
      .replace(/<[^>]+>/g, "")
  );

  const seen = new Set<string>();
  return text
    .split(/\n+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 18)
    .filter((line) => {
      const key = line.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function extractGuideTopicBlocks(guide: Guide, topicId: string) {
  if (!guide.bodyMarkdown) return [];
  const startPattern = new RegExp(`<section[^>]+id=["']${topicId}["'][^>]*>`, "i");
  const match = guide.bodyMarkdown.match(startPattern);
  if (!match || match.index === undefined) return [];

  const start = match.index;
  const nextSectionMatch = guide.bodyMarkdown.slice(start + match[0].length).match(/\n<section\b/i);
  const end = nextSectionMatch
    ? start + match[0].length + (nextSectionMatch.index ?? 0)
    : guide.bodyMarkdown.indexOf("\n</main>", start);

  const sectionHtml = guide.bodyMarkdown.slice(start, end > start ? end : undefined);
  const section = guide.sections.find((item) => item.id === topicId);
  const skip = new Set(
    [section?.number, section?.title, section?.subtitle]
      .filter(Boolean)
      .map((value) => String(value).toLowerCase())
  );

  return htmlToBlocks(sectionHtml).filter((line) => !skip.has(line.toLowerCase()));
}
