import { supabase } from '../supabase/client';
import { useMotorStore } from '../store/useMotorStore';
import { useComponentStore } from '../store/useComponentStore';
import { motorToRow, componentToRow, serviceLogToRow, kmLogToRow } from './mappers';

// Push-only sync: the anonymous-auth session lives in the same local
// SQLite store as the app data, so there is exactly one device per
// identity right now — a pull could never return data this device didn't
// already write. This uploads the current local state to Supabase as a
// backup; it does not yet restore data onto a different install (that
// needs an identity-linking flow, e.g. turning the anonymous user into a
// real account before data can be pulled down elsewhere).
let isSyncing = false;

export const pushLocalChanges = async (): Promise<void> => {
    if (isSyncing) return;
    isSyncing = true;

    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return; // offline / not signed in yet — stay silent

        const userId = session.user.id;

        const { motors, kmLogs } = useMotorStore.getState();
        const { components, serviceLogs, pendingDeletedComponentIds, pendingDeletedServiceLogIds } =
            useComponentStore.getState();

        // Parents before children: components reference motors,
        // service_logs reference components, so this order matters.
        if (motors.length > 0) {
            const { error } = await supabase
                .from('motors')
                .upsert(motors.map((m) => motorToRow(m, userId)));
            if (error) throw error;
        }

        if (components.length > 0) {
            const { error } = await supabase
                .from('components')
                .upsert(components.map((c) => componentToRow(c, userId)));
            if (error) throw error;
        }

        if (serviceLogs.length > 0) {
            const { error } = await supabase
                .from('service_logs')
                .upsert(serviceLogs.map((l) => serviceLogToRow(l, userId)));
            if (error) throw error;
        }

        if (kmLogs.length > 0) {
            const { error } = await supabase
                .from('km_logs')
                .upsert(kmLogs.map((k) => kmLogToRow(k, userId)));
            if (error) throw error;
        }

        // Tombstones: components/logs removed locally (e.g. "Hapus Komponen")
        // get soft-deleted server-side, not hard-deleted, so a future pull
        // can tell "removed" apart from "never synced".
        if (pendingDeletedComponentIds.length > 0) {
            const { error } = await supabase
                .from('components')
                .update({ deleted_at: new Date().toISOString() })
                .in('id', pendingDeletedComponentIds);
            if (error) throw error;
            useComponentStore
                .getState()
                .clearPendingDeletedComponentIds(pendingDeletedComponentIds);
        }

        if (pendingDeletedServiceLogIds.length > 0) {
            const { error } = await supabase
                .from('service_logs')
                .update({ deleted_at: new Date().toISOString() })
                .in('id', pendingDeletedServiceLogIds);
            if (error) throw error;
            useComponentStore
                .getState()
                .clearPendingDeletedServiceLogIds(pendingDeletedServiceLogIds);
        }
    } catch (err) {
        console.warn(
            'Supabase push failed:',
            err instanceof Error ? err.message : err,
        );
    } finally {
        isSyncing = false;
    }
};
