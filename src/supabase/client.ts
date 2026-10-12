import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import { Storage } from "expo-sqlite/kv-store";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        "Missing EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY — check .env.local",
    );
}

// Reuses the same SQLite-backed key-value store that Zustand `persist` uses
// (see src/store/sqliteStorage.ts) — it already satisfies the AsyncStorage
// shape Supabase's auth client expects for session persistence.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: Storage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
