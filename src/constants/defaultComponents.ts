import type { Motor } from "../types";

export interface DefaultComponentTemplate {
  name: string;
  intervalKm: number;
}

// PRD 5.3 — default component tables per fuel/transmission combination.
// First 5 of each list are pinned to the dashboard by default (PRD 5.2).
const BENSIN_MANUAL: DefaultComponentTemplate[] = [
  { name: "Oli mesin", intervalKm: 2000 },
  { name: "Tune-up / servis umum", intervalKm: 4000 },
  { name: "Filter udara", intervalKm: 8000 },
  { name: "Busi", intervalKm: 8000 },
  { name: "Rantai", intervalKm: 5000 },
  { name: "Gir depan & belakang", intervalKm: 15000 },
  { name: "Oli gardan / transmisi", intervalKm: 10000 },
  { name: "Kopling", intervalKm: 15000 },
  { name: "Kampas rem depan", intervalKm: 15000 },
  { name: "Kampas rem belakang", intervalKm: 10000 },
  { name: "Ban depan", intervalKm: 20000 },
  { name: "Ban belakang", intervalKm: 15000 },
  { name: "Aki", intervalKm: 24000 },
];

const BENSIN_MATIC: DefaultComponentTemplate[] = [
  { name: "Oli mesin", intervalKm: 2000 },
  { name: "Tune-up / servis umum", intervalKm: 4000 },
  { name: "Filter udara", intervalKm: 8000 },
  { name: "Busi", intervalKm: 8000 },
  { name: "V-belt / drive belt", intervalKm: 20000 },
  { name: "Roller CVT", intervalKm: 12000 },
  { name: "Kampas CVT", intervalKm: 20000 },
  { name: "Oli gardan", intervalKm: 8000 },
  { name: "Kampas rem depan", intervalKm: 15000 },
  { name: "Kampas rem belakang", intervalKm: 10000 },
  { name: "Ban depan", intervalKm: 20000 },
  { name: "Ban belakang", intervalKm: 15000 },
  { name: "Aki", intervalKm: 24000 },
];

const LISTRIK: DefaultComponentTemplate[] = [
  { name: "Cek kondisi baterai", intervalKm: 5000 },
  { name: "Servis motor penggerak (brushless)", intervalKm: 10000 },
  { name: "Cek kabel & konektor", intervalKm: 12000 },
  { name: "Pelumasan suspensi", intervalKm: 10000 },
  { name: "Minyak rem", intervalKm: 10000 },
  { name: "Kampas rem depan", intervalKm: 15000 },
  { name: "Kampas rem belakang", intervalKm: 10000 },
  { name: "Ban depan", intervalKm: 20000 },
  { name: "Ban belakang", intervalKm: 15000 },
  { name: "Aki 12V (pendukung aksesoris)", intervalKm: 18000 },
];

export const DEFAULT_PINNED_COUNT = 5;

export const getDefaultComponentTemplates = (
  fuelType: Motor["fuelType"],
  transmission: Motor["transmission"],
): DefaultComponentTemplate[] => {
  if (fuelType === "listrik") return LISTRIK;
  return transmission === "manual" ? BENSIN_MANUAL : BENSIN_MATIC;
};
