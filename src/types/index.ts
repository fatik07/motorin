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
export interface Component {
  id: string;
  motorId: string;
  name: string;
  category: 'engine' | 'brake' | 'tire' | 'battery' | 'other';
  installDate?: string;
  installKm?: number;
  lifespan?: number; // in km or days
  status: 'good' | 'warning' | 'critical';
  notes?: string;
}

export interface ComponentWithStatus extends Component {
  remainingKm: number;
  progressPercentage: number;
}

// User Types
export interface User {
  id: string;
  name: string;
  email?: string;
  photoUri?: string;
}
