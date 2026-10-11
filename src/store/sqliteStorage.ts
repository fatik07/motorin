import { Storage } from "expo-sqlite/kv-store";
import { createJSONStorage } from "zustand/middleware";

// Backs zustand `persist` with the SQLite-based key-value store from
// expo-sqlite instead of localStorage, so app state survives restarts.
export const sqliteJSONStorage = createJSONStorage(() => Storage);
