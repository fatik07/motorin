// Motor Types
export interface Motor {
  id: string;
  name: string;
  fuelType: 'bensin' | 'listrik';
  transmission?: 'manual' | 'matic' | null;
  currentKm: number;
  photoUri?: string;
  brand?: string;
  model?: string;
  year?: number;
  plateNumber?: string;
  lastServiceKm?: number;
  lastServiceDate?: string;
  nextServiceKm?: number;
  oilChangeIntervalKm?: number;
}

// Service Record Types
export interface ServiceRecord {
  id: string;
  motorId: string;
  date: string;
  km: number;
  type: 'oil_change' | 'general_service' | 'repair' | 'inspection';
  description?: string;
  cost?: number;
  location?: string;
  notes?: string;
}

// Component Types
export type ComponentStatusLevel = 'safe' | 'warning' | 'overdue';

export interface Component {
  id: string;
  motorId: string;
  name: string;
  intervalKm: number; // km interval between services
  lastServiceKm: number; // km at the last service/replacement
  lastServiceDate?: string;
  isPinned: boolean;
  isHidden: boolean;
  isCustom: boolean;
  notes?: string;
}

export interface ComponentWithStatus extends Component {
  remainingKm: number; // can be negative when overdue
  progressPercentage: number; // 0-100, clamped
  statusLevel: ComponentStatusLevel;
}

// Service Log Types — "Tandai Sudah Ganti/Servis" (PRD 5.6/5.7)
export interface ServiceLog {
  id: string;
  componentId: string;
  motorId: string;
  serviceKm: number;
  serviceDate: string;
  notes?: string;
  brandUsed?: string;
  cost?: number;
}

// User Types
export interface User {
  id: string;
  name: string;
  email?: string;
  photoUri?: string;
}
