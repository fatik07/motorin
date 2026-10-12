import type { Component, KmLog, Motor, ServiceLog } from '../types';

// Maps local camelCase store shapes to the snake_case rows expected by the
// Supabase tables in supabase/migrations/0001_init.sql.

export const motorToRow = (motor: Motor, userId: string) => ({
  id: motor.id,
  user_id: userId,
  name: motor.name,
  fuel_type: motor.fuelType,
  transmission: motor.transmission ?? null,
  current_km: motor.currentKm,
  photo_uri: motor.photoUri ?? null,
  brand: motor.brand ?? null,
  model: motor.model ?? null,
  year: motor.year ?? null,
  plate_number: motor.plateNumber ?? null,
});

export const componentToRow = (component: Component, userId: string) => ({
  id: component.id,
  motor_id: component.motorId,
  user_id: userId,
  name: component.name,
  interval_km: component.intervalKm,
  last_service_km: component.lastServiceKm,
  last_service_date: component.lastServiceDate ?? null,
  is_pinned: component.isPinned,
  is_hidden: component.isHidden,
  is_custom: component.isCustom,
  is_muted: component.isMuted,
  notes: component.notes ?? null,
});

export const serviceLogToRow = (log: ServiceLog, userId: string) => ({
  id: log.id,
  component_id: log.componentId,
  motor_id: log.motorId,
  user_id: userId,
  service_km: log.serviceKm,
  service_date: log.serviceDate,
  notes: log.notes ?? null,
  brand_used: log.brandUsed ?? null,
  cost: log.cost ?? null,
});

export const kmLogToRow = (log: KmLog, userId: string) => ({
  id: log.id,
  motor_id: log.motorId,
  user_id: userId,
  km_value: log.kmValue,
  logged_at: log.loggedAt,
});
