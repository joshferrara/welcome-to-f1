import { ContentBundle } from "./types";

export type SearchResult = {
  id: string;
  type: "Guide" | "FAQ" | "Driver" | "Team" | "Race" | "Champion";
  title: string;
  subtitle?: string;
  href: string;
  searchText: string;
};

export function buildSearchIndex(bundle: ContentBundle): SearchResult[] {
  const topics = bundle.guide.sections
    .filter((section) => section.id !== "top")
    .map((section) => ({
      id: `topic-${section.id}`,
      type: "Guide" as const,
      title: section.title ?? section.id,
      subtitle: section.subtitle ?? section.number,
      href: `/learn/${section.id}`,
      searchText: [section.title, section.subtitle, section.number, section.id].join(" "),
    }));

  const faq = bundle.guide.faq.map((item, index) => ({
    id: `faq-${index}`,
    type: "FAQ" as const,
    title: item.question,
    subtitle: item.answer,
    href: `/learn/faq`,
    searchText: `${item.question} ${item.answer}`,
  }));

  const drivers = bundle.drivers.map((driver) => ({
    id: `driver-${driver.id}`,
    type: "Driver" as const,
    title: driver.name,
    subtitle: `${driver.code} - ${driver.displayTeam}`,
    href: `/grid/drivers/${driver.id}`,
    searchText: [driver.name, driver.code, driver.number, driver.displayTeam, driver.countryCode, driver.tag].join(" "),
  }));

  const teams = bundle.teams.map((team) => ({
    id: `team-${team.id}`,
    type: "Team" as const,
    title: team.name,
    subtitle: team.engine,
    href: `/grid/teams/${team.id}`,
    searchText: [team.name, team.engine, team.badge, team.driverNames?.join(" ")].join(" "),
  }));

  const races = bundle.races.filter((race) => race.name).map((race) => ({
    id: `race-${race.id}`,
    type: "Race" as const,
    title: race.name ?? "Calendar item",
    subtitle: race.location,
    href: `/schedule/${race.id}`,
    searchText: [race.name, race.location, race.circuitId, race.label, race.detail].join(" "),
  }));

  const champions = bundle.champions.champions.map((champion) => ({
    id: `champion-${champion.year}-${champion.driver}`,
    type: "Champion" as const,
    title: `${champion.year} - ${champion.driver}`,
    subtitle: champion.team,
    href: `/grid?view=champions`,
    searchText: [champion.year, champion.driver, champion.team, champion.constructor, champion.nationality].join(" "),
  }));

  return [...topics, ...faq, ...drivers, ...teams, ...races, ...champions];
}

export function searchContent(index: SearchResult[], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return index.slice(0, 20);
  return index
    .filter((item) => item.searchText.toLowerCase().includes(normalized))
    .sort((a, b) => {
      const aTitle = a.title.toLowerCase().startsWith(normalized) ? 0 : 1;
      const bTitle = b.title.toLowerCase().startsWith(normalized) ? 0 : 1;
      return aTitle - bTitle || a.title.localeCompare(b.title);
    });
}
