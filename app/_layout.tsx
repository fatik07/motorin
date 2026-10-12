import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import * as Notifications from "expo-notifications";
import { useMotorStore } from "@store/useMotorStore";
import { useSettingsStore } from "@store/useSettingsStore";
import { useUiStore } from "@store/useUiStore";
import {
    requestNotificationPermission,
    scheduleDailyKmReminder,
    DAILY_KM_REMINDER_DATA_TYPE,
} from "@notifications/scheduler";
import { checkComponentAlerts } from "@notifications/checkComponentAlerts";
import { ensureAnonymousSession } from "../src/supabase/auth";
import { pushLocalChanges } from "../src/sync/pushLocalChanges";
import { wireAutoSync } from "../src/sync/wireAutoSync";

export default function RootLayout() {
    const hasMotors = useMotorStore((state) => state.motors.length > 0);
    const dailyKmReminderEnabled = useSettingsStore(
        (state) => state.dailyKmReminderEnabled,
    );
    const didInitialCheck = useRef(false);

    useEffect(() => {
        wireAutoSync();
        (async () => {
            await ensureAnonymousSession();
            await pushLocalChanges();
        })();
    }, []);

    useEffect(() => {
        if (!hasMotors) return;

        (async () => {
            const granted = await requestNotificationPermission();
            if (!granted) return;

            await scheduleDailyKmReminder(dailyKmReminderEnabled);

            if (!didInitialCheck.current) {
                didInitialCheck.current = true;
                await checkComponentAlerts();
            }
        })();
    }, [hasMotors, dailyKmReminderEnabled]);

    useEffect(() => {
        const subscription = AppState.addEventListener("change", (state) => {
            if (state === "active" && hasMotors) {
                checkComponentAlerts();
                pushLocalChanges();
            }
        });
        return () => subscription.remove();
    }, [hasMotors]);

    useEffect(() => {
        const handleResponse = (response: Notifications.NotificationResponse) => {
            const data = response.notification.request.content.data;
            if (data?.type === DAILY_KM_REMINDER_DATA_TYPE) {
                useUiStore.getState().requestOpenUpdateKm();
                router.push("/dashboard");
            }
        };

        Notifications.getLastNotificationResponseAsync().then((response) => {
            if (response) handleResponse(response);
        });

        const subscription =
            Notifications.addNotificationResponseReceivedListener(handleResponse);
        return () => subscription.remove();
    }, []);

    return (
        <>
            <StatusBar style="dark" backgroundColor="#f5f5f5" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "#f5f5f5" },
                }}
            />
        </>
    );
}
