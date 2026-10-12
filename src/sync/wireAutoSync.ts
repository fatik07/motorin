import { useMotorStore } from '../store/useMotorStore';
import { useComponentStore } from '../store/useComponentStore';
import { pushLocalChanges } from './pushLocalChanges';

// Debounced so a burst of store updates from one user action (e.g. addMotor
// writing to both the motor store and the component store) coalesces into
// a single push instead of one per state tick.
const DEBOUNCE_MS = 1500;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const scheduleSyncPush = () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        debounceTimer = null;
        pushLocalChanges();
    }, DEBOUNCE_MS);
};

let wired = false;

// Reacts to any local mutation (pin/hide/mute, km update, mark serviced,
// add/remove component, add motor, ...) rather than requiring every screen
// to remember to trigger a sync after its own action.
export const wireAutoSync = () => {
    if (wired) return;
    wired = true;

    useMotorStore.subscribe(scheduleSyncPush);
    useComponentStore.subscribe(scheduleSyncPush);
};
