import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { Component, Motor } from "../types";

const DAILY_REMINDER_ID = "daily-km-reminder";
const ANDROID_CHANNEL_ID = "default";

export const DAILY_KM_REMINDER_DATA_TYPE = "daily-km-reminder";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const ensureAndroidChannel = async () => {
    if (Platform.OS !== "android") return;
    await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
        name: "MotorTrack",
        importance: Notifications.AndroidImportance.DEFAULT,
    });
};

export const requestNotificationPermission = async (): Promise<boolean> => {
    const existing = await Notifications.getPermissionsAsync();
    if (existing.status === "granted") return true;

    const requested = await Notifications.requestPermissionsAsync();
    return requested.status === "granted";
};

// PRD §4: daily km-update reminder, default 17:00.
export const scheduleDailyKmReminder = async (enabled: boolean) => {
    await Notifications.cancelScheduledNotificationAsync(
        DAILY_REMINDER_ID,
    ).catch(() => {});

    if (!enabled) return;

    await ensureAndroidChannel();
    await Notifications.scheduleNotificationAsync({
        identifier: DAILY_REMINDER_ID,
        content: {
            title: "Update kilometer motor kamu",
            body: "Jangan lupa catat km motor hari ini biar jadwal servis tetap akurat.",
            data: { type: DAILY_KM_REMINDER_DATA_TYPE },
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 17,
            minute: 0,
            channelId: ANDROID_CHANNEL_ID,
        },
    });
};

// PRD 5.8: warning/overdue component alerts, fired immediately (best-effort,
// checked on km update and app foreground — see useNotificationEngine).
export const notifyComponentAlert = async (params: {
    component: Component;
    motor: Motor;
    statusLevel: "warning" | "overdue";
    remainingKm: number;
}) => {
    const { component, motor, statusLevel, remainingKm } = params;
    await ensureAndroidChannel();

    const title =
        statusLevel === "overdue" ? "🔴 Servis Terlewat" : "⚠️ Mendekati Servis";
    const body =
        statusLevel === "overdue"
            ? `${component.name} motor ${motor.name} sudah melewati batas servis! Segera cek motor kamu.`
            : `${component.name} motor ${motor.name} hampir waktunya diganti. Sisa ~${Math.max(
                  0,
                  Math.round(remainingKm),
              ).toLocaleString("id-ID")} km lagi.`;

    await Notifications.scheduleNotificationAsync({
        identifier: `component-alert-${component.id}`,
        content: { title, body },
        trigger: null,
    });
};
