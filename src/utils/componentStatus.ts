import { COLORS } from '@constants/theme';
import type { Component, ComponentStatusLevel, ComponentWithStatus } from '../types';

// PRD 5.8: default warning threshold is 200km, user-adjustable to 100/300/500.
export const DEFAULT_WARNING_THRESHOLD_KM = 200;

/**
 * Derives remaining km, usage progress, and status level from a component's
 * interval/last-service km against the motor's current km.
 * PRD 5.2 rule: remaining > threshold = safe, 0 < remaining <= threshold = warning, remaining <= 0 = overdue.
 */
export const computeComponentStatus = (
  component: Pick<Component, 'intervalKm' | 'lastServiceKm'>,
  currentKm: number,
  warningThresholdKm: number = DEFAULT_WARNING_THRESHOLD_KM,
): Pick<ComponentWithStatus, 'remainingKm' | 'progressPercentage' | 'statusLevel'> => {
  const remainingKm = component.lastServiceKm + component.intervalKm - currentKm;
  const progressPercentage = component.intervalKm > 0
    ? Math.min(100, Math.max(0, ((currentKm - component.lastServiceKm) / component.intervalKm) * 100))
    : 0;
  const statusLevel: ComponentStatusLevel =
    remainingKm <= 0 ? 'overdue' : remainingKm <= warningThresholdKm ? 'warning' : 'safe';

  return { remainingKm, progressPercentage, statusLevel };
};

export const withComponentStatus = (
  component: Component,
  currentKm: number,
  warningThresholdKm?: number,
): ComponentWithStatus => ({
  ...component,
  ...computeComponentStatus(component, currentKm, warningThresholdKm),
});

export const getStatusColor = (status: ComponentStatusLevel) => {
  switch (status) {
    case 'safe':
      return COLORS.green;
    case 'warning':
      return COLORS.yellow;
    case 'overdue':
      return COLORS.pink;
    default:
      return COLORS.textSecondary;
  }
};

export const getProgressColor = (status: ComponentStatusLevel) => {
  switch (status) {
    case 'safe':
      return COLORS.success;
    case 'warning':
      return COLORS.warning;
    case 'overdue':
      return COLORS.error;
    default:
      return COLORS.textSecondary;
  }
};

const formatKm = (km: number) =>
  Math.round(Math.abs(km)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/**
 * PRD 5.2: "Sisa km sebelum harus ganti (atau 'Sudah lewat X km')".
 */
export const getStatusText = (remainingKm: number) => {
  if (remainingKm <= 0) {
    return `LEWAT ${formatKm(remainingKm)} KM`;
  }

  return `SISA ${formatKm(remainingKm)} KM`;
};
