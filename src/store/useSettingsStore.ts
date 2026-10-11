import { create } from 'zustand';

// PRD 5.8: ambang notifikasi, default 200km, bisa diubah ke 100/300/500.
export const NOTIFICATION_THRESHOLD_OPTIONS = [100, 200, 300, 500] as const;
export const DEFAULT_NOTIFICATION_THRESHOLD_KM = 200;

interface SettingsStoreState {
  notificationThresholdKm: number;
  mutedMotorIds: string[];
  setNotificationThreshold: (km: number) => void;
  toggleMuteMotor: (motorId: string) => void;
  isMotorMuted: (motorId: string) => boolean;
}

export const useSettingsStore = create<SettingsStoreState>((set, get) => ({
  notificationThresholdKm: DEFAULT_NOTIFICATION_THRESHOLD_KM,
  mutedMotorIds: [],

  setNotificationThreshold: (km) => set({ notificationThresholdKm: km }),

  toggleMuteMotor: (motorId) => {
    set((state) => ({
      mutedMotorIds: state.mutedMotorIds.includes(motorId)
        ? state.mutedMotorIds.filter((id) => id !== motorId)
        : [...state.mutedMotorIds, motorId],
    }));
  },

  isMotorMuted: (motorId) => get().mutedMotorIds.includes(motorId),
}));
