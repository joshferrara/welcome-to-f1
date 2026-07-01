export type Manifest = {
  schemaVersion: number;
  season: number;
  generatedAt: string;
  baseUrl: string;
  resources: {
    guide: string;
    drivers: string;
    teams: string;
    races: string;
    standings: string;
    champions: string;
  };
};

export type GuideSection = {
  id: string;
  className?: string;
  number?: string;
  title?: string;
  subtitle?: string;
  kicker?: string;
  summary?: string;
  blocks?: ContentBlock[];
  relatedTopicIds?: string[];
};

export type ContentBlock =
  | { type: "paragraph"; markdown: string }
  | { type: "callout"; title?: string; markdown: string; tone?: string }
  | { type: "list"; title?: string; items: string[] }
  | { type: "statGrid"; items: { label: string; value: string; detail?: string }[] };

export type Guide = {
  schemaVersion: number;
  season: number;
  contentFormat?: string;
  site?: { title?: string; description?: string };
  navigation: { label: string; href?: string; id?: string }[];
  hero: { badge?: string; titleHtml?: string; subtitleHtml?: string; scrollText?: string };
  sections: GuideSection[];
  faq: { question: string; answer: string }[];
  bodyMarkdown?: string;
  structuredData?: unknown;
};

export type Driver = {
  id: string;
  code: string;
  name: string;
  number: string;
  teamId: string;
  displayTeam: string;
  countryCode?: string;
  flag?: string;
  image?: string;
  imageAlt?: string;
  tag?: string;
  links?: EntityLinks;
  order?: number;
};

export type Team = {
  id: string;
  name: string;
  color: string;
  engine?: string;
  driverIds: string[];
  driverNames?: string[];
  badge?: string;
  links?: EntityLinks;
  order?: number;
};

export type EntityLinks = {
  wikipedia?: string;
  social?: { platform: string; label: string; url: string }[];
};

export type Race = {
  id: string;
  round?: number;
  name?: string;
  location?: string;
  circuitId?: string;
  image?: string;
  imageAlt?: string;
  fp1?: string;
  fp2?: string;
  fp3?: string;
  sprintQualifying?: string;
  sprint?: string;
  qualifying?: string;
  race?: string;
  sprintWeekend?: boolean;
  cancelled?: boolean;
  isNew?: boolean;
  label?: string;
  detail?: string;
  type?: string;
  raceNote?: { session?: string; offsetMinutes?: number; text?: string; title?: string };
  results?: string[];
};

export type Standings = {
  schemaVersion: number;
  season: number;
  lastUpdated: string;
  drivers: DriverStanding[];
  constructors: ConstructorStanding[];
};

export type DriverStanding = {
  pos: number;
  code: string;
  name: string;
  team: string;
  points: number;
  wins: number;
};

export type ConstructorStanding = {
  pos: number;
  name: string;
  points: number;
  wins?: number;
};

export type Champion = {
  year: number;
  driver: string;
  nationality: string;
  team: string;
  constructor?: string | null;
};

export type Champions = {
  schemaVersion: number;
  season: number;
  decades: string[];
  champions: Champion[];
  flagMap?: Record<string, string>;
  teamColors?: Record<string, string>;
  constructorDrivers?: Record<string, string[]>;
};

export type ContentBundle = {
  manifest: Manifest;
  guide: Guide;
  drivers: Driver[];
  teams: Team[];
  races: Race[];
  standings: Standings;
  champions: Champions;
  driversById: Record<string, Driver>;
  driversByCode: Record<string, Driver>;
  teamsById: Record<string, Team>;
  racesById: Record<string, Race>;
};

export type SessionKind =
  | "fp1"
  | "fp2"
  | "fp3"
  | "sprintQualifying"
  | "sprint"
  | "qualifying"
  | "race";

export type RaceSession = {
  key: SessionKind;
  label: string;
  startsAt: Date;
  iso: string;
};
