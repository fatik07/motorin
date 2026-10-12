import * as Crypto from 'expo-crypto';

// Real UUIDs so a locally-generated id can be upserted straight into
// Supabase's `uuid` primary key columns with no server-side id mapping.
export const generateUuid = () => Crypto.randomUUID();
