import { useComponentStore } from "../store/useComponentStore";
import { useMotorStore } from "../store/useMotorStore";
import { useSettingsStore } from "../store/useSettingsStore";
import { useNotificationLogStore } from "../store/useNotificationLogStore";
import { computeComponentStatus } from "../utils/componentStatus";
import { notifyComponentAlert } from "./scheduler";

// PRD 5.8: fires a local notification for each unmuted component that's
// warning/overdue, at most once per component per day. Called after km
// updates and on app foreground (best-effort — there's no background check
// while the app is closed, see session notes).
export const checkComponentAlerts = async () => {
    const { components } = useComponentStore.getState();
    const { motors } = useMotorStore.getState();
    const { notificationThresholdKm, mutedMotorIds } = useSettingsStore.getState();
    const { canNotifyToday, markNotifiedToday } = useNotificationLogStore.getState();

    for (const component of components) {
        if (component.isHidden || component.isMuted) continue;
        if (!canNotifyToday(component.id)) continue;

        const motor = motors.find((m) => m.id === component.motorId);
        if (!motor || mutedMotorIds.includes(motor.id)) continue;

        const { statusLevel, remainingKm } = computeComponentStatus(
            component,
            motor.currentKm,
            notificationThresholdKm,
        );
        if (statusLevel === "safe") continue;

        await notifyComponentAlert({ component, motor, statusLevel, remainingKm });
        markNotifiedToday(component.id);
    }
};
