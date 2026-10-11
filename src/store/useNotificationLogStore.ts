import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sqliteJSONStorage } from './sqliteStorage';

const todayKey = () => new Date().toISOString().slice(0, 10);

interface NotificationLogState {
  // componentId -> date string (YYYY-MM-DD) last notified
  lastNotifiedAt: Record<string, string>;
  canNotifyToday: (componentId: string) => boolean;
  markNotifiedToday: (componentId: string) => void;
}

// PRD 5.8: "Notifikasi dikirim 1x/hari" — tracks per-component dedup.
export const useNotificationLogStore = create<NotificationLogState>()(
  persist(
    (set, get) => ({
      lastNotifiedAt: {},

      canNotifyToday: (componentId) =>
        get().lastNotifiedAt[componentId] !== todayKey(),

      markNotifiedToday: (componentId) => {
        set((state) => ({
          lastNotifiedAt: { ...state.lastNotifiedAt, [componentId]: todayKey() },
        }));
      },
    }),
    {
      name: 'motor-track/notification-log',
      storage: sqliteJSONStorage,
      version: 1,
    },
  ),
);
