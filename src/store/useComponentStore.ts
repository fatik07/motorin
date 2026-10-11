import { create } from 'zustand';
import type { Component, ServiceLog } from '../types';

const ACTIVE_MOTOR_ID = 'motor-1';
const MAX_PINNED = 5;

const initialComponents: Component[] = [
  {
    id: 'oil',
    motorId: ACTIVE_MOTOR_ID,
    name: 'Oli Mesin',
    intervalKm: 2000,
    lastServiceKm: 10000,
    lastServiceDate: '2026-08-01',
    isPinned: true,
    isHidden: false,
    isCustom: false,
  },
  {
    id: 'air-filter',
    motorId: ACTIVE_MOTOR_ID,
    name: 'Filter Udara',
    intervalKm: 8000,
    lastServiceKm: 4600,
    isPinned: true,
    isHidden: false,
    isCustom: false,
  },
  {
    id: 'front-tire',
    motorId: ACTIVE_MOTOR_ID,
    name: 'Ban Depan',
    intervalKm: 20000,
    lastServiceKm: 4250,
    isPinned: true,
    isHidden: false,
    isCustom: false,
  },
  {
    id: 'rear-tire',
    motorId: ACTIVE_MOTOR_ID,
    name: 'Ban Belakang',
    intervalKm: 15000,
    lastServiceKm: 4250,
    isPinned: true,
    isHidden: false,
    isCustom: false,
  },
  {
    id: 'brake',
    motorId: ACTIVE_MOTOR_ID,
    name: 'Rem',
    intervalKm: 15000,
    lastServiceKm: 3000,
    isPinned: true,
    isHidden: false,
    isCustom: false,
  },
  {
    id: 'battery',
    motorId: ACTIVE_MOTOR_ID,
    name: 'Aki',
    intervalKm: 24000,
    lastServiceKm: 0,
    isPinned: false,
    isHidden: false,
    isCustom: false,
  },
  {
    id: 'final-gear-oil',
    motorId: ACTIVE_MOTOR_ID,
    name: 'Oli Gardan',
    intervalKm: 10000,
    lastServiceKm: 2000,
    isPinned: false,
    isHidden: true,
    isCustom: false,
  },
];

const initialServiceLogs: ServiceLog[] = [
  {
    id: 'log-oil-1',
    componentId: 'oil',
    motorId: ACTIVE_MOTOR_ID,
    serviceKm: 10000,
    serviceDate: '2026-08-01',
    notes: 'Ganti oli rutin',
    brandUsed: 'Shell Advance',
    cost: 65000,
  },
];

const generateId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000)}`;

interface ComponentStoreState {
  currentKm: number;
  components: Component[];
  serviceLogs: ServiceLog[];
  setCurrentKm: (km: number) => void;
  togglePin: (id: string) => boolean;
  toggleHidden: (id: string) => void;
  addCustomComponent: (input: { name: string; intervalKm: number }) => void;
  removeComponent: (id: string) => void;
  updateComponentInterval: (id: string, intervalKm: number) => void;
  markServiced: (
    componentId: string,
    input: { serviceKm: number; notes?: string; brandUsed?: string; cost?: number },
  ) => void;
}

export const useComponentStore = create<ComponentStoreState>((set, get) => ({
  currentKm: 12450,
  components: initialComponents,
  serviceLogs: initialServiceLogs,

  setCurrentKm: (km) => set({ currentKm: km }),

  togglePin: (id) => {
    const component = get().components.find((c) => c.id === id);
    if (!component) return false;

    const pinnedCount = get().components.filter((c) => c.isPinned).length;
    if (!component.isPinned && pinnedCount >= MAX_PINNED) {
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

  addCustomComponent: ({ name, intervalKm }) => {
    const newComponent: Component = {
      id: generateId('custom'),
      motorId: ACTIVE_MOTOR_ID,
      name,
      intervalKm,
      lastServiceKm: get().currentKm,
      isPinned: false,
      isHidden: false,
      isCustom: true,
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
    const serviceDate = new Date().toISOString();
    const log: ServiceLog = {
      id: generateId('log'),
      componentId,
      motorId: ACTIVE_MOTOR_ID,
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
}));
