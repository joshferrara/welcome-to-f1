import { getMainRaceDate, getNextRace, formatDateTime } from "@/content/race-utils";
import { ContentBundle } from "@/content/types";

async function loadWidgets() {
  try {
    return await import("./next-race-widget");
  } catch {
    return null;
  }
}

export async function syncNextRaceWidget(bundle: ContentBundle) {
  const nextRace = getNextRace(bundle.races);
  if (!nextRace) return;
  const raceDate = getMainRaceDate(nextRace);
  const widgets = await loadWidgets();
  widgets?.nextRaceWidget.updateSnapshot({
    raceName: nextRace.name ?? "Next race",
    location: nextRace.location ?? "",
    startsAt: raceDate ? formatDateTime(raceDate) : "Time pending",
    status: nextRace.sprintWeekend ? "Sprint weekend" : "Next race",
  });
}

export async function startRaceWeekActivity(bundle: ContentBundle, raceId: string) {
  const race = bundle.racesById[raceId];
  if (!race?.name) return null;
  const raceDate = getMainRaceDate(race);
  const widgets = await loadWidgets();
  if (!widgets) return null;
  return widgets.raceWeekActivity.start(
    {
      raceName: race.name,
      location: race.location ?? "",
      startsAt: raceDate ? formatDateTime(raceDate) : "Time pending",
      status: race.sprintWeekend ? "Sprint weekend" : "Race week",
    },
    `welcometof1://schedule/${race.id}`
  );
}
