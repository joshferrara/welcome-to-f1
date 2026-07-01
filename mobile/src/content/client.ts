import Constants from "expo-constants";

import { ContentBundle, Driver, Manifest, Race, Team } from "./types";
import { raceIdFor } from "./race-utils";

const configuredBase =
  process.env.EXPO_PUBLIC_CONTENT_BASE_URL ||
  (Constants.expoConfig?.extra?.contentBaseUrl as string | undefined) ||
  "https://welcometof1.com";

function absoluteUrl(baseUrl: string, pathOrUrl: string) {
  if (pathOrUrl.startsWith("http")) return pathOrUrl;
  return `${baseUrl.replace(/\/$/, "")}${pathOrUrl}`;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return (await response.json()) as T;
}

export function resolveAssetUrl(manifest: Manifest, assetPath?: string) {
  if (!assetPath) return undefined;
  return absoluteUrl(manifest.baseUrl, assetPath);
}

const fallbackRaceImageByCircuit: Record<string, string> = {
  spa: "/images/races/belgium.webp",
  silverstone: "/images/races/great-britain.webp",
  monaco: "/images/races/monaco.webp",
  monza: "/images/races/italy.webp",
  suzuka: "/images/races/japan.webp",
  vegas: "/images/races/las-vegas.jpg",
};

export function resolveRaceImageUrl(manifest: Manifest, race?: Pick<Race, "image" | "circuitId">) {
  return resolveAssetUrl(manifest, race?.image ?? (race?.circuitId ? fallbackRaceImageByCircuit[race.circuitId] : undefined));
}

export function resolveHeroCarUrl(manifest: Manifest) {
  return resolveAssetUrl(manifest, "/images/cars/2026-car-front.webp");
}

export async function fetchContentBundle(): Promise<ContentBundle> {
  const manifest = await fetchJson<Manifest>(`${configuredBase.replace(/\/$/, "")}/data/v1/manifest.json`);
  if (manifest.schemaVersion !== 1) {
    throw new Error(`Unsupported data schema v${manifest.schemaVersion}`);
  }

  const baseUrl = manifest.baseUrl || configuredBase;
  const [guide, driversData, teamsData, racesData, standings, champions] = await Promise.all([
    fetchJson<ContentBundle["guide"]>(absoluteUrl(baseUrl, manifest.resources.guide)),
    fetchJson<{ drivers: Driver[] }>(absoluteUrl(baseUrl, manifest.resources.drivers)),
    fetchJson<{ teams: Team[] }>(absoluteUrl(baseUrl, manifest.resources.teams)),
    fetchJson<{ races: Omit<Race, "id">[] }>(absoluteUrl(baseUrl, manifest.resources.races)),
    fetchJson<ContentBundle["standings"]>(absoluteUrl(baseUrl, manifest.resources.standings)),
    fetchJson<ContentBundle["champions"]>(absoluteUrl(baseUrl, manifest.resources.champions)),
  ]);

  const drivers = [...driversData.drivers].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const teams = [...teamsData.teams].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const races = racesData.races.map((race) => ({ ...race, id: raceIdFor(race) }));

  return {
    manifest,
    guide,
    drivers,
    teams,
    races,
    standings,
    champions,
    driversById: Object.fromEntries(drivers.map((driver) => [driver.id, driver])),
    driversByCode: Object.fromEntries(drivers.map((driver) => [driver.code, driver])),
    teamsById: Object.fromEntries(teams.map((team) => [team.id, team])),
    racesById: Object.fromEntries(races.map((race) => [race.id, race])),
  };
}
