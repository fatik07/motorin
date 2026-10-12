import { supabase } from "./client";

// Signs in anonymously once per device, matching PRD's "no login required".
// Safe to call repeatedly — reuses the existing session if one is persisted.
// Non-blocking by design: the app must keep working fully offline even if
// this fails (no network, Supabase down, etc.), since local storage is the
// source of truth until the sync layer is built.
export const ensureAnonymousSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) return session;

    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
        console.warn("Supabase anonymous sign-in failed:", error.message);
        return null;
    }
    return data.session;
};
