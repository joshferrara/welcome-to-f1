import { Race, RaceSession, SessionKind } from "./types";

const sessionOrder: { key: SessionKind; label: string }[] = [
  { key: "fp1", label: "Practice 1" },
  { key: "fp2", label: "Practice 2" },
  { key: "fp3", label: "Practice 3" },
  { key: "sprintQualifying", label: "Sprint Qualifying" },
  { key: "sprint", label: "Sprint" },
  { key: "qualifying", label: "Qualifying" },
  { key: "race", label: "Grand Prix" },
];

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function raceIdFor(race: Pick<Race, "round" | "name" | "label" | "type" | "detail">) {
  const base = race.name ?? race.label ?? race.detail ?? race.type ?? "calendar-item";
  return race.round ? `${race.round}-${slugify(base)}` : `${race.type ?? "item"}-${slugify(base)}`;
}

export function isGrandPrix(race: Race) {
  return Boolean(race.name && race.race);
}

export function getRaceSessions(race: Race): RaceSession[] {
  return sessionOrder.flatMap(({ key, label }) => {
    const iso = race[key];
    if (!iso) return [];
    return [{ key, label, iso, startsAt: new Date(iso) }];
  });
}

export function getMainRaceDate(race: Race) {
  return race.race ? new Date(race.race) : getRaceSessions(race).at(-1)?.startsAt ?? null;
}

export function getNextRace(races: Race[], now = new Date()) {
  return races.find((race) => {
    if (!isGrandPrix(race)) return false;
    const date = getMainRaceDate(race);
    return date ? date.getTime() >= now.getTime() && !race.cancelled : false;
  });
}

export function getCurrentRaceWeek(races: Race[], now = new Date()) {
  return races.find((race) => {
    const sessions = getRaceSessions(race);
    if (!sessions.length) return false;
    const start = sessions[0].startsAt.getTime() - 2 * 24 * 60 * 60 * 1000;
    const end = sessions[sessions.length - 1].startsAt.getTime() + 24 * 60 * 60 * 1000;
    return now.getTime() >= start && now.getTime() <= end;
  });
}

export function isRaceComplete(race: Race, now = new Date()) {
  const date = getMainRaceDate(race);
  return Boolean(race.results?.length) || Boolean(date && date.getTime() < now.getTime());
}

export function formatLocalDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatLocalTime(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatDateTime(date: Date) {
  return `${formatLocalDate(date)} at ${formatLocalTime(date)}`;
}

export function daysUntil(date: Date, now = new Date()) {
  return Math.max(0, Math.ceil((date.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));
}

export function stripHtml(value?: string) {
  return (value ?? "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
