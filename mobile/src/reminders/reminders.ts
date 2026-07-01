import * as Notifications from "expo-notifications";

import { Race, RaceSession } from "@/content/types";
import { formatDateTime } from "@/content/race-utils";
import { useStoredValue } from "@/utils/storage";

export type ReminderState = Record<string, string>;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useReminders() {
  const [reminders, setReminders] = useStoredValue<ReminderState>("reminders.v1", {});

  async function ensurePermissions() {
    const existing = await Notifications.getPermissionsAsync();
    if (existing.granted) return true;
    const requested = await Notifications.requestPermissionsAsync();
    return requested.granted;
  }

  async function toggleSessionReminder(race: Race, session: RaceSession) {
    const key = `${race.id}:${session.key}`;
    const existingId = reminders[key];
    if (existingId) {
      await Notifications.cancelScheduledNotificationAsync(existingId);
      const next = { ...reminders };
      delete next[key];
      setReminders(next);
      return "removed" as const;
    }

    const hasPermission = await ensurePermissions();
    if (!hasPermission) return "denied" as const;

    const triggerDate = new Date(session.startsAt.getTime() - 60 * 60 * 1000);
    if (triggerDate.getTime() <= Date.now()) return "past" as const;

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `${race.name}: ${session.label}`,
        body: `Starts ${formatDateTime(session.startsAt)}.`,
        data: { raceId: race.id, session: session.key },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
    });

    setReminders({ ...reminders, [key]: notificationId });
    return "scheduled" as const;
  }

  return { reminders, toggleSessionReminder };
}
