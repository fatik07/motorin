import { create } from 'zustand';

// Transient cross-screen UI signals — never persisted, resets on cold start.
interface UiStoreState {
  pendingOpenUpdateKm: boolean;
  requestOpenUpdateKm: () => void;
  consumeOpenUpdateKmRequest: () => void;
}

export const useUiStore = create<UiStoreState>((set) => ({
  pendingOpenUpdateKm: false,
  requestOpenUpdateKm: () => set({ pendingOpenUpdateKm: true }),
  consumeOpenUpdateKmRequest: () => set({ pendingOpenUpdateKm: false }),
}));
