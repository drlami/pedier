/**
 * WHO Growth Standards Data (Simplified for Plotting)
 * Range: 0 - 60 months
 * Points: Median (M), -2SD, +2SD
 */

export interface GrowthPoint {
  month: number;
  p3: number;   // -2SD
  p15: number;  // -1SD
  p50: number;  // Median
  p85: number;  // +1SD
  p97: number;  // +2SD
}

export const WHO_WEIGHT_BOYS: GrowthPoint[] = [
  { month: 0, p3: 2.5, p15: 2.9, p50: 3.3, p85: 3.9, p97: 4.4 },
  { month: 6, p3: 6.4, p15: 7.1, p50: 7.9, p85: 8.8, p97: 9.8 },
  { month: 12, p3: 7.7, p15: 8.6, p50: 9.6, p85: 10.8, p97: 12.0 },
  { month: 24, p3: 9.7, p15: 10.8, p50: 12.2, p85: 13.6, p97: 15.3 },
  { month: 36, p3: 11.3, p15: 12.7, p50: 14.3, p85: 16.2, p97: 18.3 },
  { month: 48, p3: 12.7, p15: 14.4, p50: 16.3, p85: 18.5, p97: 21.2 },
  { month: 60, p3: 14.1, p15: 16.0, p50: 18.3, p85: 21.0, p97: 24.2 },
];

export const WHO_WEIGHT_GIRLS: GrowthPoint[] = [
  { month: 0, p3: 2.4, p15: 2.8, p50: 3.2, p85: 3.7, p97: 4.2 },
  { month: 6, p3: 5.8, p15: 6.5, p50: 7.3, p85: 8.2, p97: 9.2 },
  { month: 12, p3: 7.0, p15: 7.9, p50: 8.9, p85: 10.1, p97: 11.5 },
  { month: 24, p3: 9.0, p15: 10.2, p50: 11.5, p85: 13.0, p97: 14.8 },
  { month: 36, p3: 10.8, p15: 12.2, p50: 13.9, p85: 15.8, p97: 18.1 },
  { month: 48, p3: 12.3, p15: 14.0, p50: 16.1, p85: 18.4, p97: 21.5 },
  { month: 60, p3: 13.7, p15: 15.8, p50: 18.2, p85: 21.0, p97: 24.9 },
];

export const WHO_HEIGHT_BOYS: GrowthPoint[] = [
  { month: 0, p3: 46.1, p15: 48.0, p50: 49.9, p85: 51.8, p97: 53.7 },
  { month: 6, p3: 63.3, p15: 65.5, p50: 67.6, p85: 69.8, p97: 71.9 },
  { month: 12, p3: 71.0, p15: 73.4, p50: 75.7, p85: 78.1, p97: 80.5 },
  { month: 24, p3: 81.7, p15: 84.4, p50: 87.1, p85: 89.7, p97: 92.5 },
  { month: 36, p3: 89.9, p15: 93.0, p50: 96.1, p85: 99.2, p97: 102.3 },
  { month: 48, p3: 96.4, p15: 99.9, p50: 103.3, p85: 106.7, p97: 110.2 },
  { month: 60, p3: 102.3, p15: 106.2, p50: 110.0, p85: 113.9, p97: 117.7 },
];

export const WHO_HEIGHT_GIRLS: GrowthPoint[] = [
  { month: 0, p3: 45.4, p15: 47.3, p50: 49.1, p85: 51.0, p97: 52.9 },
  { month: 6, p3: 61.2, p15: 63.5, p50: 65.7, p85: 68.0, p97: 70.3 },
  { month: 12, p3: 68.9, p15: 71.4, p50: 74.0, p85: 76.6, p97: 79.2 },
  { month: 24, p3: 80.0, p15: 83.2, p50: 86.4, p85: 89.6, p97: 92.9 },
  { month: 36, p3: 88.4, p15: 91.8, p50: 95.1, p85: 98.4, p97: 101.8 },
  { month: 48, p3: 95.2, p15: 99.0, p50: 102.7, p85: 106.5, p97: 110.2 },
  { month: 60, p3: 101.3, p15: 105.4, p50: 109.4, p85: 113.5, p97: 117.5 },
];

export const WHO_HC_BOYS: GrowthPoint[] = [
  { month: 0, p3: 32.1, p15: 33.3, p50: 34.5, p85: 35.8, p97: 36.9 },
  { month: 6, p3: 41.0, p15: 42.1, p50: 43.3, p85: 44.5, p97: 45.6 },
  { month: 12, p3: 43.9, p15: 45.0, p50: 46.1, p85: 47.3, p97: 48.3 },
  { month: 24, p3: 45.9, p15: 47.1, p50: 48.3, p85: 49.5, p97: 50.7 },
  { month: 36, p3: 47.2, p15: 48.4, p50: 49.5, p85: 50.7, p97: 51.9 },
  { month: 48, p3: 48.1, p15: 49.3, p50: 50.4, p85: 51.6, p97: 52.8 },
  { month: 60, p3: 48.8, p15: 50.0, p50: 51.1, p85: 52.3, p97: 53.5 },
];

export const WHO_HC_GIRLS: GrowthPoint[] = [
  { month: 0, p3: 31.7, p15: 32.8, p50: 33.9, p85: 35.1, p97: 36.1 },
  { month: 6, p3: 39.7, p15: 40.9, p50: 42.2, p85: 43.4, p97: 44.6 },
  { month: 12, p3: 42.6, p15: 43.8, p50: 45.0, p85: 46.2, p97: 47.4 },
  { month: 24, p3: 44.8, p15: 46.0, p50: 47.2, p85: 48.4, p97: 49.6 },
  { month: 36, p3: 46.1, p15: 47.3, p50: 48.5, p85: 49.7, p97: 50.9 },
  { month: 48, p3: 47.1, p15: 48.3, p50: 49.5, p85: 50.7, p97: 51.9 },
  { month: 60, p3: 47.8, p15: 49.1, p50: 50.2, p85: 51.5, p97: 52.7 },
];

/**
 * BP reference by age and sex — AAP 2017 Clinical Practice Guideline.
 * Ages 1–12: 95th percentile at 50th height percentile (linear regression).
 * Ages 13+:  fixed adult ACC/AHA thresholds per AAP 2017 adolescent alignment.
 * IMPORTANT: ER screening estimates only — confirmed HTN workup needs full nomogram.
 */
export const calculateSimplifiedBPPercentile = (ageYears: number, sex: 'male' | 'female') => {
  let systolic95: number;
  let diastolic95: number;
  const isAdult = ageYears >= 13;

  if (isAdult) {
    // AAP 2017: adolescents ≥13 → adult ACC/AHA Stage 1 threshold
    systolic95  = 130;
    diastolic95 = 80;
  } else if (ageYears <= 5) {
    // Ages 1–5: fitted to AAP 2017 Table 3/4 (50th height %ile)
    systolic95  = sex === 'male' ? 96 + ageYears * 2.0 : 98 + ageYears * 1.8;
    diastolic95 = sex === 'male' ? 49 + ageYears * 2.8 : 50 + ageYears * 2.5;
  } else {
    // Ages 6–12: fitted to AAP 2017 Table 3/4 (50th height %ile)
    systolic95  = sex === 'male' ? 96 + ageYears * 2.0 : 98 + ageYears * 1.8;
    diastolic95 = 54 + ageYears * 1.8; // male ≈ female for ages 6–12 per AAP 2017
  }

  // 90th %ile (elevated threshold): adults use fixed SBP 120; children use 95th − 5
  const systolic90  = isAdult ? 120 : systolic95 - 5;
  const diastolic90 = isAdult ? 80  : diastolic95 - 5;

  // 50th %ile (median normal) — display reference only, does not affect classification
  const systolic50  = isAdult ? 112 : Math.round(systolic95  - (ageYears <= 5 ? 15 : 17));
  const diastolic50 = isAdult ? 72  : Math.round(diastolic95 - (ageYears <= 5 ? 11 : 13));

  return {
    systolic50,
    systolic90:  Math.round(systolic90),
    systolic95:  Math.round(systolic95),
    diastolic50,
    diastolic90: Math.round(diastolic90),
    diastolic95: Math.round(diastolic95),
    isAdultCriteria: isAdult,
  };
};

/**
 * Preterm neonatal BP reference — Zubrow 1995 / Nuntnarumit 1999.
 * Corrected vs prior version: MAP formula better fits GA 28–32 anchor values;
 * pulse pressure is now GA-dependent (widens with maturity/PDA dynamics);
 * spread widened to ±12 mmHg to match published ~±13 mmHg 5th–95th range.
 * IMPORTANT: NICU/ER screening estimates only. Confirm with full bedside assessment.
 */
export const calculatePretermBPReference = (gaWeeks: number, postnatalDay: number) => {
  // Improved MAP fit vs Zubrow 1995 / Nuntnarumit 1999 anchor values
  const map50 = gaWeeks + 5 + (postnatalDay - 1) * 2;

  // GA-dependent pulse pressure: widens with maturity and PDA dynamics
  // GA 24 → ~18 mmHg; GA 28 → ~25 mmHg; GA 32 → ~30 mmHg
  const pp = (gaWeeks - 23) * 1.5 + 17;

  const sbp50 = map50 + Math.round((2 / 3) * pp);
  const dbp50 = map50 - Math.round((1 / 3) * pp);
  const spread = 12; // ≈ 2 SD, matches published 5th–95th range (~±13 mmHg)

  return {
    sbp5:  Math.round(sbp50 - spread),
    sbp50: Math.round(sbp50),
    sbp95: Math.round(sbp50 + spread),
    dbp5:  Math.round(dbp50 - spread),
    dbp50: Math.round(dbp50),
    dbp95: Math.round(dbp50 + spread),
    map5:  Math.round(map50 - spread),
    map50: Math.round(map50),
    map95: Math.round(map50 + spread),
    // GA rule: MAP ≥ GA weeks. mapSevere (GA−5) is a practical approximation;
    // no single validated threshold exists in the literature.
    mapHypotension: gaWeeks,
    mapSevere:      gaWeeks - 5,
  };
};

/**
 * Fenton 2013 Preterm Growth Chart Reference Data
 * Source: Fenton TR, Kim JH. BMC Pediatrics. 2013;13:59.
 * Biweekly reference points (22–50 weeks PMA); intermediate weeks are
 * linearly interpolated at display time.
 * Percentiles: p3/p10/p50/p90/p97 (correct clinical cutoffs for SGA/AGA/LGA).
 * Note: these are clinical approximations — exact values require the published
 * LMS parameter tables from the original paper.
 */
export interface FentonPoint {
  week: number;
  p3: number;
  p10: number;
  p50: number;
  p90: number;
  p97: number;
}

export const FENTON_WEIGHT_BOYS: FentonPoint[] = [
  { week: 22, p3: 0.36, p10: 0.41, p50: 0.57, p90: 0.76, p97: 0.87 },
  { week: 24, p3: 0.49, p10: 0.56, p50: 0.76, p90: 1.01, p97: 1.14 },
  { week: 26, p3: 0.67, p10: 0.76, p50: 1.00, p90: 1.30, p97: 1.47 },
  { week: 28, p3: 0.88, p10: 1.01, p50: 1.31, p90: 1.67, p97: 1.90 },
  { week: 30, p3: 1.15, p10: 1.31, p50: 1.67, p90: 2.10, p97: 2.38 },
  { week: 32, p3: 1.49, p10: 1.69, p50: 2.12, p90: 2.63, p97: 2.97 },
  { week: 34, p3: 1.88, p10: 2.13, p50: 2.62, p90: 3.21, p97: 3.61 },
  { week: 36, p3: 2.30, p10: 2.59, p50: 3.14, p90: 3.81, p97: 4.27 },
  { week: 38, p3: 2.68, p10: 3.02, p50: 3.59, p90: 4.32, p97: 4.82 },
  { week: 40, p3: 2.97, p10: 3.32, p50: 3.76, p90: 4.44, p97: 4.93 },
  { week: 42, p3: 3.23, p10: 3.58, p50: 4.05, p90: 4.73, p97: 5.23 },
  { week: 44, p3: 3.46, p10: 3.82, p50: 4.33, p90: 5.03, p97: 5.56 },
  { week: 46, p3: 3.68, p10: 4.05, p50: 4.59, p90: 5.31, p97: 5.86 },
  { week: 48, p3: 3.88, p10: 4.27, p50: 4.84, p90: 5.57, p97: 6.14 },
  { week: 50, p3: 4.07, p10: 4.48, p50: 5.07, p90: 5.82, p97: 6.41 },
];

export const FENTON_WEIGHT_GIRLS: FentonPoint[] = [
  { week: 22, p3: 0.33, p10: 0.38, p50: 0.53, p90: 0.72, p97: 0.82 },
  { week: 24, p3: 0.45, p10: 0.52, p50: 0.71, p90: 0.96, p97: 1.09 },
  { week: 26, p3: 0.61, p10: 0.70, p50: 0.93, p90: 1.22, p97: 1.38 },
  { week: 28, p3: 0.81, p10: 0.94, p50: 1.22, p90: 1.57, p97: 1.78 },
  { week: 30, p3: 1.05, p10: 1.22, p50: 1.56, p90: 1.99, p97: 2.25 },
  { week: 32, p3: 1.36, p10: 1.57, p50: 1.99, p90: 2.50, p97: 2.81 },
  { week: 34, p3: 1.73, p10: 1.99, p50: 2.47, p90: 3.06, p97: 3.43 },
  { week: 36, p3: 2.12, p10: 2.43, p50: 2.97, p90: 3.64, p97: 4.07 },
  { week: 38, p3: 2.47, p10: 2.82, p50: 3.40, p90: 4.13, p97: 4.60 },
  { week: 40, p3: 2.77, p10: 3.14, p50: 3.74, p90: 4.50, p97: 5.00 },
  { week: 42, p3: 3.02, p10: 3.42, p50: 4.06, p90: 4.84, p97: 5.38 },
  { week: 44, p3: 3.24, p10: 3.66, p50: 4.34, p90: 5.15, p97: 5.72 },
  { week: 46, p3: 3.45, p10: 3.88, p50: 4.62, p90: 5.43, p97: 6.02 },
  { week: 48, p3: 3.64, p10: 4.08, p50: 4.83, p90: 5.70, p97: 6.31 },
  { week: 50, p3: 3.82, p10: 4.27, p50: 5.04, p90: 5.96, p97: 6.58 },
];

export const FENTON_LENGTH_BOYS: FentonPoint[] = [
  { week: 22, p3: 24.7, p10: 25.6, p50: 27.4, p90: 29.3, p97: 30.3 },
  { week: 24, p3: 27.5, p10: 28.6, p50: 30.5, p90: 32.5, p97: 33.6 },
  { week: 26, p3: 30.1, p10: 31.3, p50: 33.3, p90: 35.4, p97: 36.6 },
  { week: 28, p3: 32.5, p10: 33.8, p50: 35.9, p90: 38.1, p97: 39.3 },
  { week: 30, p3: 34.8, p10: 36.1, p50: 38.3, p90: 40.6, p97: 41.9 },
  { week: 32, p3: 36.9, p10: 38.3, p50: 40.6, p90: 43.0, p97: 44.4 },
  { week: 34, p3: 38.9, p10: 40.4, p50: 42.9, p90: 45.4, p97: 46.8 },
  { week: 36, p3: 40.9, p10: 42.5, p50: 45.0, p90: 47.6, p97: 49.1 },
  { week: 38, p3: 42.8, p10: 44.4, p50: 46.9, p90: 49.7, p97: 51.2 },
  { week: 40, p3: 44.6, p10: 46.2, p50: 48.7, p90: 51.6, p97: 53.2 },
  { week: 42, p3: 46.0, p10: 47.7, p50: 50.3, p90: 53.2, p97: 54.9 },
  { week: 44, p3: 47.3, p10: 49.1, p50: 51.7, p90: 54.6, p97: 56.4 },
  { week: 46, p3: 48.5, p10: 50.3, p50: 53.0, p90: 55.9, p97: 57.8 },
  { week: 48, p3: 49.7, p10: 51.5, p50: 54.2, p90: 57.2, p97: 59.1 },
  { week: 50, p3: 50.8, p10: 52.7, p50: 55.4, p90: 58.5, p97: 60.4 },
];

export const FENTON_LENGTH_GIRLS: FentonPoint[] = [
  { week: 22, p3: 24.2, p10: 25.2, p50: 27.0, p90: 28.9, p97: 29.9 },
  { week: 24, p3: 27.0, p10: 28.1, p50: 30.0, p90: 32.0, p97: 33.1 },
  { week: 26, p3: 29.5, p10: 30.7, p50: 32.7, p90: 34.8, p97: 36.0 },
  { week: 28, p3: 31.9, p10: 33.2, p50: 35.2, p90: 37.4, p97: 38.7 },
  { week: 30, p3: 34.1, p10: 35.5, p50: 37.6, p90: 39.9, p97: 41.2 },
  { week: 32, p3: 36.1, p10: 37.6, p50: 39.9, p90: 42.3, p97: 43.7 },
  { week: 34, p3: 38.2, p10: 39.8, p50: 42.2, p90: 44.6, p97: 46.0 },
  { week: 36, p3: 40.3, p10: 41.9, p50: 44.3, p90: 46.8, p97: 48.3 },
  { week: 38, p3: 42.2, p10: 43.9, p50: 46.4, p90: 49.0, p97: 50.5 },
  { week: 40, p3: 44.0, p10: 45.7, p50: 48.2, p90: 50.9, p97: 52.5 },
  { week: 42, p3: 45.5, p10: 47.2, p50: 49.8, p90: 52.5, p97: 54.1 },
  { week: 44, p3: 46.8, p10: 48.5, p50: 51.2, p90: 53.9, p97: 55.6 },
  { week: 46, p3: 48.0, p10: 49.8, p50: 52.5, p90: 55.3, p97: 57.0 },
  { week: 48, p3: 49.2, p10: 51.0, p50: 53.7, p90: 56.7, p97: 58.4 },
  { week: 50, p3: 50.3, p10: 52.1, p50: 54.9, p90: 57.9, p97: 59.7 },
];

export const FENTON_HC_BOYS: FentonPoint[] = [
  { week: 22, p3: 18.3, p10: 19.0, p50: 20.5, p90: 22.0, p97: 22.8 },
  { week: 24, p3: 20.5, p10: 21.3, p50: 22.7, p90: 24.2, p97: 25.0 },
  { week: 26, p3: 22.4, p10: 23.2, p50: 24.7, p90: 26.2, p97: 27.0 },
  { week: 28, p3: 24.1, p10: 25.0, p50: 26.5, p90: 28.1, p97: 29.0 },
  { week: 30, p3: 25.9, p10: 26.8, p50: 28.4, p90: 30.0, p97: 31.0 },
  { week: 32, p3: 27.6, p10: 28.5, p50: 30.2, p90: 31.9, p97: 32.9 },
  { week: 34, p3: 29.2, p10: 30.2, p50: 31.9, p90: 33.7, p97: 34.7 },
  { week: 36, p3: 30.8, p10: 31.8, p50: 33.6, p90: 35.4, p97: 36.5 },
  { week: 38, p3: 32.1, p10: 33.2, p50: 35.1, p90: 37.0, p97: 38.1 },
  { week: 40, p3: 33.5, p10: 34.5, p50: 36.5, p90: 38.5, p97: 39.6 },
  { week: 42, p3: 34.4, p10: 35.5, p50: 37.5, p90: 39.6, p97: 40.7 },
  { week: 44, p3: 35.2, p10: 36.3, p50: 38.4, p90: 40.5, p97: 41.7 },
  { week: 46, p3: 35.9, p10: 37.1, p50: 39.2, p90: 41.4, p97: 42.6 },
  { week: 48, p3: 36.6, p10: 37.7, p50: 39.9, p90: 42.2, p97: 43.4 },
  { week: 50, p3: 37.3, p10: 38.5, p50: 40.7, p90: 43.1, p97: 44.3 },
];

export const FENTON_HC_GIRLS: FentonPoint[] = [
  { week: 22, p3: 18.0, p10: 18.8, p50: 20.2, p90: 21.7, p97: 22.5 },
  { week: 24, p3: 20.2, p10: 21.0, p50: 22.4, p90: 23.9, p97: 24.8 },
  { week: 26, p3: 22.0, p10: 22.9, p50: 24.3, p90: 25.9, p97: 26.8 },
  { week: 28, p3: 23.7, p10: 24.6, p50: 26.1, p90: 27.7, p97: 28.7 },
  { week: 30, p3: 25.5, p10: 26.4, p50: 27.9, p90: 29.6, p97: 30.6 },
  { week: 32, p3: 27.1, p10: 28.1, p50: 29.7, p90: 31.4, p97: 32.4 },
  { week: 34, p3: 28.7, p10: 29.7, p50: 31.4, p90: 33.2, p97: 34.2 },
  { week: 36, p3: 30.2, p10: 31.2, p50: 33.0, p90: 34.9, p97: 36.0 },
  { week: 38, p3: 31.6, p10: 32.7, p50: 34.5, p90: 36.5, p97: 37.7 },
  { week: 40, p3: 32.9, p10: 34.0, p50: 35.9, p90: 38.0, p97: 39.2 },
  { week: 42, p3: 33.8, p10: 35.0, p50: 36.9, p90: 39.0, p97: 40.2 },
  { week: 44, p3: 34.6, p10: 35.8, p50: 37.8, p90: 39.9, p97: 41.2 },
  { week: 46, p3: 35.4, p10: 36.6, p50: 38.6, p90: 40.8, p97: 42.1 },
  { week: 48, p3: 36.1, p10: 37.3, p50: 39.3, p90: 41.6, p97: 42.9 },
  { week: 50, p3: 36.8, p10: 38.0, p50: 40.1, p90: 42.3, p97: 43.6 },
];
