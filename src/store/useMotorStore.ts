import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { KmLog, Motor } from '../types';
import { getDefaultComponentTemplates, DEFAULT_PINNED_COUNT } from '../constants/defaultComponents';
import { useComponentStore } from './useComponentStore';
import { sqliteJSONStorage } from './sqliteStorage';
import { generateUuid } from '../utils/uuid';

interface MotorStoreState {
  motors: Motor[];
  activeMotorId: string | null;
  kmLogs: KmLog[];
  addMotor: (input: {
    name: string;
    fuelType: Motor['fuelType'];
    transmission: Motor['transmission'];
    currentKm: number;
    photoUri?: string;
  }) => string;
  setActiveMotor: (motorId: string) => void;
  updateMotorKm: (motorId: string, km: number) => void;
}

export const useMotorStore = create<MotorStoreState>()(
  persist(
    (set, get) => ({
      motors: [],
      activeMotorId: null,
      kmLogs: [],

      addMotor: ({ name, fuelType, transmission, currentKm, photoUri }) => {
        const id = generateUuid();
        const motor: Motor = {
          id,
          name,
          fuelType,
          transmission: fuelType === 'listrik' ? null : transmission,
          currentKm,
          photoUri,
        };
        const kmLog: KmLog = {
          id: generateUuid(),
          motorId: id,
          kmValue: currentKm,
          loggedAt: new Date().toISOString(),
        };

        set((state) => ({
          motors: [...state.motors, motor],
          activeMotorId: id,
          kmLogs: [kmLog, ...state.kmLogs],
        }));

        const templates = getDefaultComponentTemplates(fuelType, transmission);
        useComponentStore
          .getState()
          .seedDefaultComponents(id, templates, currentKm, DEFAULT_PINNED_COUNT);

        return id;
      },

      setActiveMotor: (motorId) => {
        if (!get().motors.some((m) => m.id === motorId)) return;
        set({ activeMotorId: motorId });
      },

      updateMotorKm: (motorId, km) => {
        const kmLog: KmLog = {
          id: generateUuid(),
          motorId,
          kmValue: km,
          loggedAt: new Date().toISOString(),
        };
        set((state) => ({
          motors: state.motors.map((m) =>
            m.id === motorId ? { ...m, currentKm: km } : m,
          ),
          kmLogs: [kmLog, ...state.kmLogs],
        }));
      },
    }),
    {
      name: 'motor-track/motors',
      storage: sqliteJSONStorage,
      version: 1,
    },
  ),
);
