import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Component, ServiceLog } from '../types';
import type { DefaultComponentTemplate } from '../constants/defaultComponents';
import { sqliteJSONStorage } from './sqliteStorage';

const MAX_PINNED_PER_MOTOR = 5;

const generateId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

interface ComponentStoreState {
  components: Component[];
  serviceLogs: ServiceLog[];
  seedDefaultComponents: (
    motorId: string,
    templates: DefaultComponentTemplate[],
    lastServiceKm: number,
    pinnedCount: number,
  ) => void;
  togglePin: (id: string) => boolean;
  toggleHidden: (id: string) => void;
  toggleMuteComponent: (id: string) => void;
  addCustomComponent: (input: {
    motorId: string;
    name: string;
    intervalKm: number;
    lastServiceKm: number;
  }) => void;
  removeComponent: (id: string) => void;
  updateComponentInterval: (id: string, intervalKm: number) => void;
  markServiced: (
    componentId: string,
    input: { serviceKm: number; notes?: string; brandUsed?: string; cost?: number },
  ) => void;
}

export const useComponentStore = create<ComponentStoreState>()(
  persist(
    (set, get) => ({
      components: [],
      serviceLogs: [],

      seedDefaultComponents: (motorId, templates, lastServiceKm, pinnedCount) => {
        const seeded: Component[] = templates.map((template, index) => ({
          id: `${generateId('component')}-${index}`,
          motorId,
          name: template.name,
          intervalKm: template.intervalKm,
          lastServiceKm,
          isPinned: index < pinnedCount,
          isHidden: false,
          isCustom: false,
          isMuted: false,
        }));
        set((state) => ({ components: [...state.components, ...seeded] }));
      },

      togglePin: (id) => {
        const component = get().components.find((c) => c.id === id);
        if (!component) return false;

        const pinnedCount = get().components.filter(
          (c) => c.motorId === component.motorId && c.isPinned,
        ).length;
        if (!component.isPinned && pinnedCount >= MAX_PINNED_PER_MOTOR) {
          return false;
        }

        set((state) => ({
          components: state.components.map((c) =>
            c.id === id ? { ...c, isPinned: !c.isPinned } : c,
          ),
        }));
        return true;
      },

      toggleHidden: (id) => {
        set((state) => ({
          components: state.components.map((c) =>
            c.id === id ? { ...c, isHidden: !c.isHidden, isPinned: c.isHidden ? c.isPinned : false } : c,
          ),
        }));
      },

      toggleMuteComponent: (id) => {
        set((state) => ({
          components: state.components.map((c) =>
            c.id === id ? { ...c, isMuted: !c.isMuted } : c,
          ),
        }));
      },

      addCustomComponent: ({ motorId, name, intervalKm, lastServiceKm }) => {
        const newComponent: Component = {
          id: generateId('custom'),
          motorId,
          name,
          intervalKm,
          lastServiceKm,
          isPinned: false,
          isHidden: false,
          isCustom: true,
          isMuted: false,
        };
        set((state) => ({ components: [newComponent, ...state.components] }));
      },

      removeComponent: (id) => {
        set((state) => ({
          components: state.components.filter((c) => c.id !== id),
          serviceLogs: state.serviceLogs.filter((l) => l.componentId !== id),
        }));
      },

      updateComponentInterval: (id, intervalKm) => {
        set((state) => ({
          components: state.components.map((c) =>
            c.id === id ? { ...c, intervalKm } : c,
          ),
        }));
      },

      markServiced: (componentId, { serviceKm, notes, brandUsed, cost }) => {
        const component = get().components.find((c) => c.id === componentId);
        if (!component) return;

        const serviceDate = new Date().toISOString();
        const log: ServiceLog = {
          id: generateId('log'),
          componentId,
          motorId: component.motorId,
          serviceKm,
          serviceDate,
          notes,
          brandUsed,
          cost,
        };

        set((state) => ({
          serviceLogs: [log, ...state.serviceLogs],
          components: state.components.map((c) =>
            c.id === componentId ? { ...c, lastServiceKm: serviceKm, lastServiceDate: serviceDate } : c,
          ),
        }));
      },
    }),
    {
      name: 'motor-track/components',
      storage: sqliteJSONStorage,
      version: 1,
    },
  ),
);
