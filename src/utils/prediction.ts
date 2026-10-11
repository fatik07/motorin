import type { KmLog } from '../types';

export interface ReplacementPrediction {
  predictedDate: Date;
  avgKmPerDay: number;
}

// PRD §4: "prediksi tgl ganti komponen berdasarkan perilaku km user tiap
// minggunya" — derives a daily usage rate from the motor's km history and
// projects forward by the component's remaining km.
export const predictReplacementDate = (
  kmLogs: KmLog[],
  remainingKm: number,
): ReplacementPrediction | null => {
  if (remainingKm <= 0) return null; // already overdue — nothing to predict

  const sorted = [...kmLogs].sort(
    (a, b) => new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime(),
  );
  if (sorted.length < 2) return null; // not enough km history yet

  const earliest = sorted[0];
  const latest = sorted[sorted.length - 1];

  const kmDelta = latest.kmValue - earliest.kmValue;
  const daysDelta =
    (new Date(latest.loggedAt).getTime() - new Date(earliest.loggedAt).getTime()) /
    (1000 * 60 * 60 * 24);

  if (kmDelta <= 0 || daysDelta <= 0) return null; // no measurable usage rate

  const avgKmPerDay = kmDelta / daysDelta;
  const daysUntilReplacement = remainingKm / avgKmPerDay;

  const predictedDate = new Date();
  predictedDate.setDate(
    predictedDate.getDate() + Math.round(daysUntilReplacement),
  );

  return { predictedDate, avgKmPerDay };
};
